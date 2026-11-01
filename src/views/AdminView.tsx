import React, { useState, useEffect } from 'react';
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
  Send 
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

  // Master Passkey Authentication for easy evaluation and management
  const [passkeyInput, setPasskeyInput] = useState('');
  const [passkeyError, setPasskeyError] = useState(false);

  // Live Firestore State
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);
  
  // Active Chat State in Admin Dashboard
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

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
    } else {
      setPasskeyError(true);
    }
  };

  // Admin Friend Request Actions
  const handleAccept = async (req: FriendRequest) => {
    try {
      await acceptFriendRequest(req, user?.uid || 'admin');
    } catch (err) {
      console.error('Failed to accept request:', err);
    }
  };

  const handleReject = async (req: FriendRequest) => {
    try {
      await rejectFriendRequest(req);
    } catch (err) {
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
    } catch (err) {
      console.error('Failed to send admin reply:', err);
    } finally {
      setIsSendingReply(false);
    }
  };

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
                (Dev authorization: <code className="text-white">admin</code> or <code className="text-white">spaceX</code>)
              </span>
            </div>

            {passkeyError && (
              <p className="text-xs text-red-400">Invalid authorization credentials.</p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-white hover:bg-zinc-200 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all"
            >
              AUTHENTICATE ADMIN
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-8 bg-black">
      
      {/* Admin Top Banner (Monochrome Black & White) */}
      <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-[#222222] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-white tracking-tight uppercase">
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
          onClick={() => setAdminOverride(false)}
          className="px-3.5 py-1.5 bg-[#111111] hover:bg-[#1a1a1a] border border-[#222222] rounded-xl text-xs text-white/70 hover:text-white transition-all self-start md:self-auto font-mono"
        >
          Exit Admin Mode
        </button>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
        {[
          { id: 'overview', label: '1. OVERVIEW' },
          { id: 'investments', label: `2. SPACE INVESTMENTS (${investments.length})` },
          { id: 'requests', label: `3. FRIEND REQUESTS (${pendingRequests.length})` },
          { id: 'friends', label: `4. ACCEPTED FRIENDS (${acceptedFriends.length})` },
          { id: 'chat', label: `5. PRIVATE MESSAGES (${conversations.length})` },
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
                  ? 'bg-white text-black font-extrabold'
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
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-[#222222] space-y-1">
              <span className="text-[10px] font-mono text-white/40 uppercase">Space Capital Inquiries</span>
              <div className="text-2xl font-black text-white font-mono">{investments.length}</div>
            </div>
            <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-[#222222] space-y-1">
              <span className="text-[10px] font-mono text-white/40 uppercase">Pending Friend Requests</span>
              <div className="text-2xl font-black text-white font-mono">{pendingRequests.length}</div>
            </div>
            <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-[#222222] space-y-1">
              <span className="text-[10px] font-mono text-white/40 uppercase">Accepted Connections</span>
              <div className="text-2xl font-black text-white font-mono">{acceptedFriends.length}</div>
            </div>
            <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-[#222222] space-y-1">
              <span className="text-[10px] font-mono text-white/40 uppercase">Active 1:1 Chats</span>
              <div className="text-2xl font-black text-white font-mono">{conversations.length}</div>
            </div>
            <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-[#222222] space-y-1">
              <span className="text-[10px] font-mono text-white/40 uppercase">Total Visitors Logged</span>
              <div className="text-2xl font-black text-white font-mono">{allUsers.length || 1}</div>
            </div>
            <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-[#222222] space-y-1">
              <span className="text-[10px] font-mono text-white/40 uppercase">Blocked Entities</span>
              <div className="text-2xl font-black text-white font-mono">{blockedUserIds.length}</div>
            </div>
          </div>

          {/* Recent Space Inquiries Quick View */}
          <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-[#222222] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                RECENT SPACE ALLOCATION INQUIRIES ({investments.length})
              </h3>
              <button
                onClick={() => setActiveTab('investments')}
                className="text-[10px] text-white/60 hover:text-white font-mono underline"
              >
                View All
              </button>
            </div>
            {investments.length === 0 ? (
              <p className="text-xs text-white/40 font-mono">No space capital inquiries logged yet.</p>
            ) : (
              <div className="space-y-3">
                {investments.slice(0, 3).map((inv) => (
                  <div key={inv.id} className="p-4 rounded-xl bg-[#111111] border border-[#222222] flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-white">{inv.investorName} • {inv.organization || 'Private Individual'}</div>
                      <div className="text-[11px] text-white/60">{inv.targetAmount} in {inv.targetSector}</div>
                      <span className="text-[10px] font-mono text-white/40">{inv.email}</span>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/10 text-white border border-white/20">
                      {inv.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SPACE INVESTMENTS */}
      {activeTab === 'investments' && (
        <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-[#222222] space-y-6">
          <div className="border-b border-[#222222] pb-3">
            <h3 className="text-base font-bold text-white uppercase">SPACE CAPITAL ALLOCATION INQUIRIES</h3>
            <p className="text-xs text-white/50">
              Live accredited and institutional investor inquiries submitted from the Space Investment portal.
            </p>
          </div>

          {investments.length === 0 ? (
            <p className="text-xs text-white/40 font-mono py-6">
              No inquiries submitted yet. Go to the "INVESTMENT" portal on the website to submit an inquiry.
            </p>
          ) : (
            <div className="space-y-4">
              {investments.map((inv) => (
                <div
                  key={inv.id}
                  className="p-5 rounded-2xl bg-[#111111] border border-[#222222] space-y-3 text-xs"
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-mono text-white/70">
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
                        <span className="text-white/40 block">Telephone / Wire:</span>
                        <span className="text-white">{inv.phone}</span>
                      </div>
                    )}
                  </div>

                  {inv.notes && (
                    <div className="p-3 bg-black/60 rounded-lg border border-[#222222] text-[11px] text-white/60">
                      <span className="font-bold text-white block mb-0.5 font-mono text-[10px]">Investor Notes:</span>
                      {inv.notes}
                    </div>
                  )}

                  <div className="flex items-center space-x-2 pt-2 border-t border-[#1f1f1f]">
                    <span className="text-[10px] text-white/40 font-mono">Update Status:</span>
                    <button
                      onClick={() => updateInvestmentStatus(inv.id, 'CONNECTED')}
                      className="px-2.5 py-1 bg-white text-black font-bold text-[10px] rounded uppercase"
                    >
                      Mark Connected
                    </button>
                    <button
                      onClick={() => updateInvestmentStatus(inv.id, 'IN_REVIEW')}
                      className="px-2.5 py-1 bg-[#1a1a1a] border border-[#333333] text-white text-[10px] rounded uppercase"
                    >
                      In Review
                    </button>
                    <button
                      onClick={() => updateInvestmentStatus(inv.id, 'DECLINED')}
                      className="px-2.5 py-1 bg-[#1a1a1a] text-white/50 text-[10px] rounded uppercase"
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

      {/* TAB 3: FRIEND REQUESTS */}
      {activeTab === 'requests' && (
        <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-[#222222] space-y-4">
          <h3 className="text-sm font-bold text-white uppercase font-mono">INCOMING FRIEND REQUESTS</h3>
          {friendRequests.length === 0 ? (
            <p className="text-xs text-white/40 font-mono">No friend requests have been submitted yet.</p>
          ) : (
            <div className="divide-y divide-[#1f1f1f]">
              {friendRequests.map((req) => (
                <div key={req.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white">{req.displayName}</span>
                      <span className="text-[9px] font-mono uppercase px-2 py-0.2 rounded bg-white/10 text-white">
                        {req.status}
                      </span>
                    </div>
                    {req.note && <p className="text-xs text-white/60 mt-1">"{req.note}"</p>}
                    <span className="text-[9px] text-white/40 font-mono">
                      ID: {req.senderId} • Date: {new Date(req.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {req.status === 'PENDING' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleAccept(req)}
                        className="px-3 py-1 bg-white text-black text-xs font-bold rounded"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(req)}
                        className="px-3 py-1 bg-[#1a1a1a] text-white/70 text-xs font-bold rounded"
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
        <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-[#222222] space-y-4">
          <h3 className="text-sm font-bold text-white uppercase font-mono">ACCEPTED COMMUNITY FRIENDS ({acceptedFriends.length})</h3>
          {acceptedFriends.length === 0 ? (
            <p className="text-xs text-white/40 font-mono">No accepted friends yet.</p>
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
                      if (conv) setSelectedConversation(conv);
                      setActiveTab('chat');
                    }}
                    className="w-full py-1.5 px-3 bg-white text-black rounded text-xs font-bold flex items-center justify-center space-x-1"
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

      {/* TAB 5: PRIVATE MESSAGES HUB */}
      {activeTab === 'chat' && (
        <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[550px]">
          <div className="md:col-span-4 border-r border-[#222222] bg-black overflow-y-auto max-h-[550px]">
            <div className="p-3 bg-[#111111] border-b border-[#222222] text-xs font-bold text-white uppercase font-mono">
              VISITOR CHATS
            </div>
            {conversations.length === 0 ? (
              <p className="p-4 text-xs text-white/40 font-mono">No conversations yet.</p>
            ) : (
              conversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedConversation(c)}
                  className={`p-3 border-b border-[#1f1f1f] cursor-pointer ${
                    selectedConversation?.id === c.id ? 'bg-[#181818] border-l-2 border-white' : 'hover:bg-[#111111]'
                  }`}
                >
                  <div className="text-xs font-bold text-white">{c.visitorName}</div>
                  <div className="text-[10px] text-white/50 truncate font-mono">{c.lastMessage}</div>
                </div>
              ))
            )}
          </div>

          <div className="md:col-span-8 flex flex-col bg-[#0a0a0a]">
            {selectedConversation ? (
              <>
                <div className="p-3 bg-[#111111] border-b border-[#222222] flex items-center justify-between text-xs font-bold text-white">
                  <span>Chatting with: {selectedConversation.visitorName}</span>
                  <span className="text-[10px] font-mono text-white/50">UID: {selectedConversation.visitorId.slice(0, 8)}</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[420px]">
                  {chatMessages.map((m) => {
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
                            <img src={m.imageUrl} alt="attachment" className="rounded-lg mb-2 max-h-48 object-cover" />
                          )}
                          <p>{m.text}</p>
                        </div>
                      </div>
                    );
                  })}
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
                    className="px-4 py-2 bg-white text-black font-bold text-xs rounded-lg"
                  >
                    Reply
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-white/40 font-mono">
                Select a conversation on the left.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: IMAGE MESSAGES ARCHIVE */}
      {activeTab === 'images' && (
        <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-[#222222] space-y-4">
          <h3 className="text-sm font-bold text-white uppercase font-mono">TRANSMITTED PHOTOGRAPHS</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {chatMessages.filter((m) => m.imageUrl).length === 0 ? (
              <p className="text-xs text-white/40 font-mono col-span-4">No image messages in this channel.</p>
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

      {/* TAB 7: USERS & TAB 8: BLOCKED */}
      {(activeTab === 'users' || activeTab === 'blocked') && (
        <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-[#222222] space-y-4">
          <h3 className="text-sm font-bold text-white uppercase font-mono">
            {activeTab === 'users' ? 'REGISTERED VISITORS' : 'BLOCKED USERS ARCHIVE'}
          </h3>

          <div className="divide-y divide-[#1f1f1f]">
            {allUsers
              .filter((u) => activeTab === 'users' || blockedUserIds.includes(u.uid))
              .map((u) => {
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
                          onClick={() => unblockUser(u.uid)}
                          className="px-3 py-1 bg-white text-black text-xs font-bold rounded"
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          onClick={() => blockUser(u.uid)}
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

      {/* TAB 9: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-[#222222] space-y-4">
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
        <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-[#222222] space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white uppercase font-mono">PLATFORM SETTINGS</h3>
          <div className="p-4 rounded-xl bg-[#111111] border border-[#222222] space-y-1">
            <span className="font-bold text-white">Theme:</span>
            <p className="text-white/60">Strictly Black & Small White High-Contrast Monochrome Aesthetic.</p>
          </div>
        </div>
      )}

    </div>
  );
};
