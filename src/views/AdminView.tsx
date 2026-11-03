import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Users, 
  UserCheck, 
  Clock, 
  MessageSquare, 
  Image as ImageIcon, 
  Ban, 
  Package, 
  Settings, 
  Check, 
  X, 
  Trash2, 
  Lock, 
  TrendingUp, 
  DollarSign, 
  Send, 
  Search, 
  Filter, 
  ArrowLeft, 
  CheckCircle2, 
  ExternalLink, 
  AlertCircle,
  LogIn,
  Reply,
  CornerDownRight,
  CircleDot
} from 'lucide-react';
import { useAuth, PRIMARY_ADMIN_EMAIL, ADMIN_EMAILS } from '../firebase/authContext';
import { 
  listenToAllFriendRequests, 
  acceptFriendRequest, 
  rejectFriendRequest, 
  listenToAdminConversations, 
  listenToConversationMessages, 
  sendMessage, 
  listenToAllUsers, 
  blockUser, 
  unblockUser, 
  listenToBlockedUsers, 
  deleteMessage, 
  listenToInvestmentInquiries, 
  updateInvestmentStatus,
  markMessagesAsRead
} from '../firebase/services';
import { FriendRequest, Conversation, Message, UserProfile, MessageReplyContext } from '../types';
import { SafeImage } from '../components/SafeImage';

interface AdminViewProps {
  onOpenMessagesWithUser?: (conversationId: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = () => {
  const { user, profile, isAdmin, signInWithGoogle, setAdminOverride } = useAuth();
  
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    'chat' | 'users' | 'investments' | 'requests' | 'blocked'
  >('chat');

  // Master Passkey Authentication State
  const [passkeyInput, setPasskeyInput] = useState('');
  const [passkeyError, setPasskeyError] = useState(false);

  // Live Firestore State
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);
  
  // Admin Chat State
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState('');
  const [adminReplyTo, setAdminReplyTo] = useState<Message | null>(null);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [adminChatMobileView, setAdminChatMobileView] = useState<'list' | 'chat'>('list');

  // Search & Filtering State
  const [investmentSearch, setInvestmentSearch] = useState('');
  const [investmentFilter, setInvestmentFilter] = useState('ALL');
  const [chatSearch, setChatSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // Confirmation Alert Banner State
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Load Real Firestore Data
  useEffect(() => {
    if (!isAdmin) return;

    const unsubRequests = listenToAllFriendRequests((list) => setFriendRequests(list));
    const unsubConversations = listenToAdminConversations((list) => {
      setConversations(list);
      if (list.length > 0 && !selectedConversation) {
        setSelectedConversation(list[0]);
      }
    });
    const unsubUsers = listenToAllUsers((list) => setAllUsers(list));
    const unsubBlocked = listenToBlockedUsers((list) => setBlockedUserIds(list));
    const unsubInvestments = listenToInvestmentInquiries((list) => setInvestments(list));

    return () => {
      unsubRequests();
      unsubConversations();
      unsubUsers();
      unsubBlocked();
      unsubInvestments();
    };
  }, [isAdmin]);

  // Listen to messages of selected conversation in admin chat tab
  useEffect(() => {
    if (!selectedConversation) return;
    const unsub = listenToConversationMessages(selectedConversation.id, (msgs) => {
      setChatMessages(msgs);
      markMessagesAsRead(selectedConversation.id, 'admin');
    });
    return () => unsub();
  }, [selectedConversation]);

  // Handle Passkey Login
  const handlePasskeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      passkeyInput === 'musk2026' || 
      passkeyInput === 'admin' || 
      passkeyInput === 'spaceX' ||
      passkeyInput.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase()
    ) {
      setAdminOverride(true);
      setPasskeyError(false);
      setPasskeyInput('');
      showNotice('Admin privileges unlocked for elonmusk241@gmail.com.');
    } else {
      setPasskeyError(true);
    }
  };

  // Quick Unlock for testing
  const handleDirectAdminAuth = () => {
    setAdminOverride(true);
    showNotice(`Admin authenticated as ${PRIMARY_ADMIN_EMAIL}`);
  };

  // Send Reply from Admin
  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversation || !replyText.trim() || isSendingReply) return;

    setIsSendingReply(true);
    try {
      let replyContext: MessageReplyContext | undefined = undefined;
      if (adminReplyTo) {
        replyContext = {
          id: adminReplyTo.id,
          senderName: adminReplyTo.senderName || 'Visitor',
          text: adminReplyTo.text || (adminReplyTo.imageUrl ? '📷 [Image attachment]' : ''),
          imageUrl: adminReplyTo.imageUrl,
        };
      }

      await sendMessage(
        selectedConversation.id,
        'admin',
        'Elon Musk Space Administrator',
        selectedConversation.visitorId,
        replyText.trim(),
        undefined,
        replyContext
      );
      setReplyText('');
      setAdminReplyTo(null);
      showNotice(`Reply transmitted to ${selectedConversation.visitorName}.`);
    } catch (err) {
      console.error('Failed to send admin reply:', err);
    } finally {
      setIsSendingReply(false);
    }
  };

  // Filtered Conversations
  const filteredConversations = useMemo(() => {
    if (!chatSearch.trim()) return conversations;
    const term = chatSearch.toLowerCase();
    return conversations.filter(
      (c) =>
        c.visitorName?.toLowerCase().includes(term) ||
        c.visitorId?.toLowerCase().includes(term) ||
        c.lastMessage?.toLowerCase().includes(term)
    );
  }, [conversations, chatSearch]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return allUsers;
    const term = userSearch.toLowerCase();
    return allUsers.filter(
      (u) =>
        u.displayName?.toLowerCase().includes(term) ||
        u.uid?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term)
    );
  }, [allUsers, userSearch]);

  // Filtered Space Investments
  const filteredInvestments = useMemo(() => {
    return investments.filter((inv) => {
      const matchesSearch = 
        !investmentSearch.trim() ||
        inv.investorName?.toLowerCase().includes(investmentSearch.toLowerCase()) ||
        inv.email?.toLowerCase().includes(investmentSearch.toLowerCase()) ||
        inv.targetSector?.toLowerCase().includes(investmentSearch.toLowerCase()) ||
        inv.organization?.toLowerCase().includes(investmentSearch.toLowerCase());

      const matchesFilter = 
        investmentFilter === 'ALL' || inv.status === investmentFilter;

      return matchesSearch && matchesFilter;
    });
  }, [investments, investmentSearch, investmentFilter]);

  // If not admin yet, show Secure Admin Authorization Gate (Pure Dark)
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 pt-32 pb-24 bg-black text-white">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl backdrop-blur-xl">
          <div className="w-14 h-14 rounded-2xl bg-white text-black mx-auto flex items-center justify-center shadow-lg">
            <Lock className="w-7 h-7 text-black" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-black text-white tracking-tight uppercase">
              ADMINISTRATOR DASHBOARD
            </h2>
            <p className="text-xs text-zinc-400 font-mono">
              Authorized Administrator: <span className="text-white font-bold font-mono">elonmusk241@gmail.com</span>
            </p>
          </div>

          {/* Google Sign-In Option */}
          <div className="space-y-3 pt-2">
            <button
              onClick={signInWithGoogle}
              className="w-full py-3 px-4 bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-black" />
              <span>SIGN IN WITH GOOGLE</span>
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-800"></span></div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono"><span className="bg-zinc-900 px-2 text-zinc-500">OR AUTHORIZE PASSKEY</span></div>
            </div>
          </div>

          <form onSubmit={handlePasskeySubmit} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter Administrator Passkey"
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                className="w-full bg-black border border-zinc-800 focus:border-white rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors text-center font-mono"
              />
              <span className="text-[10px] text-zinc-500 mt-1.5 block font-mono">
                Staff Passkey: <code className="text-white font-bold">admin</code> or <code className="text-white font-bold">musk2026</code>
              </span>
            </div>

            {passkeyError && (
              <p className="text-xs text-red-400 font-medium">Invalid authorization credentials.</p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all border border-zinc-700 cursor-pointer"
            >
              UNLOCK ACCESS
            </button>
          </form>

          {/* Quick One-Click Unlock For Development Testing */}
          <div className="pt-2 border-t border-zinc-800">
            <button
              onClick={handleDirectAdminAuth}
              className="text-[11px] font-mono text-zinc-400 hover:text-white underline cursor-pointer"
            >
              One-Click Dev Authorization (as elonmusk241@gmail.com)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-6 bg-black text-white">
      
      {/* Action Notice Confirmation Banner */}
      {actionNotice && (
        <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-700 text-white text-xs flex items-center justify-between font-mono animate-fade-in shadow-xl">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)}>
            <X className="w-3.5 h-3.5 text-zinc-400 hover:text-white" />
          </button>
        </div>
      )}

      {/* Admin Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>AUTHENTICATED ADMINISTRATOR: elonmusk241@gmail.com</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            ADMINISTRATOR CONTROL PANEL
          </h1>
          <p className="text-xs text-zinc-400">
            Real-time Messenger management, visitor directory, and space capital syndicate oversight.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-3 bg-black border border-zinc-800 rounded-2xl text-center shadow-sm min-w-[100px]">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">CONVERSATIONS</span>
            <span className="text-lg font-black text-white font-mono">{conversations.length}</span>
          </div>
          <div className="p-3 bg-black border border-zinc-800 rounded-2xl text-center shadow-sm min-w-[100px]">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">VISITORS</span>
            <span className="text-lg font-black text-white font-mono">{allUsers.length}</span>
          </div>
          <button
            onClick={() => setAdminOverride(false)}
            className="px-3.5 py-2.5 rounded-xl border border-zinc-700 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Lock Dashboard"
          >
            Lock
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-zinc-800 overflow-x-auto space-x-2 pb-1">
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wider transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeTab === 'chat'
              ? 'bg-white text-black shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>MESSAGES ({conversations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wider transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeTab === 'users'
              ? 'bg-white text-black shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>VISITORS DIRECTORY ({allUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('investments')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wider transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeTab === 'investments'
              ? 'bg-white text-black shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>SPACE INVESTMENTS ({investments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wider transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeTab === 'requests'
              ? 'bg-white text-black shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>CONNECTIONS ({friendRequests.length})</span>
        </button>
      </div>

      {/* TAB 1: PRIVATE MESSAGES HUB (MESSENGER DARK STYLE) */}
      {activeTab === 'chat' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 min-h-[620px]">
          
          {/* Conversation List Column */}
          <div className={`md:col-span-4 border-r border-zinc-800 bg-zinc-950 flex flex-col ${
            adminChatMobileView === 'chat' ? 'hidden md:flex' : 'flex'
          }`}>
            <div className="p-3.5 bg-zinc-900 border-b border-zinc-800 space-y-2">
              <div className="text-xs font-bold text-white uppercase font-mono flex justify-between items-center">
                <span>VISITOR INBOX</span>
                <span className="text-[10px] text-zinc-400 font-mono">{filteredConversations.length} Active</span>
              </div>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={chatSearch}
                  onChange={(e) => setChatSearch(e.target.value)}
                  placeholder="Filter by name, ID, or text..."
                  className="w-full bg-black border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white"
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 max-h-[540px] divide-y divide-zinc-900">
              {filteredConversations.length === 0 ? (
                <p className="p-6 text-xs text-zinc-500 font-mono text-center">No visitor conversations yet.</p>
              ) : (
                filteredConversations.map((c) => {
                  const isSelected = selectedConversation?.id === c.id;
                  const isUnread = (c.unreadCount || 0) > 0;

                  return (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSelectedConversation(c);
                        setAdminChatMobileView('chat');
                      }}
                      className={`p-3.5 cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-zinc-900 border-l-4 border-white shadow-sm' 
                          : 'hover:bg-zinc-900/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs truncate ${isUnread ? 'font-black text-white' : 'font-bold text-zinc-200'}`}>
                          {c.visitorName}
                        </span>
                        {c.lastMessageAt && (
                          <span className="text-[9px] text-zinc-500 font-mono shrink-0">
                            {new Date(c.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-400 truncate font-mono">
                        {c.lastMessage}
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[9px] text-zinc-500 font-mono">
                        <span>UID: {c.visitorId.slice(0, 10)}...</span>
                        {isUnread && (
                          <span className="px-1.5 py-0.2 bg-white text-black font-bold rounded-full text-[8px]">
                            NEW
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Active Chat Column */}
          <div className={`md:col-span-8 flex flex-col bg-black ${
            adminChatMobileView === 'list' ? 'hidden md:flex' : 'flex'
          }`}>
            {selectedConversation ? (
              <>
                {/* Thread Top Bar */}
                <div className="p-3.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-xs font-bold text-white">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setAdminChatMobileView('list')}
                      className="md:hidden p-1 text-zinc-400 hover:text-white cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-sm text-white">{selectedConversation.visitorName}</span>
                    <span className="text-[10px] font-mono text-zinc-400">({selectedConversation.visitorId})</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>1:1 Channel Connected</span>
                  </span>
                </div>

                {/* Messages Stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[460px] bg-black">
                  {chatMessages.length === 0 ? (
                    <div className="py-12 text-center text-xs text-zinc-500 font-mono">
                      No messages recorded in this channel yet.
                    </div>
                  ) : (
                    chatMessages.map((m) => {
                      const isStaff = m.senderId === user?.uid || m.senderId === 'admin';
                      return (
                        <div key={m.id} className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'} group relative`}>
                          <div className="text-[9px] text-zinc-500 mb-0.5 font-mono px-1">
                            {isStaff ? 'Elon Musk Space Admin' : selectedConversation.visitorName} • {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>

                          <div className="flex items-center max-w-sm sm:max-w-md">
                            <div className={`p-3.5 rounded-2xl text-xs shadow-md ${
                              isStaff 
                                ? 'bg-white text-black font-medium rounded-br-none' 
                                : 'bg-zinc-900 text-white border border-zinc-800 rounded-bl-none'
                            }`}>
                              {/* Reply Context */}
                              {m.replyTo && (
                                <div className={`mb-2 p-1.5 rounded text-[10px] border-l-2 ${
                                  isStaff ? 'bg-zinc-200 border-black text-zinc-800' : 'bg-zinc-800 border-white text-zinc-300'
                                }`}>
                                  <span className="font-bold block text-[9px]">Replying to {m.replyTo.senderName}</span>
                                  <span className="italic line-clamp-1">{m.replyTo.text}</span>
                                </div>
                              )}

                              {m.imageUrl && (
                                <SafeImage src={m.imageUrl} alt="attachment" className="rounded-xl mb-2 max-h-56 object-cover border border-zinc-800" fallbackText="IMG" />
                              )}
                              <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                              
                              {/* Read receipt indicator */}
                              {isStaff && (
                                <div className="flex justify-end mt-1 text-[8px] text-zinc-600 font-mono">
                                  {m.read ? '✓✓ Read' : '✓ Sent'}
                                </div>
                              )}
                            </div>

                            {/* Actions on hover */}
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 ml-2 transition-opacity">
                              <button
                                onClick={() => setAdminReplyTo(m)}
                                className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                                title="Reply to message"
                              >
                                <Reply className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => deleteMessage(m.id, selectedConversation.id)}
                                className="p-1 rounded bg-red-950/80 hover:bg-red-900 text-red-300 cursor-pointer"
                                title="Delete message"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Quoted Reply Banner */}
                {adminReplyTo && (
                  <div className="px-4 py-2 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 text-zinc-300">
                      <CornerDownRight className="w-3.5 h-3.5 text-white" />
                      <span className="text-[11px] font-bold">Replying to {adminReplyTo.senderName}:</span>
                      <span className="text-[11px] italic truncate text-zinc-400">"{adminReplyTo.text}"</span>
                    </div>
                    <button onClick={() => setAdminReplyTo(null)} className="text-zinc-400 hover:text-white cursor-pointer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Reply Form */}
                <form onSubmit={handleSendAdminReply} className="p-3 bg-zinc-950 border-t border-zinc-800 flex space-x-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply privately to ${selectedConversation.visitorName}...`}
                    className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white"
                  />
                  <button
                    type="submit"
                    disabled={isSendingReply || !replyText.trim()}
                    className="px-5 py-2 bg-white text-black font-bold text-xs rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-40 shadow-sm cursor-pointer"
                  >
                    Reply
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-zinc-500 font-mono p-8">
                Select a conversation on the left to start replying.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: VISITORS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase font-mono">
                REGISTERED VISITORS DIRECTORY ({filteredUsers.length})
              </h3>
              <p className="text-xs text-zinc-400">All authenticated visitors with permanent user IDs and online presence.</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search visitors..."
                className="w-full bg-black border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {filteredUsers.map((u) => {
              const isBlocked = blockedUserIds.includes(u.uid);

              return (
                <div
                  key={u.uid}
                  className="p-4 rounded-2xl bg-black border border-zinc-800 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <SafeImage
                          src={u.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.displayName || 'V')}&background=18181b&color=ffffff`}
                          alt={u.displayName}
                          className="w-10 h-10 rounded-full object-cover border border-zinc-800 bg-zinc-950"
                          fallbackText={(u.displayName || 'V').slice(0, 2).toUpperCase()}
                        />
                        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-black ${
                          u.online ? 'bg-emerald-400' : 'bg-zinc-600'
                        }`}></span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                          <span>{u.displayName}</span>
                          {u.role === 'admin' && (
                            <span className="px-1.5 py-0.2 rounded text-[8px] bg-white text-black font-mono font-bold uppercase">ADMIN</span>
                          )}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono truncate max-w-[150px]">
                          {u.email || u.uid}
                        </div>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                      u.online ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {u.online ? 'ONLINE' : 'OFFLINE'}
                    </span>
                  </div>

                  <div className="text-[10px] text-zinc-400 font-mono space-y-0.5 border-t border-zinc-800 pt-2">
                    <div>Permanent UID: <span className="text-white font-bold">{u.uid}</span></div>
                    {u.lastSeen && (
                      <div>Last active: {new Date(u.lastSeen).toLocaleString()}</div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      onClick={() => {
                        const existingConv = conversations.find((c) => c.visitorId === u.uid);
                        if (existingConv) {
                          setSelectedConversation(existingConv);
                        } else {
                          setSelectedConversation({
                            id: `conv_${u.uid}_admin`,
                            conversationId: `conv_${u.uid}_admin`,
                            participants: [u.uid, 'admin'],
                            visitorId: u.uid,
                            visitorName: u.displayName,
                            visitorPhoto: u.photoURL,
                            adminId: 'admin',
                            createdAt: new Date().toISOString(),
                          });
                        }
                        setActiveTab('chat');
                      }}
                      className="flex-1 py-1.5 px-3 bg-white hover:bg-zinc-200 text-black rounded-xl text-xs font-bold flex items-center justify-center space-x-1 shadow-sm cursor-pointer transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat 1-on-1</span>
                    </button>

                    {isBlocked ? (
                      <button
                        onClick={() => unblockUser(u.uid)}
                        className="py-1.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        onClick={() => blockUser(u.uid)}
                        className="py-1.5 px-3 border border-red-900/80 text-red-400 hover:bg-red-950 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Block
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: SPACE CAPITAL INVESTMENTS */}
      {activeTab === 'investments' && (
        <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase font-mono">
                SPACE CAPITAL INQUIRIES ({filteredInvestments.length})
              </h3>
              <p className="text-xs text-zinc-400">Accredited investor syndicates for orbital infrastructure and Starship scaling.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={investmentSearch}
                onChange={(e) => setInvestmentSearch(e.target.value)}
                placeholder="Search investors or sectors..."
                className="bg-black border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white"
              />
              <select
                value={investmentFilter}
                onChange={(e) => setInvestmentFilter(e.target.value)}
                className="bg-black border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white"
              >
                <option value="ALL">All Statuses</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="CONNECTED">Connected</option>
                <option value="DECLINED">Declined</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {filteredInvestments.length === 0 ? (
              <p className="text-center py-8 text-xs text-zinc-500 font-mono">No investment inquiries matching filters.</p>
            ) : (
              filteredInvestments.map((inv) => (
                <div key={inv.id} className="p-5 rounded-2xl bg-black border border-zinc-800 space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                    <div>
                      <span className="text-sm font-bold text-white">{inv.investorName}</span>
                      {inv.organization && <span className="text-zinc-400 ml-2">({inv.organization})</span>}
                      <div className="text-[10px] text-zinc-500 font-mono">
                        Classification: {inv.investorType} • Timeline: {inv.timeline || 'Immediate'}
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-white text-black">
                      {inv.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-zinc-300">
                    <div><span className="text-zinc-500 block">Target Capital Allocation:</span> <span className="text-white font-bold">{inv.targetAmount}</span></div>
                    <div><span className="text-zinc-500 block">Target Sector:</span> <span className="text-white font-bold">{inv.targetSector}</span></div>
                    <div><span className="text-zinc-500 block">Email:</span> <a href={`mailto:${inv.email}`} className="text-white underline">{inv.email}</a></div>
                    {inv.phone && <div><span className="text-zinc-500 block">Phone:</span> {inv.phone}</div>}
                  </div>

                  {inv.notes && (
                    <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-[11px] text-zinc-300">
                      <span className="font-bold text-white block mb-0.5 font-mono text-[10px]">Investor Notes:</span>
                      {inv.notes}
                    </div>
                  )}

                  <div className="flex items-center space-x-2 pt-2 border-t border-zinc-800">
                    <span className="text-[10px] text-zinc-500 font-mono">Status Action:</span>
                    <button
                      onClick={async () => {
                        await updateInvestmentStatus(inv.id, 'CONNECTED');
                        showNotice(`Updated inquiry for ${inv.investorName} to CONNECTED.`);
                      }}
                      className="px-3 py-1 bg-white text-black font-bold text-[10px] rounded-lg uppercase hover:bg-zinc-200 cursor-pointer"
                    >
                      Connect
                    </button>
                    <button
                      onClick={async () => {
                        await updateInvestmentStatus(inv.id, 'IN_REVIEW');
                        showNotice(`Updated inquiry for ${inv.investorName} to IN_REVIEW.`);
                      }}
                      className="px-3 py-1 bg-zinc-800 text-white font-bold text-[10px] rounded-lg uppercase hover:bg-zinc-700 cursor-pointer"
                    >
                      In Review
                    </button>
                    <button
                      onClick={async () => {
                        await updateInvestmentStatus(inv.id, 'DECLINED');
                        showNotice(`Updated inquiry for ${inv.investorName} to DECLINED.`);
                      }}
                      className="px-3 py-1 bg-red-950 text-red-300 border border-red-900 font-bold text-[10px] rounded-lg uppercase hover:bg-red-900 cursor-pointer"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: CONNECTIONS & BADGE REQUESTS */}
      {activeTab === 'requests' && (
        <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase font-mono">
            COMMUNITY CONNECTION REQUESTS ({friendRequests.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {friendRequests.map((req) => (
              <div key={req.id} className="p-4 rounded-2xl bg-black border border-zinc-800 space-y-3">
                <div className="flex items-center space-x-3">
                  <SafeImage
                    src={req.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.displayName || 'U')}&background=18181b&color=ffffff`}
                    alt={req.displayName}
                    className="w-10 h-10 rounded-full object-cover border border-zinc-800 bg-zinc-950"
                    fallbackText={(req.displayName || 'U').slice(0, 2).toUpperCase()}
                  />
                  <div>
                    <div className="text-xs font-bold text-white">{req.displayName}</div>
                    <span className="text-[10px] text-zinc-400 font-mono">Status: {req.status}</span>
                  </div>
                </div>

                {req.note && (
                  <p className="text-[11px] text-zinc-300 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
                    "{req.note}"
                  </p>
                )}

                {req.status === 'PENDING' ? (
                  <div className="flex space-x-2 pt-1">
                    <button
                      onClick={async () => {
                        await acceptFriendRequest(req);
                        showNotice(`Accepted badge request from ${req.displayName}`);
                      }}
                      className="flex-1 py-1.5 bg-white text-black rounded-xl text-xs font-bold hover:bg-zinc-200 cursor-pointer transition-all"
                    >
                      Accept
                    </button>
                    <button
                      onClick={async () => {
                        await rejectFriendRequest(req);
                        showNotice(`Declined request from ${req.displayName}`);
                      }}
                      className="py-1.5 px-3 bg-zinc-800 text-white rounded-xl text-xs font-bold hover:bg-zinc-700 cursor-pointer"
                    >
                      Decline
                    </button>
                  </div>
                ) : (
                  <div className="text-[10px] font-mono text-zinc-500">
                    Processed: {req.status}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
