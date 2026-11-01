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
  UserPlus 
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
  
  // Image Upload State
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      // Visitor sees their 1-on-1 conversation with admin
      const unsub = listenToVisitorConversation(user.uid, (conv) => {
        if (conv) {
          setActiveConversation(conv);
          setConversations([conv]);
        } else if (friendRequest?.status === 'ACCEPTED') {
          // Construct default active conversation object
          const defaultConv: Conversation = {
            id: `conv_${user.uid}_admin`,
            conversationId: `conv_${user.uid}_admin`,
            participants: [user.uid, 'admin'],
            visitorId: user.uid,
            visitorName: profile?.displayName || 'Explorer',
            visitorPhoto: profile?.photoURL,
            adminId: 'admin',
            createdAt: new Date().toISOString(),
          };
          setActiveConversation(defaultConv);
          setConversations([defaultConv]);
        }
      });
      return () => unsub();
    }
  }, [user, isAdmin, friendRequest?.status, profile]);

  // 3. Listen to real-time messages in active conversation
  useEffect(() => {
    if (!activeConversation || !user) return;

    const unsub = listenToConversationMessages(activeConversation.id, (newMessages) => {
      setMessages(newMessages);
      markMessagesAsRead(activeConversation.id, user.uid);
    });

    return () => unsub();
  }, [activeConversation, user]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, imagePreviewUrl]);

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Invalid format. Please select JPEG, PNG, or WebP.');
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

  // Send Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeConversation) return;
    if (!inputText.trim() && !selectedImageFile) return;

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

  const isAccepted = friendRequest?.status === 'ACCEPTED' || isAdmin;

  if (!isAccepted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 bg-black">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0a0a0a] border border-[#222222] text-center space-y-6">
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 text-white mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">
              PRIVATE MESSAGING NETWORK
            </h2>
            <p className="text-xs text-white/50 max-w-md mx-auto leading-relaxed">
              To protect community privacy, private 1-on-1 messaging is reserved for verified connections.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#111111] border border-[#222222] max-w-md mx-auto text-xs space-y-2 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-white/40">CONNECTION STATUS:</span>
              <span className="font-bold uppercase px-2 py-0.5 rounded text-[9px] bg-white/10 text-white border border-white/20">
                {friendRequest?.status || 'NO REQUEST SUBMITTED'}
              </span>
            </div>
            {friendRequest?.status === 'PENDING' ? (
              <p className="text-white/70 text-left pt-1 text-[11px]">
                Your friend request has been received and is currently under review by the administrator.
              </p>
            ) : (
              <p className="text-white/50 text-left pt-1 text-[11px]">
                Submitting a friend request takes 5 seconds with anonymous login. You do not need to enter an email.
              </p>
            )}
          </div>

          <div>
            {friendRequest?.status === 'PENDING' ? (
              <button
                onClick={onOpenFriendModal}
                className="px-6 py-2.5 bg-[#111111] border border-[#222222] text-white text-xs font-bold rounded-lg flex items-center justify-center space-x-2 mx-auto font-mono"
              >
                <Clock className="w-3.5 h-3.5 animate-spin text-white" />
                <span>CHECK REQUEST STATUS</span>
              </button>
            ) : (
              <button
                onClick={onOpenFriendModal}
                className="px-8 py-3 bg-white hover:bg-zinc-200 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 mx-auto cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-black" />
                <span>TRANSMIT FRIEND REQUEST</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 bg-black">
      
      {/* Messaging Header */}
      <div className="border-b border-[#222222] pb-4 mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">
              {isAdmin ? 'ADMINISTRATOR PRIVATE CHAT HUB' : 'VERIFIED 1:1 PRIVATE MESSAGING'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white uppercase">
            PRIVATE MESSAGING NETWORK
          </h1>
        </div>

        <div className="text-right hidden sm:block">
          <div className="text-xs font-semibold text-white">
            {profile?.displayName || 'Explorer'}
          </div>
          <div className="text-[10px] text-white/40 font-mono">
            {isAdmin ? 'Staff Authorization' : 'Encrypted Firestore Channel'}
          </div>
        </div>
      </div>

      {/* Main Chat Layout Container */}
      <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 min-h-[640px] max-h-[750px]">
        
        {/* Left Sidebar */}
        <div className="md:col-span-4 lg:col-span-3 border-r border-[#222222] bg-black flex flex-col">
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
                    onClick={() => setActiveConversation(conv)}
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
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Chat Panel */}
        <div className="md:col-span-8 lg:col-span-9 flex flex-col bg-[#0a0a0a] h-full">
          
          {/* Active Conversation Top Bar */}
          <div className="px-5 py-3 border-b border-[#222222] bg-[#111111] flex items-center justify-between">
            <div className="flex items-center space-x-3">
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
                  <span>{isAdmin ? activeConversation?.visitorName : 'Community Administrator'}</span>
                  <span className="px-1.5 py-0.2 rounded text-[8px] bg-white/10 text-white font-mono uppercase">
                    {isAdmin ? 'Visitor' : 'STAFF'}
                  </span>
                </div>
                <div className="text-[9px] text-white/50 font-mono flex items-center space-x-1">
                  <span className="w-1 h-1 rounded-full bg-white"></span>
                  <span>Active Real-Time Sync</span>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-white/40 font-mono flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">1:1 Channel</span>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                <div className="w-10 h-10 rounded-full bg-[#111111] border border-[#222222] flex items-center justify-center text-white">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white uppercase font-mono">Private Channel Established</h4>
                  <p className="text-xs text-white/50 max-w-sm">
                    Send your first message or transmit a photograph. Messages are synchronized in real-time through Firestore.
                  </p>
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
                      className={`max-w-[85%] sm:max-w-md rounded-2xl p-3 sm:p-4 text-xs shadow-md ${
                        isMe
                          ? 'bg-white text-black rounded-tr-none font-medium'
                          : 'bg-[#181818] border border-[#262626] text-white rounded-tl-none'
                      }`}
                    >
                      {/* Attached Image */}
                      {msg.imageUrl && (
                        <div className="mb-2 rounded-xl overflow-hidden bg-black/40 border border-black/20 max-h-72">
                          <img
                            src={msg.imageUrl}
                            alt="Uploaded attachment"
                            className="w-full h-full object-cover cursor-pointer hover:scale-[1.01] transition-transform grayscale"
                            onClick={() => window.open(msg.imageUrl, '_blank')}
                          />
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
                  <span className="font-bold text-white block">Image ready</span>
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
            onSubmit={handleSendMessage}
            className="p-3 sm:p-4 bg-[#111111] border-t border-[#222222] flex items-center space-x-2"
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
              className="p-2.5 rounded-xl bg-black hover:bg-[#181818] text-white border border-[#222222] hover:border-white/40 transition-all shrink-0"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type private message..."
              disabled={isUploading}
              maxLength={2000}
              className="flex-1 bg-black border border-[#222222] focus:border-white rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none transition-colors"
            />

            <button
              type="submit"
              disabled={isUploading || (!inputText.trim() && !selectedImageFile)}
              className="px-4 py-2.5 bg-white hover:bg-zinc-200 disabled:opacity-40 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center space-x-1.5 shrink-0"
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

        </div>

      </div>

    </div>
  );
};
