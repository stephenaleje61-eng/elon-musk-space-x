import React, { useState, useEffect } from 'react';
import { X, Send, Clock, CheckCircle2, AlertCircle, Sparkles, MessageSquare } from 'lucide-react';
import { useAuth } from '../firebase/authContext';
import { sendFriendRequest, listenToUserFriendRequest } from '../firebase/services';
import { FriendRequest } from '../types';

interface FriendRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMessages: () => void;
}

export const FriendRequestModal: React.FC<FriendRequestModalProps> = ({
  isOpen,
  onClose,
  onOpenMessages,
}) => {
  const { user, profile, updateProfileData } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [existingRequest, setExistingRequest] = useState<FriendRequest | null>(null);

  useEffect(() => {
    if (profile?.displayName) {
      setDisplayName(profile.displayName);
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    const unsub = listenToUserFriendRequest(user.uid, (req) => {
      setExistingRequest(req);
    });
    return () => unsub();
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setErrorMessage('Please enter your display name.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (profile && displayName.trim() !== profile.displayName) {
        await updateProfileData(displayName.trim());
      }
      await sendFriendRequest(displayName.trim(), note);
      setSuccessMessage('Friend request successfully submitted! The community administrator has been notified.');
      setNote('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit friend request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-black border border-zinc-800 flex items-center justify-center text-white">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight text-white uppercase">CONNECT WITH THE FUTURE</h3>
            <p className="text-[10px] text-zinc-400 font-mono">Verified Community Friend Request</p>
          </div>
        </div>

        {/* Existing Status Banner */}
        {existingRequest && (
          <div className="mb-6 p-4 rounded-2xl border bg-black border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-zinc-400">CURRENT STATUS:</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                  existingRequest.status === 'ACCEPTED'
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                    : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                }`}
              >
                {existingRequest.status}
              </span>
            </div>

            {existingRequest.status === 'PENDING' && (
              <div className="flex items-start space-x-2 text-[11px] text-zinc-400 mt-2">
                <Clock className="w-3.5 h-3.5 text-white shrink-0 mt-0.5 animate-spin" />
                <span>
                  Your connection request is pending administrator review. You can also chat directly anytime using the Chat button!
                </span>
              </div>
            )}

            {existingRequest.status === 'ACCEPTED' && (
              <div className="mt-3">
                <div className="flex items-center space-x-2 text-xs text-white mb-3">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Request accepted! You are an authorized community connection.</span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenMessages();
                  }}
                  className="w-full py-2.5 px-4 bg-white text-black rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all hover:bg-zinc-200 cursor-pointer shadow-md"
                >
                  <MessageSquare className="w-4 h-4 text-black" />
                  <span>OPEN PRIVATE MESSAGES</span>
                </button>
              </div>
            )}

            {existingRequest.status === 'REJECTED' && (
              <div className="flex items-start space-x-2 text-xs text-red-400 mt-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span>Your previous request was declined. You may submit an updated message below.</span>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        {existingRequest?.status !== 'PENDING' && existingRequest?.status !== 'ACCEPTED' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                Your Display Name *
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. AstroPioneer"
                maxLength={60}
                className="w-full bg-black border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                Note or Technology & Space Interests (Optional)
              </label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Share your interest in Starship, Starlink, AI, Space Investments, or why you'd like to connect..."
                maxLength={280}
                className="w-full bg-black border border-zinc-800 focus:border-white rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 bg-white hover:bg-zinc-200 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md"
            >
              {submitting ? (
                <>
                  <Clock className="w-4 h-4 animate-spin text-black" />
                  <span>TRANSMITTING REQUEST...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-black" />
                  <span>TRANSMIT FRIEND REQUEST</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="text-center pt-2">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold text-white rounded-xl transition-all cursor-pointer"
            >
              CLOSE
            </button>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-6 pt-4 border-t border-zinc-800 text-center">
          <p className="text-[10px] text-zinc-500 leading-relaxed font-mono">
            Requests are reviewed directly by the community administrator. Connected members receive verified badges and private messaging.
          </p>
        </div>
      </div>
    </div>
  );
};
