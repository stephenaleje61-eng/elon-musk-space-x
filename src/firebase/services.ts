import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  limit
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL 
} from 'firebase/storage';
import { db, storage, auth, handleFirestoreError, OperationType } from './config';
import { 
  FriendRequest, 
  Conversation, 
  Message, 
  AppNotification, 
  UserProfile 
} from '../types';

// ==========================================
// FRIEND REQUEST SYSTEM
// ==========================================

export async function sendFriendRequest(
  displayName: string, 
  note: string = '', 
  photoURL?: string
): Promise<string> {
  const uid = auth.currentUser?.uid || localStorage.getItem('elon_space_visitor_id') || `visitor_${Date.now()}`;
  const requestId = `req_${uid}`;
  const requestRef = doc(db, 'friendRequests', requestId);

  // Check if request already exists
  const existingSnap = await getDoc(requestRef);
  if (existingSnap.exists()) {
    const data = existingSnap.data() as FriendRequest;
    if (data.status === 'PENDING') {
      throw new Error('You already have a pending friend request awaiting administrator review.');
    }
  }

  const now = new Date().toISOString();
  const requestData: FriendRequest = {
    id: requestId,
    senderId: uid,
    displayName: displayName.trim() || `Visitor-${uid.slice(0, 5)}`,
    photoURL: photoURL || auth.currentUser?.photoURL || `https://api.dicebear.com/7.x/identicon/svg?seed=${uid}`,
    recipientId: 'admin',
    status: 'PENDING',
    note: note.trim() || undefined,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await setDoc(requestRef, requestData);

    // Notify admin
    const notifId = `notif_admin_${Date.now()}`;
    await setDoc(doc(db, 'notifications', notifId), {
      id: notifId,
      userId: 'admin',
      type: 'friend_request',
      title: 'New Friend Request',
      message: `${requestData.displayName} sent a connection request.`,
      link: '/admin',
      read: false,
      createdAt: now,
    });

    return requestId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `friendRequests/${requestId}`);
  }
}

export function listenToUserFriendRequest(
  userId: string, 
  callback: (req: FriendRequest | null) => void
) {
  const reqRef = doc(db, 'friendRequests', `req_${userId}`);
  return onSnapshot(reqRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as FriendRequest);
    } else {
      callback(null);
    }
  }, (err) => {
    console.error('Error listening to friend request:', err);
    callback(null);
  });
}

export function listenToAllFriendRequests(
  callback: (requests: FriendRequest[]) => void
) {
  const q = query(collection(db, 'friendRequests'), orderBy('createdAt', 'desc'), limit(50));
  return onSnapshot(q, (snapshot) => {
    const list: FriendRequest[] = [];
    snapshot.forEach((d) => list.push(d.data() as FriendRequest));
    callback(list);
  }, (err) => {
    console.error('Error listening to all friend requests:', err);
    callback([]);
  });
}

export async function acceptFriendRequest(
  request: FriendRequest, 
  adminId: string = 'admin'
): Promise<void> {
  const reqRef = doc(db, 'friendRequests', request.id);
  const now = new Date().toISOString();

  try {
    // 1. Update friend request status to ACCEPTED
    await updateDoc(reqRef, {
      status: 'ACCEPTED',
      updatedAt: now,
    });

    // 2. Create or initialize one-on-one conversation
    const convId = `conv_${request.senderId}_${adminId}`;
    const convRef = doc(db, 'conversations', convId);
    
    const convData: Conversation = {
      id: convId,
      conversationId: convId,
      participants: [request.senderId, adminId],
      visitorId: request.senderId,
      visitorName: request.displayName,
      visitorPhoto: request.photoURL,
      adminId: adminId,
      lastMessage: 'Connection accepted. Welcome to the private community network!',
      lastMessageAt: now,
      lastSenderId: adminId,
      createdAt: now,
      unreadCount: 1,
    };
    await setDoc(convRef, convData, { merge: true });

    // 3. Post initial welcome message from admin
    const welcomeMsgId = `msg_${Date.now()}`;
    await setDoc(doc(db, 'messages', welcomeMsgId), {
      id: welcomeMsgId,
      conversationId: convId,
      senderId: adminId,
      senderName: 'Community Administrator',
      receiverId: request.senderId,
      text: `Hello ${request.displayName}! Your friend request has been accepted. You are now connected to the verified ELON MUSK SPACE community network. Feel free to ask questions about technology breakthroughs, products, or community initiatives.`,
      messageType: 'text',
      read: false,
      createdAt: now,
    });

    // 4. Send notification to visitor
    const notifId = `notif_${request.senderId}_${Date.now()}`;
    await setDoc(doc(db, 'notifications', notifId), {
      id: notifId,
      userId: request.senderId,
      type: 'request_accepted',
      title: 'Friend Request Accepted!',
      message: 'The administrator accepted your request. Your private 1-on-1 channel is now open.',
      link: '/messages',
      read: false,
      createdAt: now,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `friendRequests/${request.id}`);
  }
}

export async function rejectFriendRequest(
  request: FriendRequest
): Promise<void> {
  const reqRef = doc(db, 'friendRequests', request.id);
  const now = new Date().toISOString();

  try {
    await updateDoc(reqRef, {
      status: 'REJECTED',
      updatedAt: now,
    });

    const notifId = `notif_${request.senderId}_${Date.now()}`;
    await setDoc(doc(db, 'notifications', notifId), {
      id: notifId,
      userId: request.senderId,
      type: 'request_rejected',
      title: 'Friend Request Update',
      message: 'Your request could not be accepted at this time.',
      read: false,
      createdAt: now,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `friendRequests/${request.id}`);
  }
}

// ==========================================
// REAL-TIME PRIVATE MESSAGING SYSTEM
// ==========================================

export function listenToConversationMessages(
  conversationId: string, 
  callback: (messages: Message[]) => void
) {
  const q = query(
    collection(db, 'messages'),
    where('conversationId', '==', conversationId),
    orderBy('createdAt', 'asc'),
    limit(200)
  );

  return onSnapshot(q, (snapshot) => {
    const msgs: Message[] = [];
    snapshot.forEach((d) => msgs.push(d.data() as Message));
    callback(msgs);
  }, (err) => {
    console.error('Error listening to messages:', err);
    callback([]);
  });
}

export async function ensureVisitorConversation(
  visitorId: string,
  visitorName: string = 'Explorer',
  visitorPhoto?: string
): Promise<Conversation> {
  const convId = `conv_${visitorId}_admin`;
  const convRef = doc(db, 'conversations', convId);
  const now = new Date().toISOString();

  const baseConv: Conversation = {
    id: convId,
    conversationId: convId,
    participants: [visitorId, 'admin'],
    visitorId,
    visitorName,
    visitorPhoto: visitorPhoto || undefined,
    adminId: 'admin',
    lastMessage: 'Channel opened',
    lastMessageAt: now,
    lastSenderId: visitorId,
    createdAt: now,
    unreadCount: 0,
  };

  try {
    const snap = await getDoc(convRef);
    if (!snap.exists()) {
      await setDoc(convRef, baseConv, { merge: true });
      return baseConv;
    }
    return snap.data() as Conversation;
  } catch (error) {
    console.error('Error ensuring visitor conversation:', error);
    return baseConv;
  }
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  senderName: string,
  receiverId: string,
  text: string,
  imageUrl?: string
): Promise<void> {
  if (!text.trim() && !imageUrl) return;

  const msgId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const msgData: Message = {
    id: msgId,
    conversationId,
    senderId,
    senderName,
    receiverId,
    text: text.trim(),
    imageUrl: imageUrl || undefined,
    messageType: imageUrl ? 'image' : 'text',
    read: false,
    createdAt: now,
  };

  try {
    // 1. Permanently save message to Firestore 'messages' collection
    await setDoc(doc(db, 'messages', msgId), msgData);

    // 2. Safely create or update conversation metadata using setDoc merge: true
    const convRef = doc(db, 'conversations', conversationId);
    const visitorId = senderId === 'admin' ? receiverId : senderId;
    
    const convUpdatePayload: Record<string, any> = {
      id: conversationId,
      conversationId,
      participants: [visitorId, 'admin'],
      visitorId,
      adminId: 'admin',
      lastMessage: imageUrl ? '📷 [Image attachment]' : text.trim(),
      lastMessageAt: now,
      lastSenderId: senderId,
      updatedAt: now,
    };

    if (senderId !== 'admin') {
      convUpdatePayload.visitorName = senderName;
    }

    await setDoc(convRef, convUpdatePayload, { merge: true });

    // 3. Notify receiver
    const notifId = `notif_${receiverId}_${Date.now()}`;
    await setDoc(doc(db, 'notifications', notifId), {
      id: notifId,
      userId: receiverId,
      type: 'new_message',
      title: `Message from ${senderName}`,
      message: imageUrl ? 'Sent an image attachment' : (text.length > 80 ? text.substring(0, 80) + '...' : text),
      link: '/messages',
      read: false,
      createdAt: now,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `messages/${msgId}`);
  }
}

export async function markMessagesAsRead(
  conversationId: string, 
  currentUserId: string
): Promise<void> {
  try {
    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      where('receiverId', '==', currentUserId),
      where('read', '==', false)
    );
    const snap = await getDocs(q);
    const updates = snap.docs.map((d) => updateDoc(d.ref, { read: true }));
    await Promise.all(updates);
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
}

export function listenToAdminConversations(
  callback: (conversations: Conversation[]) => void
) {
  const q = query(collection(db, 'conversations'), orderBy('lastMessageAt', 'desc'), limit(50));
  return onSnapshot(q, (snapshot) => {
    const list: Conversation[] = [];
    snapshot.forEach((d) => list.push(d.data() as Conversation));
    callback(list);
  }, (err) => {
    console.error('Error listening to admin conversations:', err);
    callback([]);
  });
}

export function listenToVisitorConversation(
  visitorId: string, 
  callback: (conversation: Conversation) => void
) {
  const convId = `conv_${visitorId}_admin`;
  const convRef = doc(db, 'conversations', convId);

  // Return baseline representation if doc does not exist yet
  const defaultConv: Conversation = {
    id: convId,
    conversationId: convId,
    participants: [visitorId, 'admin'],
    visitorId,
    visitorName: `Explorer-${visitorId.slice(-4).toUpperCase()}`,
    adminId: 'admin',
    createdAt: new Date().toISOString(),
  };

  return onSnapshot(convRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as Conversation);
    } else {
      callback(defaultConv);
    }
  }, (err) => {
    console.error('Error listening to visitor conversation:', err);
    callback(defaultConv);
  });
}

// ==========================================
// IMAGE UPLOAD & STORAGE
// ==========================================

export async function uploadChatImage(
  file: File, 
  userId: string, 
  onProgress?: (percent: number) => void
): Promise<string> {
  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid image format. Supported formats: JPEG, PNG, WebP, GIF.');
  }

  // Validate file size (max 5MB)
  const MAX_SIZE_MB = 5;
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`Image size exceeds the ${MAX_SIZE_MB}MB limit.`);
  }

  try {
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const storagePath = `chat_images/${userId}/${timestamp}_${safeName}`;
    const storageRef = ref(storage, storagePath);

    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(Math.round(progress));
        },
        async (error) => {
          console.warn('Firebase Storage upload failed or restricted, falling back to secure data URL:', error);
          // Resilient Data URL fallback
          try {
            const reader = new FileReader();
            reader.onloadend = () => {
              if (reader.result) {
                resolve(reader.result as string);
              } else {
                reject(new Error('Failed to read image buffer'));
              }
            };
            reader.readAsDataURL(file);
          } catch (readErr) {
            reject(readErr);
          }
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadUrl);
          } catch (urlError) {
            console.warn('Could not get download URL, falling back to data URL:', urlError);
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          }
        }
      );
    });
  } catch (err) {
    console.error('Image upload failed:', err);
    throw err;
  }
}

// ==========================================
// NOTIFICATIONS
// ==========================================

export function listenToNotifications(
  userId: string, 
  callback: (notifs: AppNotification[]) => void
) {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(20)
  );

  return onSnapshot(q, (snapshot) => {
    const list: AppNotification[] = [];
    snapshot.forEach((d) => list.push(d.data() as AppNotification));
    callback(list);
  }, (err) => {
    console.error('Error listening to notifications:', err);
    callback([]);
  });
}

export async function markNotificationAsRead(notifId: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'notifications', notifId), { read: true });
  } catch (e) {
    console.error('Error updating notification:', e);
  }
}

// ==========================================
// USER MANAGEMENT & BLOCK LIST
// ==========================================

export function listenToAllUsers(callback: (users: UserProfile[]) => void) {
  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(100));
  return onSnapshot(q, (snapshot) => {
    const list: UserProfile[] = [];
    snapshot.forEach((d) => list.push(d.data() as UserProfile));
    callback(list);
  }, (err) => {
    console.error('Error listening to users:', err);
    callback([]);
  });
}

export async function blockUser(userId: string, reason: string = 'Violation of community standards'): Promise<void> {
  const now = new Date().toISOString();
  try {
    await setDoc(doc(db, 'blockedUsers', userId), {
      userId,
      reason,
      blockedAt: now,
    });
    await updateDoc(doc(db, 'users', userId), { status: 'blocked' });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `blockedUsers/${userId}`);
  }
}

export async function unblockUser(userId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'blockedUsers', userId));
    await updateDoc(doc(db, 'users', userId), { status: 'active' });
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `blockedUsers/${userId}`);
  }
}

export function listenToBlockedUsers(callback: (blockedIds: string[]) => void) {
  return onSnapshot(collection(db, 'blockedUsers'), (snapshot) => {
    const list: string[] = [];
    snapshot.forEach((d) => list.push(d.id));
    callback(list);
  }, (err) => {
    console.error('Error listening to blocked users:', err);
    callback([]);
  });
}

// ==========================================
// MESSAGE MODERATION
// ==========================================

export async function deleteMessage(messageId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'messages', messageId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `messages/${messageId}`);
  }
}

// ==========================================
// SPACE INVESTMENT & ACCREDITED ALLOCATION
// ==========================================

export async function submitInvestmentInquiry(data: {
  investorName: string;
  organization?: string;
  email: string;
  phone?: string;
  investorType: 'Individual Accredited' | 'Family Office' | 'Venture Fund' | 'Institutional Syndicate' | 'Sovereign Fund';
  targetSector: string;
  targetAmount: string;
  timeline?: string;
  notes?: string;
}): Promise<string> {
  const uid = auth.currentUser?.uid || localStorage.getItem('elon_space_visitor_id') || `investor_${Date.now()}`;
  const inquiryId = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const record = {
    id: inquiryId,
    userId: uid,
    ...data,
    status: 'SUBMITTED',
    createdAt: now,
  };

  try {
    await setDoc(doc(db, 'investments', inquiryId), record);

    // Notify Administrator
    const notifId = `notif_admin_inv_${Date.now()}`;
    await setDoc(doc(db, 'notifications', notifId), {
      id: notifId,
      userId: 'admin',
      type: 'investment_inquiry',
      title: 'New Space Capital Allocation Inquiry',
      message: `${data.investorName} (${data.investorType}) submitted inquiry for ${data.targetAmount} in ${data.targetSector}.`,
      link: '/admin',
      read: false,
      createdAt: now,
    });

    return inquiryId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `investments/${inquiryId}`);
  }
}

export function listenToInvestmentInquiries(callback: (inquiries: any[]) => void) {
  const q = query(collection(db, 'investments'), orderBy('createdAt', 'desc'), limit(50));
  return onSnapshot(q, (snapshot) => {
    const list: any[] = [];
    snapshot.forEach((d) => list.push(d.data()));
    callback(list);
  }, (err) => {
    console.error('Error listening to investment inquiries:', err);
    callback([]);
  });
}

export async function updateInvestmentStatus(inquiryId: string, status: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'investments', inquiryId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `investments/${inquiryId}`);
  }
}
