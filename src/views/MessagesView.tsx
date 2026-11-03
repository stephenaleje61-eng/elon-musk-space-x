import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Image as ImageIcon, 
  X, 
  CheckCheck, 
  Check, 
  ShieldCheck, 
  AlertCircle, 
  Trash2, 
  Sparkles, 
  UserPlus, 
  ArrowLeft, 
  Maximize2, 
  ChevronRight, 
  Info,
  Reply,
  CornerDownRight,
  Search
} from 'lucide-react';
import { useAuth } from '../firebase/authContext';
import { 
  listenToConversationMessages, 
  sendMessage, 
  markMessagesAsRead, 
  uploadChatImage, 
  listenToUserFriendRequest, 
  listenToAdminConversations, 
  listenToVisitorConversation, 
  ensureVisitorConversation,
  deleteMessage,
  updateUserPresence
} from '../firebase/services';
import { Message, Conversation, FriendRequest, MessageReplyContext } from '../types';
import { SafeImage } from '../components/SafeImage';

interface MessagesViewProps {
  onOpenFriendModal: () => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({ onOpenFriendModal }) => {
  const { user, profile, isAdmin } = useAuth();
  
  const [friendRequest, setFriendRequest] = useState<FriendRequest | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mobile responsive view mode: 'list' | 'thread'
  const [mobileView, setMobileView] = useState<'list' | 'thread'>('list');

  // Quoted Reply Context (Messenger style)
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  // Image Upload State
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Lightbox modal state for full-screen image inspection
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 1. Maintain user online status
  useEffect(() => {
    if (!user) return;
    updateUserPresence(user.uid, true);

    const handleVisibility = () => {
      updateUserPresence(user.uid, document.visibilityState === 'visible');
    };

    const handleBeforeUnload = () => {
      updateUserPresence(user.uid, false);
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      updateUserPresence(user.uid, false);
    };
  }, [user]);

  // 2. Listen to user's friend request
  useEffect(() => {
    if (!user) return;
    const unsub = listenToUserFriendRequest(user.uid, (req) => {
      setFriendRequest(req);
    });
    return () => unsub();
  }, [user]);

  // 3. Conversation Management
  useEffect(() => {
    if (!user) return;

    if (isAdmin) {
      const unsub = listenToAdminConversations((convList) => {
        setConversations(convList);
        if (convList.length > 0 && !activeConversation) {
          setActiveConversation(convList[0]);
        }
      });
      return () => unsub();
    } else {
      const currentVisitorId = user.uid;
      const currentVisitorName = profile?.displayName || user.displayName || 'Visitor';
      const currentVisitorPhoto = profile?.photoURL || user.photoURL || undefined;

      ensureVisitorConversation(currentVisitorId, currentVisitorName, currentVisitorPhoto)
        .then((initialConv) => {
          setActiveConversation((prev) => prev || initialConv);
        })
        .catch(console.error);

      const unsub = listenToVisitorConversation(currentVisitorId, (conv) => {
        if (conv) {
          setConversations([conv]);
          setActiveConversation(conv);
        }
      });
      return () => unsub();
    }
  }, [user, isAdmin, profile]);

  // 4. Message Streaming & Auto Mark as Read
  useEffect(() => {
    if (!activeConversation) {
      setMessages([]);
      return;
    }

    const unsub = listenToConversationMessages(activeConversation.id, (msgs) => {
      setMessages(msgs);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);

      if (user) {
        markMessagesAsRead(activeConversation.id, user.uid);
      }
    });

    return () => unsub();
  }, [activeConversation, user]);

  // Auto-scroll when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Image Selection Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid photographic image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Photographic payload exceeds the 5MB ceiling.');
      return;
    }

    setUploadError(null);
    setSelectedImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    setUploadProgress(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Send Message Handler
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeConversation || !user) return;

    const trimmedText = inputText.trim();
    if (!trimmedText && !selectedImageFile) return;

    let finalImageUrl: string | undefined = undefined;

    if (selectedImageFile) {
      try {
        setIsUploading(true);
        finalImageUrl = await uploadChatImage(
          selectedImageFile,
          user.uid,
          (progress) => setUploadProgress(progress)
        );
      } catch (err: any) {
        setUploadError(err.message || 'Image transmission failed. Please retry.');
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
        setUploadProgress(null);
      }
    }

    const receiverId = isAdmin ? activeConversation.visitorId : 'admin';
    const senderName = profile?.displayName || user.displayName || (isAdmin ? 'Community Administrator' : 'Explorer');

    // Messenger quoted reply context
    const replyContext: MessageReplyContext | undefined = replyingTo ? {
      id: replyingTo.id,
      senderName: replyingTo.senderName || 'Sender',
      text: replyingTo.text ? (replyingTo.text.length > 90 ? replyingTo.text.substring(0, 90) + '...' : replyingTo.text) : '📷 [Photograph]',
      imageUrl: replyingTo.imageUrl,
    } : undefined;

    setInputText('');
    handleClearImage();
    setReplyingTo(null);

    try {
      await sendMessage(
        activeConversation.id,
        user.uid,
        senderName,
        receiverId,
        trimmedText,
        finalImageUrl,
        replyContext
      );
    } catch (err: any) {
      console.error('Message transmission error:', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    return (
      c.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.visitorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.lastMessage && c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const quickPrompts = [
    "What is the current flight schedule for Starship at Starbase?",
    "How does the accredited space investment allocation syndicate work?",
    "Can you explain the Starlink Direct-to-Cell technical specs?",
    "What is the status of Tesla Optimus deployment in Gigafactories?"
  ];

  const handleSelectQuickPrompt = (prompt: string) => {
    setInputText(prompt);
    textareaRef.current?.focus();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 bg-black text-white">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800 pb-6 mb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>DIRECT PLATFORM PROTOCOL • REAL-TIME FIRESTORE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            PRIVATE MESSAGING
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1">
            Real-time two-way private communication with the platform administrator. Ask engineering questions, submit space syndicate interest, and share telemetry photographs.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenFriendModal}
            className="px-4 py-2 bg-transparent hover:bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Request Verified Badge"
          >
            <UserPlus className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">VERIFIED BADGE</span>
          </button>
        </div>
      </div>

      {/* Transparency Disclaimer Notice */}
      <div className="mb-4 p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs shadow-md">
        <div className="flex items-center space-x-3 text-zinc-300">
          <Info className="w-4 h-4 text-white shrink-0" />
          <span className="text-[11px] leading-relaxed">
            <strong className="text-white">Private 1-on-1 Messenger:</strong> You are communicating directly with the website administrator (elonmusk241@gmail.com). Messages are permanently preserved in Cloud Firestore with real-time delivery receipts. Not an official Elon Musk account.
          </span>
        </div>
        <div className="hidden lg:flex items-center space-x-2 shrink-0 ml-4 font-mono text-[10px] text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>FIRESTORE CLOUD SYNC ACTIVE</span>
        </div>
      </div>

      {/* Main Messenger Container */}
      <div className="bg-black border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 min-h-[660px] max-h-[820px]">
        
        {/* Left Sidebar (Conversations List) */}
        <div className={`md:col-span-4 lg:col-span-3 border-r border-zinc-800 bg-zinc-950 flex flex-col ${
          mobileView === 'thread' ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Sidebar Header & Search */}
          <div className="p-3.5 border-b border-zinc-800 bg-zinc-900 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-white tracking-widest uppercase">
                {isAdmin ? `INBOX (${conversations.length})` : 'CONVERSATION'}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>ONLINE</span>
              </span>
            </div>

            {isAdmin && (
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search visitors..."
                  className="w-full bg-black border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600"
                />
              </div>
            )}
          </div>

          {/* Conversations Scrollable List */}
          <div className="overflow-y-auto flex-1 divide-y divide-zinc-900">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-500 font-mono">
                {isAdmin ? 'No conversations matching filter.' : 'Connecting to administrator...'}
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = activeConversation?.id === conv.id;
                const title = isAdmin ? conv.visitorName : 'Elon Musk Space Administrator';
                const avatar = isAdmin
                  ? (conv.visitorPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.visitorName || 'Visitor')}&background=18181b&color=ffffff&bold=true`)
                  : 'https://images.unsplash.com/photo-1517976487502-5731f4786762?auto=format&fit=crop&w=200&q=80';

                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setActiveConversation(conv);
                      setMobileView('thread');
                    }}
                    className={`p-3.5 flex items-center space-x-3 cursor-pointer transition-colors ${
                      isActive ? 'bg-zinc-900 border-l-4 border-white shadow-sm' : 'hover:bg-zinc-900/60'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <SafeImage
                        src={avatar}
                        alt={title}
                        fallbackText={title}
                        className="w-10 h-10 rounded-full object-cover border border-zinc-800"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-black"></span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-white truncate">{title}</span>
                        {conv.lastMessageAt && (
                          <span className="text-[9px] text-zinc-500 shrink-0 font-mono">
                            {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate font-mono">
                        {conv.lastMessage || 'Channel active.'}
                      </p>
                    </div>

                    <ChevronRight className="w-3.5 h-3.5 text-zinc-600 md:hidden shrink-0" />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Chat Panel (Messenger Thread) */}
        <div className={`md:col-span-8 lg:col-span-9 flex flex-col bg-black h-full ${
          mobileView === 'list' ? 'hidden md:flex' : 'flex'
        }`}>
          
          {/* Active Conversation Top Bar */}
          <div className="px-5 py-3.5 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Mobile Back Button */}
              <button
                onClick={() => setMobileView('list')}
                className="md:hidden p-1.5 -ml-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
                title="Back to inbox"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="relative w-9 h-9 rounded-full bg-zinc-950 border border-zinc-800 overflow-hidden">
                <SafeImage
                  src={
                    isAdmin
                      ? (activeConversation?.visitorPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeConversation?.visitorName || 'Visitor')}&background=18181b&color=ffffff&bold=true`)
                      : 'https://images.unsplash.com/photo-1517976487502-5731f4786762?auto=format&fit=crop&w=200&q=80'
                  }
                  alt="Recipient"
                  fallbackText="USER"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-black"></span>
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <span>{isAdmin ? (activeConversation?.visitorName || 'Visitor') : 'Elon Musk Space Administrator'}</span>
                  <span className="px-1.5 py-0.2 rounded text-[8px] bg-white text-black font-mono uppercase font-bold">
                    {isAdmin ? 'Visitor' : 'ADMIN • VERIFIED'}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-400 font-mono flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Active Now • Direct Human Communication</span>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-zinc-400 font-mono flex items-center space-x-1.5 bg-zinc-950 px-2.5 py-1 rounded-full border border-zinc-800">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Encrypted Firestore 1:1</span>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-black">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white shadow-md">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                    Direct 1-on-1 Channel Ready
                  </h4>
                  <p className="text-xs text-zinc-400 max-w-md leading-relaxed">
                    Type a message below to communicate directly with the website administrator. Ask about Starship flights, orbital infrastructure, Starlink Direct-to-Cell, or syndicate investments.
                  </p>
                  <div className="pt-2 text-[10px] text-zinc-500 font-mono">
                    Messages are permanently recorded in Cloud Firestore and will never disappear.
                  </div>
                </div>

                {/* Quick Prompts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg pt-2 text-left">
                  {quickPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectQuickPrompt(prompt)}
                      className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-[11px] text-zinc-300 hover:text-white transition-all shadow-sm cursor-pointer"
                    >
                      "{prompt}"
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === user?.uid;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group relative`}
                  >
                    {/* Sender & Timestamp */}
                    <div className="text-[9px] text-zinc-500 mb-1 px-1 flex items-center space-x-1 font-mono">
                      <span>{msg.senderName || (isMe ? 'You' : 'Admin')}</span>
                      <span>•</span>
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="relative flex items-center max-w-[85%] sm:max-w-md">
                      
                      {/* Messenger Bubble:
                          - My messages: bg-white text-black rounded-br-none
                          - Other messages: bg-zinc-900 text-white border border-zinc-800 rounded-bl-none
                      */}
                      <div
                        className={`rounded-2xl p-3 sm:p-4 text-xs shadow-md transition-all relative ${
                          isMe
                            ? 'bg-white text-black rounded-br-none font-medium'
                            : 'bg-zinc-900 text-white border border-zinc-800 rounded-bl-none'
                        }`}
                      >
                        {/* Quoted Reply Snippet (if message replies to another) */}
                        {msg.replyTo && (
                          <div className={`mb-2 p-2 rounded-lg text-[10px] border-l-2 flex flex-col ${
                            isMe 
                              ? 'bg-zinc-100 border-black text-zinc-800' 
                              : 'bg-black/60 border-zinc-500 text-zinc-300'
                          }`}>
                            <span className="font-bold font-mono uppercase text-[9px] opacity-80">
                              Replying to {msg.replyTo.senderName}
                            </span>
                            <span className="line-clamp-2 italic">
                              "{msg.replyTo.text}"
                            </span>
                          </div>
                        )}

                        {/* Attached Image */}
                        {msg.imageUrl && (
                          <div className="mb-2 relative group/img rounded-xl overflow-hidden bg-black border border-zinc-800 max-h-72">
                            <SafeImage
                              src={msg.imageUrl}
                              alt="Uploaded attachment"
                              fallbackText="ATTACHMENT"
                              className="w-full h-full object-cover cursor-pointer hover:scale-[1.01] transition-transform"
                              onClick={() => setLightboxImageUrl(msg.imageUrl || null)}
                            />
                            <button
                              onClick={() => setLightboxImageUrl(msg.imageUrl || null)}
                              className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 text-white opacity-0 group-hover/img:opacity-100 transition-opacity"
                              title="Expand photograph"
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {/* Text */}
                        {msg.text && (
                          <p className="whitespace-pre-wrap leading-relaxed break-words">
                            {msg.text}
                          </p>
                        )}

                        {/* Message Delivery Status Indicator */}
                        <div className={`flex items-center justify-end space-x-1.5 mt-1.5 text-[9px] ${
                          isMe ? 'text-zinc-500' : 'text-zinc-400'
                        }`}>
                          {isMe && (
                            msg.read || msg.status === 'read' ? (
                              <span title="Read by recipient" className="flex items-center space-x-0.5 text-emerald-600 font-semibold">
                                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-[8px] font-mono uppercase">Read</span>
                              </span>
                            ) : msg.status === 'delivered' ? (
                              <span title="Delivered to recipient" className="flex items-center space-x-0.5 text-zinc-500">
                                <CheckCheck className="w-3.5 h-3.5 opacity-80" />
                                <span className="text-[8px] font-mono uppercase">Delivered</span>
                              </span>
                            ) : (
                              <span title="Sent" className="flex items-center space-x-0.5 text-zinc-500">
                                <Check className="w-3.5 h-3.5 opacity-80" />
                                <span className="text-[8px] font-mono uppercase">Sent</span>
                              </span>
                            )
                          )}
                        </div>
                      </div>

                      {/* Hover Action: Quick Reply & Delete */}
                      <div className={`absolute top-1 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                        isMe ? '-left-14' : '-right-14'
                      }`}>
                        <button
                          onClick={() => {
                            setReplyingTo(msg);
                            textareaRef.current?.focus();
                          }}
                          className="p-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 shadow-sm cursor-pointer"
                          title="Reply to message"
                        >
                          <Reply className="w-3.5 h-3.5" />
                        </button>
                        {(isAdmin || isMe) && (
                          <button
                            onClick={() => deleteMessage(msg.id, activeConversation?.id)}
                            className="p-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-red-400 hover:bg-red-950/60 shadow-sm cursor-pointer"
                            title="Delete message"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quoted Reply Banner (Messenger style) */}
          {replyingTo && (
            <div className="px-5 py-2.5 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs animate-fade-in">
              <div className="flex items-center space-x-2 text-zinc-300">
                <CornerDownRight className="w-4 h-4 text-white shrink-0" />
                <div className="text-[11px] truncate">
                  <span className="font-bold text-white">Replying to {replyingTo.senderName || 'Sender'}:</span>{' '}
                  <span className="text-zinc-400 italic truncate">
                    {replyingTo.text || (replyingTo.imageUrl ? '📷 [Photograph]' : '')}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer"
                title="Cancel reply"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Image Upload Preview Drawer */}
          {imagePreviewUrl && (
            <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between animate-fade-in">
              <div className="flex items-center space-x-3">
                <img
                  src={imagePreviewUrl}
                  alt="Attachment preview"
                  loading="lazy"
                  className="w-12 h-12 rounded-lg object-cover object-center border border-zinc-800 shadow-sm"
                />
                <div>
                  <span className="text-xs font-bold text-white block truncate max-w-xs">
                    {selectedImageFile?.name}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {selectedImageFile ? `${(selectedImageFile.size / 1024).toFixed(1)} KB` : ''}
                  </span>
                </div>
              </div>
              <button
                onClick={handleClearImage}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer"
                title="Remove attachment"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Upload Progress Indicator */}
          {uploadProgress !== null && (
            <div className="w-full bg-zinc-900 h-1">
              <div
                className="bg-white h-1 transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          {/* Upload Error Banner */}
          {uploadError && (
            <div className="px-5 py-2 bg-red-950/60 border-t border-red-800 text-red-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Message Input Form */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-end space-x-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors shrink-0 cursor-pointer"
              title="Attach photograph (JPEG, PNG, WebP up to 5MB)"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            <div className="flex-1 bg-black border border-zinc-800 rounded-2xl px-4 py-2 focus-within:border-zinc-600 transition-colors shadow-inner">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message (Enter to send, Shift+Enter for new line)..."
                rows={1}
                className="w-full bg-transparent text-xs text-white placeholder:text-zinc-500 focus:outline-none resize-none max-h-32 min-h-[24px]"
              />
            </div>

            <button
              type="submit"
              disabled={(!inputText.trim() && !selectedImageFile) || isUploading}
              className="p-3 bg-white hover:bg-zinc-200 disabled:opacity-30 text-black rounded-2xl shadow-md transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed font-bold"
              title="Send message"
            >
              <Send className="w-5 h-5 text-black" />
            </button>
          </form>

        </div>
      </div>

      {/* Lightbox Modal for High-Resolution Image Inspection */}
      {lightboxImageUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxImageUrl(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxImageUrl(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/80 text-white hover:bg-black transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxImageUrl}
              alt="Enlarged inspection"
              loading="lazy"
              className="max-h-[82vh] w-auto object-contain object-center rounded-xl"
            />
          </div>
        </div>
      )}

    </div>
  );
};
