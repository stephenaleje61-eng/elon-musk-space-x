import React, { useState, useEffect } from 'react';
import { X, Send, Clock, CheckCircle2, AlertCircle, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-[#222222] rounded-2xl shadow-2xl p-6 sm:p-8 text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-white/50 hover:text-white rounded-lg hover:bg-[#1a1a1a] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight text-white uppercase">CONNECT WITH THE FUTURE</h3>
            <p className="text-[10px] text-white/50 font-mono">Verified Community Friend Request</p>
          </div>
        </div>

        {/* Existing Status Banner */}
        {existingRequest && (
          <div className="mb-6 p-4 rounded-xl border bg-[#111111] border-[#222222]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-white/50">CURRENT STATUS:</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                  existingRequest.status === 'ACCEPTED'
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-white border border-white/20'
                }`}
              >
                {existingRequest.status}
              </span>
            </div>

            {existingRequest.status === 'PENDING' && (
              <div className="flex items-start space-x-2 text-[11px] text-white/60 mt-2">
                <Clock className="w-3.5 h-3.5 text-white/70 shrink-0 mt-0.5 animate-spin" />
                <span>
                  Your connection request is pending administrator review. Once approved, you gain access to the private 1-on-1 messaging channel.
                </span>
              </div>
            )}

            {existingRequest.status === 'ACCEPTED' && (
              <div className="mt-3">
                <div className="flex items-center space-x-2 text-xs text-white mb-3">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Request accepted! You are an authorized community connection.</span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenMessages();
                  }}
                  className="w-full py-2.5 px-4 bg-white text-black rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all hover:bg-zinc-200"
                >
                  <MessageSquare className="w-4 h-4 text-black" />
                  <span>OPEN PRIVATE MESSAGES</span>
                </button>
              </div>
            )}

            {existingRequest.status === 'REJECTED' && (
              <div className="flex items-start space-x-2 text-xs text-white/60 mt-2">
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
              <label className="block text-[10px] font-mono font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                Your Display Name *
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. AstroPioneer"
                maxLength={60}
                className="w-full bg-[#111111] border border-[#222222] focus:border-white rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                Note or Technology & Space Interests (Optional)
              </label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Share your interest in Starship, Starlink, AI, Space Investments, or why you'd like to connect..."
                maxLength={280}
                className="w-full bg-[#111111] border border-[#222222] focus:border-white rounded-lg px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none transition-colors resize-none"
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-lg bg-white/10 border border-white/30 text-white text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
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
              className="px-6 py-2 bg-[#111111] hover:bg-[#1a1a1a] border border-[#222222] text-xs font-semibold text-white rounded-lg transition-all"
            >
              CLOSE
            </button>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-6 pt-4 border-t border-[#1f1f1f] text-center">
          <p className="text-[10px] text-white/40 leading-relaxed font-mono">
            Requests are reviewed directly by the community administrator. Connected members receive private 1-on-1 messaging privileges.
          </p>
        </div>
      </div>
    </div>
  );
};
