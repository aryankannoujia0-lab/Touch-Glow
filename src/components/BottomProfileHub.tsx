import React, { useState } from 'react';
import {
  User,
  Globe,
  Check,
  Sparkles,
  Heart,
  LogOut,
  X,
  ShieldCheck,
  ChevronRight,
  Settings,
} from 'lucide-react';
import { UserProfile, LanguageCode } from '../types';
import { LANGUAGES, TRANSLATIONS } from '../data/translations';

interface BottomProfileHubProps {
  user: UserProfile;
  currentLang: LanguageCode;
  onSelectLang: (lang: LanguageCode) => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  savedLooksCount: number;
  onNavigateVanity: () => void;
}

export const BottomProfileHub: React.FC<BottomProfileHubProps> = ({
  user,
  currentLang,
  onSelectLang,
  onOpenLogin,
  onLogout,
  savedLooksCount,
  onNavigateVanity,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = TRANSLATIONS[currentLang];
  const currentLanguageInfo = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <>
      {/* Floating Bottom Profile & Language Trigger */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-full bg-white/95 backdrop-blur-md border-2 border-[#FAD2DC] hover:border-[#BE185D] shadow-xl shadow-[#BE185D]/20 transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none"
          title="Profile & Language Settings"
          aria-label="Open Profile and Language Settings"
        >
          {/* User Avatar with Ring */}
          <div className="relative">
            {user.isLoggedIn ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-[#BE185D] shadow-xs"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-[#9F1239] via-[#BE185D] to-[#E1889E] flex items-center justify-center text-white shadow-xs">
                <User className="w-5 h-5 text-white" />
              </div>
            )}

            {/* Glowing VIP Sparkle Badge */}
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-tr from-[#9F1239] to-[#BE185D] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-3 h-3 text-[#FFE4EC]" />
            </div>

            {/* Active Language Badge */}
            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-[#4C0519] text-white text-[9px] font-bold tracking-wider uppercase border border-white">
              {currentLanguageInfo.code}
            </div>
          </div>

          {/* Text Labels (Desktop / Tablet) */}
          <div className="hidden sm:flex flex-col text-left pr-1.5">
            <span className="text-xs font-bold text-[#4C0519] truncate max-w-[120px]">
              {user.isLoggedIn ? user.name.split(' ')[0] : 'Profile & Settings'}
            </span>
            <span className="text-[10px] text-[#BE185D] font-semibold flex items-center gap-1">
              <Globe className="w-2.5 h-2.5" />
              <span>{currentLanguageInfo.nativeName}</span>
            </span>
          </div>

          {/* Pulsing Hint Ripple */}
          <div className="absolute -inset-1 rounded-full bg-[#BE185D]/10 animate-ping pointer-events-none -z-10 opacity-75" />
        </button>
      </div>

      {/* Modal / Bottom Drawer for Profile & Language Settings */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer / Modal Content */}
          <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#FAD2DC] max-h-[90vh] overflow-y-auto p-6 z-10 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
            
            {/* Top Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#FAD2DC]/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#FFE4EC] text-[#9F1239] flex items-center justify-center">
                  <Settings className="w-4 h-4 text-[#BE185D]" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#4C0519]">
                    Profile & Language
                  </h3>
                  <p className="text-[11px] text-[#9D5065]">
                    प्रोफ़ाइल और भाषा सेटिंग्स
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-[#FFF0F3] hover:bg-[#FCE7EC] text-[#9D5065] flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User Profile Card */}
            <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-[#FFF5F7] via-[#FFF0F3] to-[#FDE8EF] border border-[#FAD2DC]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-[#4C0519]">
                        {user.isLoggedIn ? user.name : 'Guest Beauty Lover'}
                      </h4>
                      {user.isLoggedIn && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] flex items-center gap-0.5">
                          <ShieldCheck className="w-2.5 h-2.5" /> VIP
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#9D5065]">
                      {user.isLoggedIn ? user.email : 'Sign in to sync your Virtual Vanity'}
                    </p>
                  </div>
                </div>

                {!user.isLoggedIn ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      onOpenLogin();
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-[#9F1239] hover:bg-[#881337] text-white text-xs font-bold shadow-xs whitespace-nowrap"
                  >
                    {t.loginGoogle}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                    className="p-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1"
                    title={t.logout}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Quick Jump to Saved Looks */}
              <div className="mt-3 pt-3 border-t border-[#FAD2DC]/60 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onNavigateVanity();
                  }}
                  className="flex items-center gap-1.5 text-[#9F1239] font-bold hover:underline"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>My Virtual Vanity ({savedLooksCount} Looks)</span>
                </button>
                <span className="text-[11px] text-[#9D5065] capitalize">
                  {user.skinTone} · {user.undertone} undertone
                </span>
              </div>
            </div>

            {/* Language Selection Section (भाषा चुनें) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-[#BE185D]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#4C0519]">
                    Select Language / भाषा चुनें
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#BE185D] bg-[#FFE4EC] px-2 py-0.5 rounded-full">
                  10 Indian Languages
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1">
                {LANGUAGES.map((lang) => {
                  const isSelected = currentLang === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => onSelectLang(lang.code)}
                      className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-[#BE185D] bg-gradient-to-r from-[#FFF5F7] to-[#FFE4EC] shadow-sm ring-2 ring-[#BE185D]/20'
                          : 'border-[#FAD2DC] hover:border-[#BE185D]/40 bg-white hover:bg-[#FFF9F9]'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-bold text-[#4C0519]">
                          {lang.nativeName}
                        </div>
                        <div className="text-[10px] text-[#9D5065]">
                          {lang.label}
                        </div>
                      </div>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-[#BE185D] text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-[#FAD2DC] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Close Button */}
            <div className="mt-5 pt-3 border-t border-[#FAD2DC]/60">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#9F1239] to-[#BE185D] text-white text-xs font-bold tracking-wide shadow-md shadow-[#BE185D]/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                Apply & Continue / जारी रखें
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
