import React, { useState } from 'react';
import { X, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { UserProfile, SkinToneType, UndertoneType } from '../types';

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

const PRESET_ACCOUNTS = [
  {
    name: 'Priya Sharma',
    email: 'priya.sharma92@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    skinTone: 'wheatish' as SkinToneType,
    undertone: 'warm' as UndertoneType,
  },
  {
    name: 'Ananya Iyer',
    email: 'ananya.iyer.chennai@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    skinTone: 'fair' as SkinToneType,
    undertone: 'neutral' as UndertoneType,
  },
  {
    name: 'Shreya Sengupta',
    email: 'shreya.kolkata@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    skinTone: 'dusky' as SkinToneType,
    undertone: 'olive' as UndertoneType,
  },
];

export const GoogleLoginModal: React.FC<GoogleLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (!isOpen) return null;

  const handleSelectPreset = (account: typeof PRESET_ACCOUNTS[0]) => {
    setIsSigningIn(true);
    setTimeout(() => {
      setIsSigningIn(false);
      onLoginSuccess({
        name: account.name,
        email: account.email,
        avatar: account.avatar,
        skinTone: account.skinTone,
        undertone: account.undertone,
        isLoggedIn: true,
        savedVanityCount: 2,
      });
      onClose();
    }, 400);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    setIsSigningIn(true);
    setTimeout(() => {
      setIsSigningIn(false);
      onLoginSuccess({
        name: customName.trim(),
        email: customEmail.trim() || `${customName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        skinTone: 'wheatish',
        undertone: 'warm',
        isLoggedIn: true,
        savedVanityCount: 1,
      });
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#FAD2DC] p-6 sm:p-7 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FFF0F3] hover:bg-[#FCE7EC] text-[#9D5065] flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Google Branding Header */}
        <div className="text-center mb-6">
          {/* Authentic Google Multi-Color G Icon */}
          <div className="w-12 h-12 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center mx-auto mb-3">
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#4C0519]">
            Sign in with Google
          </h3>
          <p className="text-xs text-[#9D5065] mt-1">
            to unlock your Virtual Vanity, saved looks & discount alerts
          </p>
        </div>

        {/* One-Click Accounts */}
        <div className="space-y-2 mb-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#9D5065] block">
            Choose an account
          </span>
          {PRESET_ACCOUNTS.map((account) => (
            <button
              key={account.email}
              type="button"
              disabled={isSigningIn}
              onClick={() => handleSelectPreset(account)}
              className="w-full p-2.5 rounded-2xl border border-[#FAD2DC] hover:border-[#BE185D] hover:bg-[#FFF5F7] transition-all flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-3">
                <img
                  src={account.avatar}
                  alt={account.name}
                  className="w-9 h-9 rounded-full object-cover border border-[#FAD2DC]"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-xs font-bold text-[#4C0519] group-hover:text-[#9F1239]">
                    {account.name}
                  </div>
                  <div className="text-[10px] text-[#9D5065]">{account.email}</div>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-[#BE185D] opacity-0 group-hover:opacity-100 transition-opacity">
                Select →
              </span>
            </button>
          ))}
        </div>

        {/* Or enter custom user profile */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#FAD2DC]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-white px-2 text-[#9D5065]">Or use another name</span>
          </div>
        </div>

        <form onSubmit={handleCustomSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              placeholder="Your Full Name (e.g. Riya Patel)"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F9] border border-[#FAD2DC] focus:border-[#BE185D] text-xs text-[#4C0519] outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={!customName.trim() || isSigningIn}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#9F1239] to-[#BE185D] text-white text-xs font-bold tracking-wide shadow-sm shadow-[#BE185D]/25 disabled:opacity-50 transition-all"
          >
            {isSigningIn ? 'Connecting...' : 'Continue to Studio'}
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-[#FAD2DC]/60 flex items-center justify-center gap-1.5 text-[11px] text-[#9D5065]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
          <span>Encrypted Beauty Profile · 100% Private</span>
        </div>

      </div>
    </div>
  );
};
