import React, { useState, useEffect } from 'react';
import { 
  User, 
  Save, 
  CheckCircle, 
  MessageSquare, 
  LogOut, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../firebase/authContext';
import { listenToUserFriendRequest } from '../firebase/services';
import { FriendRequest } from '../types';
import { SafeImage } from '../components/SafeImage';

interface ProfileViewProps {
  onOpenMessages: () => void;
  onOpenFriendModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onOpenMessages,
  onOpenFriendModal,
}) => {
  const { user, profile, updateProfileData, signInWithGoogle, signOut, isAdmin } = useAuth();
  
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [about, setAbout] = useState('');
  const [friendRequest, setFriendRequest] = useState<FriendRequest | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setPhotoURL(profile.photoURL || '');
      setAbout(profile.about || '');
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    const unsub = listenToUserFriendRequest(user.uid, (req) => {
      setFriendRequest(req);
    });
    return () => unsub();
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setSaveError('Display name is required.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      await updateProfileData(displayName.trim(), photoURL.trim(), about.trim());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const avatarSeeds = ['Astro', 'Cybertruck', 'Starship', 'Falcon', 'Tesla', 'Grok'];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-8 bg-black text-white">
      
      {/* Header */}
      <div className="border-b border-zinc-800 pb-5">
        <div className="inline-flex items-center space-x-2 text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
          <User className="w-3.5 h-3.5 text-white" />
          <span>VISITOR PROFILE & CREDENTIALS</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight uppercase">
          MY PROFILE
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Manage your independent community credentials, display avatar, and private connection status.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-7 shadow-2xl">
        
        {/* Top Identity Row */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 pb-6 border-b border-zinc-800">
          <div className="relative group">
            <SafeImage
              src={photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || 'Explorer')}&background=18181b&color=ffffff`}
              alt="Avatar"
              className="w-20 h-20 rounded-2xl object-cover bg-black border border-zinc-800 shadow-md"
              fallbackText={(displayName || 'E').slice(0, 2).toUpperCase()}
            />
            {isAdmin && (
              <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-white text-black shadow">
                Admin
              </span>
            )}
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <h2 className="text-lg font-bold text-white flex items-center justify-center sm:justify-start space-x-2">
              <span>{profile?.displayName || 'Explorer'}</span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono tracking-wider border border-zinc-700">
                VERIFIED COMMUNITY
              </span>
            </h2>
            <p className="text-[10px] text-zinc-500 font-mono">
              UID: {user?.uid || 'Pending'}
            </p>
            <p className="text-xs text-zinc-400">
              Joined: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Active Explorer'}
            </p>
          </div>

          {/* Quick Chat Shortcut */}
          <button
            onClick={onOpenMessages}
            className="px-4 py-2 bg-white hover:bg-zinc-200 text-black rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer shadow-md"
          >
            <MessageSquare className="w-3.5 h-3.5 text-black" />
            <span>OPEN 1:1 MESSAGES</span>
          </button>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSaveProfile} className="space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-2 font-bold">
                Display Name
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={60}
                className="w-full bg-black border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-2 font-bold">
                Avatar URL or Preset
              </label>
              <input
                type="text"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-black border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors font-mono"
              />
            </div>
          </div>

          {/* Quick Avatar Seed Selector */}
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2 font-bold">
              Quick Space Avatar Preset:
            </span>
            <div className="flex flex-wrap gap-2">
              {avatarSeeds.map((seed) => {
                const url = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}&backgroundColor=18181b`;
                return (
                  <button
                    key={seed}
                    type="button"
                    onClick={() => setPhotoURL(url)}
                    className="p-1 rounded-xl border border-zinc-800 hover:border-white transition-colors bg-black cursor-pointer shadow-sm"
                  >
                    <img src={url} alt={seed} className="w-7 h-7 rounded-lg" />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-2 font-bold">
              About / Engineering Interests
            </label>
            <textarea
              rows={3}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Tell other community members what technological breakthroughs fascinate you..."
              maxLength={400}
              className="w-full bg-black border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors resize-none leading-relaxed"
            />
          </div>

          {saveError && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center space-x-2 font-mono">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center space-x-2 font-mono">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Profile updated successfully in Firestore</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center space-x-2 cursor-pointer shadow-md"
            >
              <Save className="w-3.5 h-3.5 text-black" />
              <span>{isSaving ? 'SAVING...' : 'SAVE PROFILE'}</span>
            </button>

            <div className="flex items-center space-x-2">
              {!user?.email && (
                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-xl text-xs font-mono uppercase tracking-wider transition-colors flex items-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <span>Connect Google Account</span>
                </button>
              )}

              <button
                type="button"
                onClick={signOut}
                className="px-3.5 py-2 bg-transparent hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-mono uppercase tracking-wider transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>RESET SESSION</span>
              </button>
            </div>
          </div>

        </form>

        {/* Connection Status Section */}
        <div className="pt-6 border-t border-zinc-800 space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold">
            FRIEND & 1:1 MESSAGING PRIVILEGES
          </h3>

          <div className="p-5 rounded-2xl bg-black border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-inner">
            <div>
              <div className="text-xs font-bold text-white mb-1 flex items-center space-x-2">
                <span>Friend Request Status:</span>
                <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-mono tracking-wider ${
                  friendRequest?.status === 'ACCEPTED'
                    ? 'border border-emerald-800 text-emerald-400 bg-emerald-950/80'
                    : friendRequest?.status === 'PENDING'
                    ? 'border border-amber-800 text-amber-400 bg-amber-950/80'
                    : 'border border-zinc-800 text-zinc-400 bg-zinc-900'
                }`}>
                  {friendRequest?.status || 'NOT SUBMITTED'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {friendRequest?.status === 'ACCEPTED'
                  ? 'Your identity is verified. Private 1-on-1 conversations with the administrator are active.'
                  : friendRequest?.status === 'PENDING'
                  ? 'Your request is in the administrator queue. You can continue sending private messages anytime.'
                  : 'Submit a connection request to receive an official community badge from the administrator.'}
              </p>
            </div>

            {friendRequest?.status !== 'ACCEPTED' && (
              <button
                onClick={onOpenFriendModal}
                className="px-4 py-2 bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shrink-0 cursor-pointer shadow-md"
              >
                {friendRequest?.status === 'PENDING' ? 'VIEW STATUS' : 'SEND REQUEST'}
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
