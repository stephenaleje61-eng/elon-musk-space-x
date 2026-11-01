import React, { useState, useEffect } from 'react';
import { 
  User, 
  ShieldCheck, 
  Save, 
  CheckCircle, 
  MessageSquare, 
  LogOut, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../firebase/authContext';
import { listenToUserFriendRequest } from '../firebase/services';
import { FriendRequest } from '../types';

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-8">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-5">
        <div className="inline-flex items-center space-x-2 text-[10px] font-mono text-white/50 uppercase tracking-widest mb-1.5">
          <User className="w-3 h-3 text-white" />
          <span>VISITOR PROFILE & CREDENTIALS</span>
        </div>
        <h1 className="text-2xl font-light text-white tracking-tight uppercase">
          MY PROFILE
        </h1>
        <p className="text-[11px] text-white/50 tracking-wide mt-1">
          Manage your independent community credentials, display avatar, and private connection status.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-7">
        
        {/* Top Identity Row */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 pb-6 border-b border-white/10">
          <div className="relative group">
            <img
              src={photoURL || `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.uid || 'guest'}`}
              alt="Avatar"
              className="w-20 h-20 rounded-xl object-cover bg-black border border-white/20"
            />
            {isAdmin && (
              <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded text-[9px] font-mono font-semibold uppercase bg-white text-black">
                Admin
              </span>
            )}
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <h2 className="text-lg font-light text-white flex items-center justify-center sm:justify-start space-x-2">
              <span>{profile?.displayName || 'Explorer'}</span>
              <span className="text-[9px] px-2 py-0.5 rounded border border-white/30 text-white font-mono tracking-wider">
                VERIFIED COMMUNITY
              </span>
            </h2>
            <p className="text-[10px] text-white/40 font-mono">
              UID: {user?.uid || 'Pending'}
            </p>
            <p className="text-[11px] text-white/50">
              Joined: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Active Explorer'}
            </p>
          </div>

          {/* Quick Chat Shortcut if Accepted */}
          {friendRequest?.status === 'ACCEPTED' && (
            <button
              onClick={onOpenMessages}
              className="px-4 py-2 bg-white hover:bg-neutral-200 text-black rounded text-[11px] font-medium tracking-wider uppercase flex items-center space-x-2 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>OPEN MESSAGES</span>
            </button>
          )}
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSaveProfile} className="space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-white/60 mb-2">
                Display Name
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={60}
                className="w-full bg-black border border-white/15 focus:border-white rounded px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-white/60 mb-2">
                Avatar URL or Preset
              </label>
              <input
                type="text"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-black border border-white/15 focus:border-white rounded px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none transition-colors font-mono"
              />
            </div>
          </div>

          {/* Quick Avatar Seed Selector */}
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">
              Quick Space Avatar Preset:
            </span>
            <div className="flex flex-wrap gap-2">
              {avatarSeeds.map((seed) => {
                const url = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}&backgroundColor=000000`;
                return (
                  <button
                    key={seed}
                    type="button"
                    onClick={() => setPhotoURL(url)}
                    className="p-1 rounded border border-white/10 hover:border-white transition-colors bg-black"
                  >
                    <img src={url} alt={seed} className="w-7 h-7 rounded" />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-white/60 mb-2">
              About / Engineering Interests
            </label>
            <textarea
              rows={3}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Tell other community members what technological breakthroughs fascinate you..."
              maxLength={400}
              className="w-full bg-black border border-white/15 focus:border-white rounded px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none transition-colors resize-none leading-relaxed"
            />
          </div>

          {saveError && (
            <div className="p-3 rounded bg-white/5 border border-white/20 text-white text-xs flex items-center space-x-2 font-mono">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 rounded bg-white/5 border border-white/30 text-white text-xs flex items-center space-x-2 font-mono">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Profile updated successfully in Firestore</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-white hover:bg-neutral-200 text-black font-semibold text-[11px] uppercase tracking-wider rounded transition-colors flex items-center space-x-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'SAVING...' : 'SAVE PROFILE'}</span>
            </button>

            <div className="flex items-center space-x-2">
              {!user?.email && (
                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="px-3.5 py-2 bg-transparent hover:bg-white/5 border border-white/20 text-white rounded text-[11px] font-mono uppercase tracking-wider transition-colors flex items-center space-x-1.5"
                >
                  <span>Connect Google Account</span>
                </button>
              )}

              <button
                type="button"
                onClick={signOut}
                className="px-3.5 py-2 bg-transparent hover:bg-white/5 border border-white/15 text-white/60 hover:text-white rounded text-[11px] font-mono uppercase tracking-wider transition-colors flex items-center space-x-1.5"
              >
                <LogOut className="w-3 h-3" />
                <span>RESET SESSION</span>
              </button>
            </div>
          </div>

        </form>

        {/* Connection Status Section */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-widest text-white/70">
            FRIEND & 1:1 MESSAGING PRIVILEGES
          </h3>

          <div className="p-4 rounded-xl bg-black border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-medium text-white mb-1 flex items-center space-x-2">
                <span>Friend Request Status:</span>
                <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-mono tracking-wider ${
                  friendRequest?.status === 'ACCEPTED'
                    ? 'border border-white/40 text-white bg-white/10'
                    : friendRequest?.status === 'PENDING'
                    ? 'border border-white/20 text-white/70 bg-white/5'
                    : 'border border-white/10 text-white/40'
                }`}>
                  {friendRequest?.status || 'NOT SUBMITTED'}
                </span>
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed">
                {friendRequest?.status === 'ACCEPTED'
                  ? 'Your identity is verified. Private 1-on-1 conversations with the administrator are unlocked.'
                  : friendRequest?.status === 'PENDING'
                  ? 'Your request is in the administrator queue. You will be notified once reviewed.'
                  : 'Submit a connection request to unlock direct private messaging with the community administrator.'}
              </p>
            </div>

            {friendRequest?.status !== 'ACCEPTED' && (
              <button
                onClick={onOpenFriendModal}
                className="px-4 py-2 bg-white hover:bg-neutral-200 text-black font-semibold text-[11px] uppercase tracking-wider rounded transition-colors shrink-0"
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
