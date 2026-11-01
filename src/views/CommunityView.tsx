import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles, 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Info 
} from 'lucide-react';
import { useAuth } from '../firebase/authContext';
import { listenToUserFriendRequest } from '../firebase/services';
import { COMMUNITY_DISCUSSIONS } from '../data/platformData';
import { FriendRequest } from '../types';

interface CommunityViewProps {
  onOpenFriendModal: () => void;
  onOpenMessages: () => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  onOpenFriendModal,
  onOpenMessages,
}) => {
  const { user } = useAuth();
  const [friendRequest, setFriendRequest] = useState<FriendRequest | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsub = listenToUserFriendRequest(user.uid, (req) => {
      setFriendRequest(req);
    });
    return () => unsub();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-12 bg-black">
      
      {/* Header */}
      <div className="border-b border-[#222222] pb-8 space-y-2">
        <div className="inline-flex items-center space-x-2 text-[10px] font-mono text-white/50 uppercase tracking-widest">
          <ShieldCheck className="w-3.5 h-3.5 text-white" />
          <span>VERIFIED COMMUNITY ECOSYSTEM</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
          INDEPENDENT COMMUNITY
        </h1>
        <p className="text-xs sm:text-sm text-white/60 max-w-3xl leading-relaxed">
          Connect with fellow engineers, space enthusiasts, autonomous robotics builders, and aerospace investors in a trusted independent network.
        </p>
      </div>

      {/* Connection Status & Friend Request Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0a0a] border border-[#222222] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center space-x-2 uppercase">
              <Sparkles className="w-4 h-4 text-white" />
              <span>YOUR COMMUNITY CONNECTION STATUS</span>
            </h3>
            <p className="text-xs text-white/50 font-mono">
              Real-time synchronization with Firebase Firestore.
            </p>
          </div>

          <div>
            {friendRequest?.status === 'ACCEPTED' ? (
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 rounded text-xs font-mono font-bold uppercase bg-white text-black flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>VERIFIED FRIEND</span>
                </span>
                <button
                  onClick={onOpenMessages}
                  className="px-4 py-2 bg-white text-black hover:bg-zinc-200 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-black" />
                  <span>OPEN 1:1 MESSAGES</span>
                </button>
              </div>
            ) : friendRequest?.status === 'PENDING' ? (
              <button
                onClick={onOpenFriendModal}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase bg-white/10 text-white border border-white/20 flex items-center space-x-2"
              >
                <Clock className="w-3.5 h-3.5 animate-spin text-white" />
                <span>REQUEST PENDING APPROVAL</span>
              </button>
            ) : (
              <button
                onClick={onOpenFriendModal}
                className="px-5 py-2.5 bg-white hover:bg-zinc-200 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center space-x-2"
              >
                <UserPlus className="w-4 h-4 text-black" />
                <span>SEND FRIEND REQUEST</span>
              </button>
            )}
          </div>
        </div>

        {/* Workflow Info Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#1f1f1f] text-xs text-white/70">
          <div className="p-4 rounded-xl bg-[#111111] border border-[#222222] space-y-1">
            <span className="text-[10px] text-white/40 font-mono font-bold block">STEP 01</span>
            <div className="font-bold text-white">Anonymous Identity</div>
            <p className="text-[11px] text-white/50">
              Seamless persistent session with no forced password requirements.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#111111] border border-[#222222] space-y-1">
            <span className="text-[10px] text-white/40 font-mono font-bold block">STEP 02</span>
            <div className="font-bold text-white">Administrator Review</div>
            <p className="text-[11px] text-white/50">
              The community administrator receives a real-time notification to review the request.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#111111] border border-[#222222] space-y-1">
            <span className="text-[10px] text-white/40 font-mono font-bold block">STEP 03</span>
            <div className="font-bold text-white">Private 1-on-1 Access</div>
            <p className="text-[11px] text-white/50">
              Accepted members gain direct access to a private chat channel with image messaging.
            </p>
          </div>
        </div>
      </div>

      {/* Community Discussions */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#222222] pb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white uppercase">
            COMMUNITY DISCUSSIONS & TECHNICAL THREADS
          </h2>
          <span className="text-xs text-white/40 font-mono">4 Active Threads</span>
        </div>

        <div className="space-y-4">
          {COMMUNITY_DISCUSSIONS.map((disc) => (
            <div
              key={disc.id}
              className="p-6 rounded-2xl bg-[#0a0a0a] border border-[#222222] hover:border-white/40 transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={disc.avatar}
                    alt={disc.author}
                    className="w-9 h-9 rounded-full bg-black border border-[#222222] grayscale"
                  />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center space-x-2">
                      <span>{disc.author}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-white border border-white/20 font-mono">
                        {disc.badge}
                      </span>
                    </div>
                    <span className="text-[10px] text-white/40 font-mono">{disc.timeAgo}</span>
                  </div>
                </div>

                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-[#111111] border border-[#222222] text-white/70">
                  {disc.companyTag}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-1">{disc.title}</h3>
                <p className="text-xs text-white/60 leading-relaxed">{disc.snippet}</p>
              </div>

              <div className="pt-3 border-t border-[#1f1f1f] flex items-center space-x-6 text-xs text-white/50 font-mono text-[11px]">
                <button className="flex items-center space-x-1.5 hover:text-white transition-colors">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{disc.likes} Upvotes</span>
                </button>
                <button className="flex items-center space-x-1.5 hover:text-white transition-colors">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{disc.replies} Replies</span>
                </button>
                <button className="flex items-center space-x-1.5 hover:text-white transition-colors">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Guidelines Card */}
      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-[#222222] text-xs text-white/50 space-y-2 font-mono">
        <h4 className="font-bold text-white uppercase tracking-wider flex items-center space-x-2">
          <Info className="w-4 h-4 text-white" />
          <span>COMMUNITY ETHOS & STANDARDS</span>
        </h4>
        <p className="leading-relaxed text-[11px]">
          ELON MUSK SPACE is dedicated to rigorous exploration of aerospace, space capital investments, artificial intelligence, and robotics. Impersonation of company executives or public figures is strictly prohibited.
        </p>
      </div>

    </div>
  );
};
