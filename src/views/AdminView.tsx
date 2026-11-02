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
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../firebase/authContext';
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
  updateInvestmentStatus 
} from '../firebase/services';
import { FriendRequest, Conversation, Message, UserProfile } from '../types';
import { PRODUCTS_DATA } from '../data/platformData';

interface AdminViewProps {
  onOpenMessagesWithUser?: (conversationId: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = () => {
  const { user, isAdmin, setAdminOverride } = useAuth();
  
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    'overview' | 'investments' | 'requests' | 'friends' | 'chat' | 'images' | 'users' | 'blocked' | 'products' | 'settings'
  >('overview');

  // Master Passkey Authentication
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
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [adminChatMobileView, setAdminChatMobileView] = useState<'list' | 'chat'>('list');

  // Search & Filtering State
  const [investmentSearch, setInvestmentSearch] = useState('');
  const [investmentFilter, setInvestmentFilter] = useState('ALL');
  
  const [requestSearch, setRequestSearch] = useState('');
  const [requestFilter, setRequestFilter] = useState('ALL');

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
    });
    return () => unsub();
  }, [selectedConversation]);

  // Handle Passkey Login
  const handlePasskeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkeyInput === 'musk2026' || passkeyInput === 'admin' || passkeyInput === 'spaceX') {
      setAdminOverride(true);
      setPasskeyError(false);
      setPasskeyInput('');
      showNotice('Admin privileges unlocked successfully.');
    } else {
      setPasskeyError(true);
    }
  };

  // Admin Friend Request Actions
  const handleAccept = async (req: FriendRequest) => {
    try {
      await acceptFriendRequest(req, user?.uid || 'admin');
      showNotice(`Accepted friend connection for ${req.displayName}. 1-on-1 chat initialized.`);
    } catch (err: any) {
      console.error('Failed to accept request:', err);
    }
  };

  const handleReject = async (req: FriendRequest) => {
    try {
      await rejectFriendRequest(req);
      showNotice(`Request from ${req.displayName} updated to REJECTED.`);
    } catch (err: any) {
      console.error('Failed to reject request:', err);
    }
  };

  // Admin Reply Action
  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversation || !replyText.trim() || !user) return;

    setIsSendingReply(true);
    try {
      await sendMessage(
        selectedConversation.id,
        user.uid,
        'Community Administrator',
        selectedConversation.visitorId,
        replyText.trim()
      );
      setReplyText('');
      showNotice(`Reply transmitted to ${selectedConversation.visitorName}.`);
    } catch (err) {
      console.error('Failed to send admin reply:', err);
    } finally {
      setIsSendingReply(false);
    }
  };

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

  // Filtered Friend Requests
  const filteredRequests = useMemo(() => {
    return friendRequests.filter((req) => {
      const matchesSearch = 
        !requestSearch.trim() ||
        req.displayName?.toLowerCase().includes(requestSearch.toLowerCase()) ||
        req.senderId?.toLowerCase().includes(requestSearch.toLowerCase()) ||
        req.note?.toLowerCase().includes(requestSearch.toLowerCase());

      const matchesFilter =
        requestFilter === 'ALL' || req.status === requestFilter;

      return matchesSearch && matchesFilter;
    });
  }, [friendRequests, requestSearch, requestFilter]);

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

  const pendingRequests = friendRequests.filter((r) => r.status === 'PENDING');
  const acceptedFriends = friendRequests.filter((r) => r.status === 'ACCEPTED');

  // If not admin yet, show Admin Authorization Gate
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 pt-32 pb-24 bg-black">
        <div className="bg-[#0a0a0a] border border-[#222222] rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 text-white mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white tracking-tight uppercase">ADMINISTRATOR ACCESS</h2>
            <p className="text-xs text-white/50 font-mono">
              Privileged community & space investment administration panel.
            </p>
          </div>

          <form onSubmit={handlePasskeySubmit} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter Administrator Passkey"
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                className="w-full bg-[#111111] border border-[#222222] focus:border-white rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none transition-colors text-center"
              />
              <span className="text-[10px] text-white/40 mt-1 block font-mono">
                (Staff passkey: <code className="text-white">admin</code> or <code className="text-white">spaceX</code>)
              </span>
            </div>

            {passkeyError && (
              <p className="text-xs text-red-400">Invalid authorization credentials.</p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-white hover:bg-zinc-200 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
            >
              AUTHENTICATE ADMIN
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-6 bg-black">
      
      {/* Action Notice Confirmation Banner */}
      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-white/10 border border-white/30 text-white text-xs flex items-center justify-between font-mono animate-fade-in shadow-xl">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)}>
            <X className="w-3.5 h-3.5 text-white/60 hover:text-white" />
          </button>
        </div>
      )}

      {/* Admin Top Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0a0a0a] border border-[#222222] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight uppercase">
                ADMINISTRATOR COMMAND CENTER
              </h1>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-white/15 text-white border border-white/20 font-mono">
                Authorized
              </span>
            </div>
            <p className="text-xs text-white/50">
              Live Firestore Monitoring: Space Investments, Users, Friend Requests, and Private Chats
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setAdminOverride(false);
            showNotice('Exited Admin Mode.');
          }}
          className="px-3.5 py-1.5 bg-[#111111] hover:bg-[#1a1a1a] border border-[#222222] rounded-xl text-xs text-white/70 hover:text-white transition-all self-start md:self-auto font-mono"
        >
          Exit Admin Mode
        </button>
      </div>

      {/* Admin Navigation Tabs (Responsive Scrollable) */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-thin">
        {[
          { id: 'overview', label: '1. OVERVIEW' },
          { id: 'investments', label: `2. INVESTMENTS (${investments.length})` },
          { id: 'requests', label: `3. REQUESTS (${pendingRequests.length})` },
          { id: 'friends', label: `4. CONNECTIONS (${acceptedFriends.length})` },
          { id: 'chat', label: `5. MESSAGES (${conversations.length})` },
          { id: 'images', label: '6. IMAGE ARCHIVE' },
          { id: 'users', label: `7. VISITORS (${allUsers.length})` },
          { id: 'blocked', label: `8. BLOCKED (${blockedUserIds.length})` },
          { id: 'products', label: '9. PRODUCTS' },
          { id: 'settings', label: '10. SETTINGS' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-white text-black font-extrabold shadow-sm'
                  : 'bg-[#0a0a0a] text-white/60 hover:text-white border border-[#222222] hover:bg-[#141414]'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0a0a0a] border border-[#222222] space-y-1">
              <span className="text-[10px] font-mono text-white/40 uppercase block">Space Inquiries</span>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">{investments.length}</div>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0a0a0a] border border-[#222222] space-y-1">
              <span className="text-[10px] font-mono text-white/40 uppercase block">Pending Requests</span>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">{pendingRequests.length}</div>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0a0a0a] border border-[#222222] space-y-1">
              <span className="text-[10px] font-mono text-white/40 uppercase block">Connected Friends</span>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">{acceptedFriends.length}</div>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0a0a0a] border border-[#222222] space-y-1">
              <span className="text-[10px] font-mono text-white/40 uppercase block">Active 1:1 Chats</span>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">{conversations.length}</div>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0a0a0a] border border-[#222222] space-y-1">
              <span className="text-[10px] font-mono text-white/40 uppercase block">Total Visitors</span>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">{allUsers.length || 1}</div>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0a0a0a] border border-[#222222] space-y-1">
              <span className="text-[10px] font-mono text-white/40 uppercase block">Blocked Entities</span>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">{blockedUserIds.length}</div>
            </div>
          </div>

          {/* Quick Shortcuts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-[#222222] space-y-3">
              <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3">
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  PENDING FRIEND QUEUE ({pendingRequests.length})
                </h3>
                <button
                  onClick={() => setActiveTab('requests')}
                  className="text-[10px] text-white/60 hover:text-white font-mono underline"
                >
                  Manage All
                </button>
              </div>
              {pendingRequests.length === 0 ? (
                <p className="text-xs text-white/40 font-mono py-2">No pending requests.</p>
              ) : (
                <div className="space-y-2">
                  {pendingRequests.slice(0, 3).map((r) => (
                    <div key={r.id} className="p-3 bg-[#111111] rounded-xl border border-[#222222] flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{r.displayName}</div>
                        {r.note && <div className="text-[10px] text-white/60 line-clamp-1">"{r.note}"</div>}
                      </div>
                      <button
                        onClick={() => handleAccept(r)}
                        className="px-2.5 py-1 bg-white text-black font-bold text-[10px] rounded uppercase"
                      >
                        Accept
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-[#222222] space-y-3">
              <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3">
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  SPACE INQUIRIES ({investments.length})
                </h3>
                <button
                  onClick={() => setActiveTab('investments')}
                  className="text-[10px] text-white/60 hover:text-white font-mono underline"
                >
                  View All
                </button>
              </div>
              {investments.length === 0 ? (
                <p className="text-xs text-white/40 font-mono py-2">No inquiries logged yet.</p>
              ) : (
                <div className="space-y-2">
                  {investments.slice(0, 3).map((inv) => (
                    <div key={inv.id} className="p-3 bg-[#111111] rounded-xl border border-[#222222] flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{inv.investorName}</div>
                        <div className="text-[10px] text-white/60">{inv.targetAmount} • {inv.targetSector}</div>
                      </div>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/10 text-white">
                        {inv.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SPACE INVESTMENTS WITH SEARCH & FILTER */}
      {activeTab === 'investments' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0a0a0a] border border-[#222222] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222222] pb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase font-mono">SPACE CAPITAL ALLOCATION INQUIRIES</h3>
              <p className="text-xs text-white/50">
                Live accredited investor submissions from the Space Investment portal.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono text-white/40">Total: {filteredInvestments.length}</span>
            </div>
          </div>

          {/* Search & Status Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
              <input
                type="text"
                value={investmentSearch}
                onChange={(e) => setInvestmentSearch(e.target.value)}
                placeholder="Search by investor name, organization, email, or sector..."
                className="w-full bg-black border border-[#222222] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-white"
              />
            </div>

            <div className="flex items-center space-x-1.5 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-white/40 shrink-0" />
              <select
                value={investmentFilter}
                onChange={(e) => setInvestmentFilter(e.target.value)}
                className="bg-black border border-[#222222] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none w-full sm:w-auto"
              >
                <option value="ALL">All Statuses</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="CONNECTED">Connected</option>
                <option value="DECLINED">Declined</option>
              </select>
            </div>
          </div>

          {filteredInvestments.length === 0 ? (
            <div className="py-8 text-center text-xs text-white/40 font-mono">
              No space capital inquiries matching filters.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredInvestments.map((inv) => (
                <div
                  key={inv.id}
                  className="p-4 sm:p-5 rounded-xl bg-[#111111] border border-[#222222] space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1f1f1f] pb-3">
                    <div>
                      <span className="text-sm font-bold text-white">{inv.investorName}</span>
                      {inv.organization && (
                        <span className="text-white/60 ml-2">({inv.organization})</span>
                      )}
                      <div className="text-[10px] text-white/40 font-mono">
                        Classification: {inv.investorType} • Timeline: {inv.timeline || 'Immediate'}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        inv.status === 'CONNECTED'
                          ? 'bg-white text-black'
                          : 'bg-white/10 text-white border border-white/20'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-white/70">
                    <div>
                      <span className="text-white/40 block">Target Capital Allocation:</span>
                      <span className="text-white font-bold">{inv.targetAmount}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block">Target Sector:</span>
                      <span className="text-white font-bold">{inv.targetSector}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block">Correspondence Email:</span>
                      <a href={`mailto:${inv.email}`} className="text-white underline">{inv.email}</a>
                    </div>
                    {inv.phone && (
                      <div>
                        <span className="text-white/40 block">Telephone / Signal:</span>
                        <span className="text-white">{inv.phone}</span>
                      </div>
                    )}
                  </div>

                  {inv.notes && (
                    <div className="p-2.5 bg-black/60 rounded-lg border border-[#222222] text-[11px] text-white/60">
                      <span className="font-bold text-white block mb-0.5 font-mono text-[10px]">Investor Criteria:</span>
                      {inv.notes}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1f1f1f]">
                    <span className="text-[10px] text-white/40 font-mono">Action:</span>
                    <button
                      onClick={async () => {
                        await updateInvestmentStatus(inv.id, 'CONNECTED');
                        showNotice(`Updated inquiry for ${inv.investorName} to CONNECTED.`);
                      }}
                      className="px-2.5 py-1 bg-white text-black font-bold text-[10px] rounded uppercase hover:bg-zinc-200 transition-colors"
                    >
                      Mark Connected
                    </button>
                    <button
                      onClick={async () => {
                        await updateInvestmentStatus(inv.id, 'IN_REVIEW');
                        showNotice(`Updated inquiry for ${inv.investorName} to IN_REVIEW.`);
                      }}
                      className="px-2.5 py-1 bg-[#1a1a1a] border border-[#333333] text-white text-[10px] rounded uppercase hover:bg-[#222222] transition-colors"
                    >
                      In Review
                    </button>
                    <button
                      onClick={async () => {
                        await updateInvestmentStatus(inv.id, 'DECLINED');
                        showNotice(`Updated inquiry for ${inv.investorName} to DECLINED.`);
                      }}
                      className="px-2.5 py-1 bg-[#1a1a1a] text-white/50 text-[10px] rounded uppercase hover:text-white transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FRIEND REQUESTS WITH SEARCH & FILTER */}
      {activeTab === 'requests' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0a0a0a] border border-[#222222] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222222] pb-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase font-mono">FRIEND & CONNECTION REQUESTS</h3>
              <p className="text-xs text-white/50">Approve or reject visitor requests for 1-on-1 private messaging.</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono text-white/40">Count: {filteredRequests.length}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
              <input
                type="text"
                value={requestSearch}
                onChange={(e) => setRequestSearch(e.target.value)}
                placeholder="Search friend requests by name or note..."
                className="w-full bg-black border border-[#222222] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-white"
              />
            </div>

            <select
              value={requestFilter}
              onChange={(e) => setRequestFilter(e.target.value)}
              className="bg-black border border-[#222222] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none w-full sm:w-auto"
            >
              <option value="ALL">All Requests</option>
              <option value="PENDING">Pending Only</option>
              <option value="ACCEPTED">Accepted Only</option>
              <option value="REJECTED">Rejected Only</option>
            </select>
          </div>

          {filteredRequests.length === 0 ? (
            <p className="text-xs text-white/40 font-mono py-6 text-center">No matching friend requests found.</p>
          ) : (
            <div className="divide-y divide-[#1f1f1f]">
              {filteredRequests.map((req) => (
                <div key={req.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white">{req.displayName}</span>
                      <span className="text-[9px] font-mono uppercase px-2 py-0.2 rounded bg-white/10 text-white">
                        {req.status}
                      </span>
                    </div>
                    {req.note && <p className="text-xs text-white/60 mt-1">"{req.note}"</p>}
                    <span className="text-[9px] text-white/40 font-mono">
                      UID: {req.senderId} • Date: {new Date(req.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {req.status === 'PENDING' && (
                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => handleAccept(req)}
                        className="px-3 py-1 bg-white text-black text-xs font-bold rounded hover:bg-zinc-200 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(req)}
                        className="px-3 py-1 bg-[#1a1a1a] text-white/70 text-xs font-bold rounded hover:bg-[#252525] transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ACCEPTED FRIENDS */}
      {activeTab === 'friends' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0a0a0a] border border-[#222222] space-y-4">
          <h3 className="text-sm font-bold text-white uppercase font-mono">ACCEPTED COMMUNITY FRIENDS ({acceptedFriends.length})</h3>
          {acceptedFriends.length === 0 ? (
            <p className="text-xs text-white/40 font-mono py-6 text-center">No accepted friends yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {acceptedFriends.map((f) => (
                <div key={f.id} className="p-4 rounded-xl bg-[#111111] border border-[#222222] space-y-2">
                  <div className="flex items-center space-x-3">
                    <img
                      src={f.photoURL || `https://api.dicebear.com/7.x/identicon/svg?seed=${f.senderId}`}
                      alt={f.displayName}
                      className="w-10 h-10 rounded-full object-cover border border-[#333333]"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">{f.displayName}</div>
                      <span className="text-[10px] text-white/60 font-mono">Verified Connection</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const conv = conversations.find((c) => c.visitorId === f.senderId);
                      if (conv) {
                        setSelectedConversation(conv);
                        setAdminChatMobileView('chat');
                      }
                      setActiveTab('chat');
                    }}
                    className="w-full py-1.5 px-3 bg-white text-black rounded text-xs font-bold flex items-center justify-center space-x-1 hover:bg-zinc-200 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open 1:1 Conversation</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: PRIVATE MESSAGES HUB (With Mobile Switcher) */}
      {activeTab === 'chat' && (
        <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[550px]">
          {/* Conversation List Column */}
          <div className={`md:col-span-4 border-r border-[#222222] bg-black flex flex-col ${
            adminChatMobileView === 'chat' ? 'hidden md:flex' : 'flex'
          }`}>
            <div className="p-3 bg-[#111111] border-b border-[#222222] space-y-2">
              <div className="text-xs font-bold text-white uppercase font-mono flex justify-between">
                <span>VISITOR CHATS ({conversations.length})</span>
              </div>
              <div className="relative">
                <Search className="w-3 h-3 text-white/40 absolute left-2.5 top-2" />
                <input
                  type="text"
                  value={chatSearch}
                  onChange={(e) => setChatSearch(e.target.value)}
                  placeholder="Filter by visitor or message..."
                  className="w-full bg-black border border-[#222222] rounded pl-7 pr-2 py-1 text-[11px] text-white focus:outline-none focus:border-white"
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 max-h-[500px] divide-y divide-[#1f1f1f]">
              {filteredConversations.length === 0 ? (
                <p className="p-4 text-xs text-white/40 font-mono">No conversations found.</p>
              ) : (
                filteredConversations.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedConversation(c);
                      setAdminChatMobileView('chat');
                    }}
                    className={`p-3 cursor-pointer transition-colors ${
                      selectedConversation?.id === c.id ? 'bg-[#181818] border-l-2 border-white' : 'hover:bg-[#111111]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-white truncate">{c.visitorName}</span>
                      {c.lastMessageAt && (
                        <span className="text-[9px] text-white/40 font-mono">
                          {new Date(c.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-white/50 truncate font-mono">{c.lastMessage}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active Chat Column */}
          <div className={`md:col-span-8 flex flex-col bg-[#0a0a0a] ${
            adminChatMobileView === 'list' ? 'hidden md:flex' : 'flex'
          }`}>
            {selectedConversation ? (
              <>
                <div className="p-3 bg-[#111111] border-b border-[#222222] flex items-center justify-between text-xs font-bold text-white">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setAdminChatMobileView('list')}
                      className="md:hidden p-1 text-white/70 hover:text-white"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <span>Chatting with: {selectedConversation.visitorName}</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/50">UID: {selectedConversation.visitorId.slice(0, 8)}</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[420px]">
                  {chatMessages.length === 0 ? (
                    <div className="py-8 text-center text-xs text-white/40 font-mono">
                      No messages recorded in this channel yet.
                    </div>
                  ) : (
                    chatMessages.map((m) => {
                      const isStaff = m.senderId === user?.uid || m.senderId === 'admin';
                      return (
                        <div key={m.id} className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}>
                          <div className="text-[9px] text-white/40 mb-0.5 font-mono">
                            {isStaff ? 'Admin' : selectedConversation.visitorName} • {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className={`p-3 rounded-xl text-xs max-w-sm ${
                            isStaff ? 'bg-white text-black font-medium' : 'bg-[#181818] text-white border border-[#262626]'
                          }`}>
                            {m.imageUrl && (
                              <img src={m.imageUrl} alt="attachment" className="rounded-lg mb-2 max-h-48 object-cover grayscale" />
                            )}
                            <p className="whitespace-pre-wrap">{m.text}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <form onSubmit={handleSendAdminReply} className="p-3 bg-[#111111] border-t border-[#222222] flex space-x-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to ${selectedConversation.visitorName}...`}
                    className="flex-1 bg-black border border-[#222222] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                  />
                  <button
                    type="submit"
                    disabled={isSendingReply || !replyText.trim()}
                    className="px-4 py-2 bg-white text-black font-bold text-xs rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-40"
                  >
                    Reply
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-white/40 font-mono p-8">
                Select a conversation on the left.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: IMAGE ARCHIVE */}
      {activeTab === 'images' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0a0a0a] border border-[#222222] space-y-4">
          <h3 className="text-sm font-bold text-white uppercase font-mono">TRANSMITTED PHOTOGRAPHS ARCHIVE</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {chatMessages.filter((m) => m.imageUrl).length === 0 ? (
              <p className="text-xs text-white/40 font-mono col-span-4 py-6 text-center">No image attachments in active conversation.</p>
            ) : (
              chatMessages.filter((m) => m.imageUrl).map((m) => (
                <div key={m.id} className="rounded-xl overflow-hidden border border-[#222222] bg-black">
                  <img src={m.imageUrl} alt="attachment" className="w-full h-36 object-cover grayscale opacity-90 hover:opacity-100 transition-opacity" />
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 7: VISITORS WITH SEARCH */}
      {activeTab === 'users' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0a0a0a] border border-[#222222] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222222] pb-3">
            <h3 className="text-sm font-bold text-white uppercase font-mono">
              REGISTERED VISITORS ({filteredUsers.length})
            </h3>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search visitors..."
                className="w-full bg-black border border-[#222222] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-white"
              />
            </div>
          </div>

          <div className="divide-y divide-[#1f1f1f]">
            {filteredUsers.map((u) => {
              const isBlocked = blockedUserIds.includes(u.uid);
              return (
                <div key={u.uid} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">{u.displayName}</span>
                    <span className="text-[10px] text-white/40 font-mono ml-2">UID: {u.uid}</span>
                  </div>

                  <div>
                    {isBlocked ? (
                      <button
                        onClick={async () => {
                          await unblockUser(u.uid);
                          showNotice(`Unblocked visitor ${u.displayName}.`);
                        }}
                        className="px-3 py-1 bg-white text-black text-xs font-bold rounded hover:bg-zinc-200"
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        onClick={async () => {
                          await blockUser(u.uid);
                          showNotice(`Blocked visitor ${u.displayName}.`);
                        }}
                        className="px-3 py-1 bg-[#1a1a1a] text-white/70 text-xs font-bold rounded hover:text-white"
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

      {/* TAB 8: BLOCKED USERS */}
      {activeTab === 'blocked' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0a0a0a] border border-[#222222] space-y-4">
          <h3 className="text-sm font-bold text-white uppercase font-mono">BLOCKED ENTITIES ({blockedUserIds.length})</h3>
          {blockedUserIds.length === 0 ? (
            <p className="text-xs text-white/40 font-mono py-6 text-center">No blocked users.</p>
          ) : (
            <div className="divide-y divide-[#1f1f1f]">
              {blockedUserIds.map((uid) => (
                <div key={uid} className="py-3 flex items-center justify-between text-xs">
                  <span className="font-mono text-white/70">UID: {uid}</span>
                  <button
                    onClick={async () => {
                      await unblockUser(uid);
                      showNotice(`Unblocked user ${uid}.`);
                    }}
                    className="px-3 py-1 bg-white text-black text-xs font-bold rounded hover:bg-zinc-200"
                  >
                    Unblock
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 9: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0a0a0a] border border-[#222222] space-y-4">
          <h3 className="text-sm font-bold text-white uppercase font-mono">MARKETPLACE PRODUCTS ({PRODUCTS_DATA.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {PRODUCTS_DATA.map((p) => (
              <div key={p.id} className="p-4 rounded-xl bg-[#111111] border border-[#222222] space-y-2">
                <img src={p.imageUrl} alt={p.name} className="w-full h-28 object-cover rounded-lg grayscale" />
                <div className="text-xs font-bold text-white">{p.name}</div>
                <div className="text-[10px] text-white/50 font-mono">{p.company} • {p.category}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 10: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0a0a0a] border border-[#222222] space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white uppercase font-mono">PLATFORM SETTINGS & DISCLOSURES</h3>
          <div className="p-4 rounded-xl bg-[#111111] border border-[#222222] space-y-2">
            <span className="font-bold text-white">Visual Design Constitution:</span>
            <p className="text-white/60">Strictly Black & Small White High-Contrast Monochrome Aesthetic.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#111111] border border-[#222222] space-y-2">
            <span className="font-bold text-white">Platform Independence:</span>
            <p className="text-white/60">
              "ELON MUSK SPACE is an independent technology information and community platform. It is not officially affiliated with Elon Musk or his companies."
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
