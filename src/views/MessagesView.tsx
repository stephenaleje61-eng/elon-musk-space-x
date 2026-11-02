import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Image as ImageIcon, 
  X, 
  CheckCheck, 
  Check, 
  Clock, 
  ShieldCheck, 
  User, 
  AlertCircle, 
  Trash2, 
  Lock, 
  Sparkles, 
  UserPlus, 
  ArrowLeft, 
  Maximize2, 
  Download, 
  ChevronRight, 
  Info 
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
  deleteMessage 
} from '../firebase/services';
import { Message, Conversation, FriendRequest } from '../types';

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
  
  // Mobile responsive view mode: 'list' | 'thread'
  const [mobileView, setMobileView] = useState<'list' | 'thread'>('list');

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

  // 1. Listen to user's friend request
  useEffect(() => {
    if (!user) return;
    const unsub = listenToUserFriendRequest(user.uid, (req) => {
      setFriendRequest(req);
    });
    return () => unsub();
  }, [user]);

  // 2. Fetch conversations
  useEffect(() => {
    if (!user) return;

    if (isAdmin) {
      // Admin sees all active conversations
      const unsub = listenToAdminConversations((convList) => {
        setConversations(convList);
        if (convList.length > 0 && !activeConversation) {
          setActiveConversation(convList[0]);
        }
      });
      return () => unsub();
    } else {
      // Ensure visitor conversation document is created/merged in Firestore
      ensureVisitorConversation(
        user.uid,
        profile?.displayName || `Explorer-${user.uid.slice(-4).toUpperCase()}`,
        profile?.photoURL || undefined
      );

      // Visitor sees their private 1-on-1 conversation with the website administrator
      const unsub = listenToVisitorConversation(user.uid, (conv) => {
        setActiveConversation(conv);
        setConversations([conv]);
      });
      return () => unsub();
    }
  }, [user, isAdmin, profile]);

  // 3. Listen to real-time messages in active conversation
  useEffect(() => {
    if (!activeConversation || !user) return;

    const unsub = listenToConversationMessages(activeConversation.id, (newMessages) => {
      setMessages(newMessages);
      markMessagesAsRead(activeConversation.id, user.uid);
    });

    return () => unsub();
  }, [activeConversation, user]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, imagePreviewUrl]);

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Invalid format. Please select JPEG, PNG, WebP, or GIF.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image exceeds the 5MB file size limit.');
      return;
    }

    setUploadError(null);
    setSelectedImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const handleClearImage = () => {
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    setUploadProgress(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Quick Starter Prompts
  const quickPrompts = [
    'Inquire about Starship launch cadence & orbital tests',
    'Starlink Direct-to-Cell technical details & handsets',
    'Space capital allocation & syndicate qualification criteria',
    'Tesla Optimus humanoid deployment in Gigafactories',
  ];

  const handleSelectQuickPrompt = (prompt: string) => {
    setInputText(prompt);
    textareaRef.current?.focus();
  };

  // Send Message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user || !activeConversation) return;
    if (!inputText.trim() && !selectedImageFile) return;
    if (isUploading) return;

    setIsUploading(true);
    setUploadError(null);

    let finalImageUrl: string | undefined = undefined;

    try {
      if (selectedImageFile) {
        finalImageUrl = await uploadChatImage(
          selectedImageFile, 
          user.uid, 
          (progress) => setUploadProgress(progress)
        );
      }

      const receiverId = isAdmin ? activeConversation.visitorId : 'admin';
      const senderName = profile?.displayName || (isAdmin ? 'Community Administrator' : 'Explorer');

      await sendMessage(
        activeConversation.id,
        user.uid,
        senderName,
        receiverId,
        inputText.trim(),
        finalImageUrl
      );

      setInputText('');
      handleClearImage();
    } catch (err: any) {
      setUploadError(err.message || 'Failed to send message.');
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  // Keyboard shortcut: Enter to send, Shift+Enter for new line
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 bg-black">
      
      {/* Messaging Header */}
      <div className="border-b border-[#222222] pb-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">
              {isAdmin ? 'ADMINISTRATOR PRIVATE CHAT HUB' : 'DIRECT 1:1 PLATFORM CHANNEL • REAL-TIME FIRESTORE'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            {isAdmin ? 'COMMUNITY INBOX & REPLIES' : 'CHAT WITH ELON MUSK SPACE'}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-left sm:text-right">
            <div className="text-xs font-semibold text-white">
              {profile?.displayName || 'Explorer'}
            </div>
            <div className="text-[10px] text-white/40 font-mono">
              ID: {user?.uid ? `${user.uid.slice(0, 10)}...` : 'Connecting...'}
            </div>
          </div>

          <button
            onClick={onOpenFriendModal}
            className="px-3.5 py-1.5 rounded-lg bg-[#111111] hover:bg-[#181818] border border-[#262626] text-white text-[10px] font-mono uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
            title="Request Verified Badge"
          >
            <UserPlus className="w-3 h-3 text-white" />
            <span className="hidden sm:inline">VERIFIED BADGE</span>
          </button>
        </div>
      </div>

      {/* Transparency Disclaimer Notice */}
      <div className="mb-4 p-3 rounded-xl bg-[#0a0a0a] border border-[#222222] flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2.5 text-white/70">
          <Info className="w-4 h-4 text-white shrink-0" />
          <span className="text-[11px] leading-tight">
            <strong className="text-white">Direct 1-on-1 Channel:</strong> Messages are sent directly to the website owner & administrator, stored permanently in Firestore, and answered personally. Not an official Elon Musk account. No bots or automated simulations.
          </span>
        </div>
        <div className="hidden lg:flex items-center space-x-2 shrink-0 ml-4 font-mono text-[10px] text-white/50">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>PERMANENT FIRESTORE STORAGE</span>
        </div>
      </div>

      {/* Main Chat Layout Container */}
      <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 min-h-[640px] max-h-[780px]">
        
        {/* Left Sidebar (Conversations List) */}
        <div className={`md:col-span-4 lg:col-span-3 border-r border-[#222222] bg-black flex flex-col ${
          mobileView === 'thread' ? 'hidden md:flex' : 'flex'
        }`}>
          <div className="p-3.5 border-b border-[#222222] bg-[#0a0a0a] flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-white tracking-widest uppercase">
              {isAdmin ? `INBOX (${conversations.length})` : 'COMMUNITY STAFF'}
            </span>
            <span className="text-[9px] text-white/60 font-mono">ACTIVE</span>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-[#1f1f1f]">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-white/40 font-mono">
                {isAdmin ? 'No active conversations yet.' : 'Connecting to community administrator...'}
              </div>
            ) : (
              conversations.map((conv) => {
                const isActive = activeConversation?.id === conv.id;
                const title = isAdmin ? conv.visitorName : 'Community Administrator';
                const avatar = isAdmin
                  ? (conv.visitorPhoto || `https://api.dicebear.com/7.x/identicon/svg?seed=${conv.visitorId}`)
                  : 'https://images.unsplash.com/photo-1517976487502-5731f4786762?auto=format&fit=crop&w=200&q=80';

                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setActiveConversation(conv);
                      setMobileView('thread');
                    }}
                    className={`p-3.5 flex items-center space-x-3 cursor-pointer transition-colors ${
                      isActive ? 'bg-[#181818] border-l-2 border-white' : 'hover:bg-[#111111]'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={avatar}
                        alt={title}
                        className="w-9 h-9 rounded-full object-cover border border-[#222222] grayscale"
                      />
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-white ring-2 ring-black"></span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-white truncate">{title}</span>
                        {conv.lastMessageAt && (
                          <span className="text-[9px] text-white/40 shrink-0 font-mono">
                            {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-white/50 truncate font-mono">
                        {conv.lastMessage || 'Channel ready.'}
                      </p>
                    </div>

                    <ChevronRight className="w-3.5 h-3.5 text-white/30 md:hidden shrink-0" />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Chat Panel */}
        <div className={`md:col-span-8 lg:col-span-9 flex flex-col bg-[#0a0a0a] h-full ${
          mobileView === 'list' ? 'hidden md:flex' : 'flex'
        }`}>
          
          {/* Active Conversation Top Bar */}
          <div className="px-4 sm:px-5 py-3 border-b border-[#222222] bg-[#111111] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Mobile Back Button */}
              <button
                onClick={() => setMobileView('list')}
                className="md:hidden p-1.5 -ml-1 text-white/70 hover:text-white rounded-lg hover:bg-black/50"
                title="Back to inbox"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="w-8 h-8 rounded-full bg-[#181818] border border-[#262626] overflow-hidden">
                <img
                  src={
                    isAdmin
                      ? (activeConversation?.visitorPhoto || `https://api.dicebear.com/7.x/identicon/svg?seed=${activeConversation?.visitorId}`)
                      : 'https://images.unsplash.com/photo-1517976487502-5731f4786762?auto=format&fit=crop&w=200&q=80'
                  }
                  alt="Recipient"
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <span>{isAdmin ? (activeConversation?.visitorName || 'Visitor') : 'Elon Musk Space Administrator'}</span>
                  <span className="px-1.5 py-0.2 rounded text-[8px] bg-white/10 text-white font-mono uppercase">
                    {isAdmin ? 'Visitor' : 'SITE OWNER • 1:1'}
                  </span>
                </div>
                <div className="text-[9px] text-white/50 font-mono flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{isAdmin ? `Visitor ID: ${activeConversation?.visitorId.slice(0, 10)}...` : 'Direct human replies • No bots'}</span>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-white/40 font-mono flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Encrypted Firestore 1:1</span>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#111111] border border-[#222222] flex items-center justify-center text-white shadow-md">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                    Direct 1-on-1 Channel Ready
                  </h4>
                  <p className="text-xs text-white/60 max-w-md leading-relaxed">
                    Type a message below to communicate directly with the website owner & administrator. Inquire about Starship flights, orbital infrastructure, Starlink Direct-to-Cell, or syndicate investments.
                  </p>
                  <div className="pt-1 text-[10px] text-white/40 font-mono">
                    All messages are saved permanently in Firestore and will never disappear.
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === user?.uid;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}
                  >
                    <div className="text-[9px] text-white/40 mb-1 px-1 flex items-center space-x-1 font-mono">
                      <span>{msg.senderName || (isMe ? 'You' : 'Admin')}</span>
                      <span>•</span>
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div
                      className={`max-w-[85%] sm:max-w-md rounded-2xl p-3 sm:p-4 text-xs shadow-md transition-all ${
                        isMe
                          ? 'bg-white text-black rounded-tr-none font-medium'
                          : 'bg-[#181818] border border-[#262626] text-white rounded-tl-none'
                      }`}
                    >
                      {/* Attached Image */}
                      {msg.imageUrl && (
                        <div className="mb-2 relative group/img rounded-xl overflow-hidden bg-black/40 border border-black/20 max-h-72">
                          <img
                            src={msg.imageUrl}
                            alt="Uploaded attachment"
                            className="w-full h-full object-cover cursor-pointer hover:scale-[1.01] transition-transform grayscale"
                            onClick={() => setLightboxImageUrl(msg.imageUrl || null)}
                          />
                          <button
                            onClick={() => setLightboxImageUrl(msg.imageUrl || null)}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-white opacity-0 group-hover/img:opacity-100 transition-opacity"
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

                      {/* Message Footer Status */}
                      <div className={`flex items-center justify-end space-x-1 mt-1 text-[9px] ${
                        isMe ? 'text-black/60' : 'text-white/40'
                      }`}>
                        {isMe && (
                          msg.read ? (
                            <span title="Read"><CheckCheck className="w-3.5 h-3.5 text-black" /></span>
                          ) : (
                            <span title="Delivered"><Check className="w-3.5 h-3.5 opacity-70" /></span>
                          )
                        )}
                        {isAdmin && (
                          <button
                            onClick={() => deleteMessage(msg.id)}
                            className="ml-2 opacity-0 group-hover:opacity-100 text-red-500 transition-opacity"
                            title="Delete message"
                          >
                            <Trash2 className="w-3 h-3" />
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

          {/* Quick Starter Prompts Chips */}
          <div className="px-3 sm:px-4 py-2 border-t border-[#1f1f1f] bg-[#0c0c0c] flex items-center space-x-1.5 overflow-x-auto scrollbar-thin">
            <span className="text-[9px] font-mono uppercase text-white/40 shrink-0 mr-1 hidden sm:inline">
              Prompt Ideas:
            </span>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectQuickPrompt(p)}
                className="px-2.5 py-1 rounded-full bg-[#161616] hover:bg-[#222222] text-[10px] text-white/70 hover:text-white border border-[#262626] whitespace-nowrap transition-colors shrink-0"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Image Preview Container */}
          {imagePreviewUrl && (
            <div className="px-4 py-2 bg-[#111111] border-t border-[#222222] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={imagePreviewUrl}
                  alt="Preview"
                  className="w-12 h-12 rounded object-cover border border-white"
                />
                <div className="text-xs">
                  <span className="font-bold text-white block">Image ready to transmit</span>
                  <span className="text-[10px] text-white/40 font-mono">
                    {selectedImageFile?.name} ({((selectedImageFile?.size || 0) / 1024).toFixed(0)} KB)
                  </span>
                  {uploadProgress !== null && (
                    <div className="w-32 bg-zinc-800 h-1.5 rounded-full mt-1 overflow-hidden">
                      <div
                        className="bg-white h-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleClearImage}
                className="p-1.5 text-white/40 hover:text-white rounded hover:bg-[#1f1f1f]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Upload Error Banner */}
          {uploadError && (
            <div className="px-4 py-2 bg-red-950/20 border-t border-red-500/30 text-red-400 text-xs flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
              <button onClick={() => setUploadError(null)}>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Input Bar Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 sm:p-4 bg-[#111111] border-t border-[#222222] flex items-end space-x-2"
          >
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
              title="Attach photograph (JPEG, PNG, WebP)"
              className="p-2.5 rounded-xl bg-black hover:bg-[#181818] text-white border border-[#222222] hover:border-white/40 transition-all shrink-0 mb-0.5"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                rows={1}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type private message... (Enter to send, Shift+Enter for newline)"
                disabled={isUploading}
                maxLength={2000}
                className="w-full bg-black border border-[#222222] focus:border-white rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none transition-colors resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={isUploading || (!inputText.trim() && !selectedImageFile)}
              className="px-4 py-2.5 bg-white hover:bg-zinc-200 disabled:opacity-40 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center space-x-1.5 shrink-0 mb-0.5"
            >
              {isUploading ? (
                <Clock className="w-4 h-4 animate-spin text-black" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-black" />
                  <span className="hidden sm:inline">SEND</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Transparency Notice */}
          <div className="px-4 py-1.5 bg-[#0a0a0a] border-t border-[#1a1a1a] flex items-center justify-between text-[9px] text-white/40 font-mono">
            <span>Staff & Community Communication Network • Encrypted in Firestore</span>
            <span>Independent Platform</span>
          </div>

        </div>

      </div>

      {/* Lightbox Modal for Full Image Inspection */}
      {lightboxImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setLightboxImageUrl(null)}
              className="absolute -top-10 right-0 p-2 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={lightboxImageUrl}
              alt="Full resolution preview"
              className="max-w-full max-h-[80vh] object-contain rounded-xl border border-[#333333]"
            />
            <div className="mt-4 flex items-center space-x-3">
              <a
                href={lightboxImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white text-black font-bold text-xs uppercase rounded-lg flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Open Original Image</span>
              </a>
              <button
                onClick={() => setLightboxImageUrl(null)}
                className="px-4 py-2 bg-[#181818] border border-[#333333] text-white text-xs font-semibold rounded-lg"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
