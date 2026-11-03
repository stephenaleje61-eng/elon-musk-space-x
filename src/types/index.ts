export interface UserProfile {
  uid: string;
  displayName: string;
  photoURL?: string;
  email?: string;
  role?: 'visitor' | 'admin';
  status?: 'active' | 'blocked';
  about?: string;
  online?: boolean;
  lastSeen?: string;
  createdAt: string;
  isAnonymous?: boolean;
}

export type FriendRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface FriendRequest {
  id: string;
  senderId: string;
  displayName: string;
  photoURL?: string;
  recipientId: string;
  status: FriendRequestStatus;
  note?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Conversation {
  id: string;
  conversationId?: string;
  participants: string[];
  visitorId: string;
  visitorName: string;
  visitorPhoto?: string;
  visitorEmail?: string;
  visitorOnline?: boolean;
  visitorLastSeen?: string;
  adminId: string;
  lastMessage?: string;
  lastMessageAt?: string;
  lastSenderId?: string;
  createdAt: string;
  unreadCount?: number;
}

export interface MessageReplyContext {
  id: string;
  senderName: string;
  text: string;
  imageUrl?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName?: string;
  receiverId: string;
  text: string;
  imageUrl?: string;
  messageType: 'text' | 'image';
  read: boolean;
  status?: 'sent' | 'delivered' | 'read';
  deliveredAt?: string;
  readAt?: string;
  replyTo?: MessageReplyContext;
  createdAt: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: 'Electric Vehicles' | 'Energy' | 'Space Technology' | 'Robotics' | 'Internet' | 'Artificial Intelligence';
  company: string;
  description: string;
  specs: Record<string, string>;
  features: string[];
  imageUrl: string;
  officialUrl: string;
  availability: string;
  featured?: boolean;
}

export interface CompanyInfo {
  id: string;
  name: string;
  tagline: string;
  founded: string;
  headquarters: string;
  officialUrl: string;
  logo: string;
  bannerImage: string;
  description: string;
  isHistorical?: boolean;
  historicalNote?: string;
  keyProducts: string[];
  keyTechnologies: string[];
  stats: { label: string; value: string }[];
}

export interface InvestmentInquiry {
  id: string;
  userId: string;
  investorName: string;
  organization?: string;
  email: string;
  phone?: string;
  investorType: 'Individual Accredited' | 'Family Office' | 'Venture Fund' | 'Institutional Syndicate' | 'Sovereign Fund';
  targetSector: string;
  targetAmount: string;
  timeline?: string;
  notes?: string;
  status: 'SUBMITTED' | 'IN_REVIEW' | 'CONNECTED' | 'DECLINED';
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: 'friend_request' | 'request_accepted' | 'request_rejected' | 'new_message' | 'investment_inquiry' | 'system';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface CommunityDiscussion {
  id: string;
  author: string;
  avatar: string;
  badge?: string;
  companyTag: string;
  title: string;
  snippet: string;
  likes: number;
  replies: number;
  timeAgo: string;
}
