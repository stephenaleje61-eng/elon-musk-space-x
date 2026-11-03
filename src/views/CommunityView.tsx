import React, { useState, useEffect } from 'react';
import { 
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
import { SafeImage } from '../components/SafeImage';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-12 bg-black text-white">
      
      {/* Header */}
      <div className="border-b border-zinc-800 pb-8 space-y-2">
        <div className="inline-flex items-center space-x-2 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
          <ShieldCheck className="w-3.5 h-3.5 text-white" />
          <span>VERIFIED COMMUNITY ECOSYSTEM</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
          INDEPENDENT COMMUNITY
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
          Connect with fellow engineers, space enthusiasts, autonomous robotics builders, and aerospace investors in a trusted independent network.
        </p>
      </div>

      {/* Connection Status & Friend Request Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center space-x-2 uppercase">
              <Sparkles className="w-4 h-4 text-white" />
              <span>YOUR COMMUNITY CONNECTION STATUS</span>
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Real-time synchronization with Firebase Firestore.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenMessages}
              className="px-4 py-2 bg-white hover:bg-zinc-200 text-black rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-md"
            >
              <MessageSquare className="w-3.5 h-3.5 text-black" />
              <span>OPEN 1:1 MESSAGES</span>
            </button>

            {friendRequest?.status === 'ACCEPTED' ? (
              <span className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase bg-zinc-800 text-white flex items-center space-x-1.5 border border-zinc-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>VERIFIED FRIEND</span>
              </span>
            ) : friendRequest?.status === 'PENDING' ? (
              <button
                onClick={onOpenFriendModal}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase bg-zinc-800 text-zinc-300 border border-zinc-700 flex items-center space-x-2 cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 animate-spin text-white" />
                <span>REQUEST PENDING</span>
              </button>
            ) : (
              <button
                onClick={onOpenFriendModal}
                className="px-4 py-2 bg-transparent hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-zinc-700 flex items-center space-x-2 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-white" />
                <span>FRIEND BADGE</span>
              </button>
            )}
          </div>
        </div>

        {/* Workflow Info Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-zinc-800 text-xs text-zinc-300">
          <div className="p-4 rounded-2xl bg-black border border-zinc-800 space-y-1 shadow-inner">
            <span className="text-[10px] text-zinc-500 font-mono font-bold block">STEP 01</span>
            <div className="font-bold text-white">Instant Chat Access</div>
            <p className="text-[11px] text-zinc-400">
              Direct private messaging with the administrator anytime without registration walls.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black border border-zinc-800 space-y-1 shadow-inner">
            <span className="text-[10px] text-zinc-500 font-mono font-bold block">STEP 02</span>
            <div className="font-bold text-white">Community Verification</div>
            <p className="text-[11px] text-zinc-400">
              Request a verified friend badge reviewed in real time on the administrator dashboard.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black border border-zinc-800 space-y-1 shadow-inner">
            <span className="text-[10px] text-zinc-500 font-mono font-bold block">STEP 03</span>
            <div className="font-bold text-white">Technical Networks</div>
            <p className="text-[11px] text-zinc-400">
              Engage in technical discussions on aerospace engineering, battery cells, and autonomy.
            </p>
          </div>
        </div>
      </div>

      {/* Community Discussions */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white uppercase">
            COMMUNITY DISCUSSIONS & TECHNICAL THREADS
          </h2>
          <span className="text-xs text-zinc-400 font-mono">4 Active Threads</span>
        </div>

        <div className="space-y-4">
          {COMMUNITY_DISCUSSIONS.map((disc) => (
            <div
              key={disc.id}
              className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all space-y-4 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <SafeImage
                    src={disc.avatar}
                    alt={disc.author}
                    className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-800 object-cover"
                    fallbackText={disc.author.slice(0, 2).toUpperCase()}
                  />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center space-x-2">
                      <span>{disc.author}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono">
                        {disc.badge}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono">{disc.timeAgo}</span>
                  </div>
                </div>

                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-black border border-zinc-800 text-zinc-300 shadow-sm">
                  {disc.companyTag}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-1">{disc.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{disc.snippet}</p>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center space-x-6 text-xs text-zinc-400 font-mono text-[11px]">
                <button className="flex items-center space-x-1.5 hover:text-white transition-colors cursor-pointer">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{disc.likes} Upvotes</span>
                </button>
                <button className="flex items-center space-x-1.5 hover:text-white transition-colors cursor-pointer">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{disc.replies} Replies</span>
                </button>
                <button className="flex items-center space-x-1.5 hover:text-white transition-colors cursor-pointer">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Guidelines Card */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 space-y-2 font-mono shadow-xl">
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
