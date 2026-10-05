import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  currentLang: LanguageCode;
  onSelectLang?: (lang: LanguageCode) => void;
  activeTab: 'tryon' | 'budget' | 'vanity';
  onSelectTab: (tab: 'tryon' | 'budget' | 'vanity') => void;
  savedLooksCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  activeTab,
  onSelectTab,
  savedLooksCount,
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <header className="sticky top-0 z-30 bg-[#FFF9F9]/95 backdrop-blur-md border-b border-[#F7D8E0]/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo Zone */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab('tryon')}
              className="flex items-center gap-2.5 text-left group transition-transform focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#9F1239] via-[#BE185D] to-[#E1889E] flex items-center justify-center text-white shadow-sm shadow-[#BE185D]/30 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-[#FFE4EC]" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#4C0519] group-hover:text-[#9F1239] transition-colors leading-none">
                  Touch & Glow
                </span>
                <span className="text-[10px] tracking-widest uppercase font-medium text-[#9D5065] mt-1">
                  Virtual Beauty Studio
                </span>
              </div>
            </button>
          </div>

          {/* Clean Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 bg-[#FFF0F3] p-1.5 rounded-full border border-[#FAD2DC]/60">
            <button
              onClick={() => onSelectTab('tryon')}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                activeTab === 'tryon'
                  ? 'bg-gradient-to-r from-[#9F1239] to-[#BE185D] text-white shadow-sm shadow-[#BE185D]/25'
                  : 'text-[#831843] hover:text-[#4C0519] hover:bg-white/60'
              }`}
            >
              {t.tryOnNav}
            </button>
            <button
              onClick={() => onSelectTab('budget')}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                activeTab === 'budget'
                  ? 'bg-gradient-to-r from-[#9F1239] to-[#BE185D] text-white shadow-sm shadow-[#BE185D]/25'
                  : 'text-[#831843] hover:text-[#4C0519] hover:bg-white/60'
              }`}
            >
              {t.budgetNav}
            </button>
            <button
              onClick={() => onSelectTab('vanity')}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'vanity'
                  ? 'bg-gradient-to-r from-[#9F1239] to-[#BE185D] text-white shadow-sm shadow-[#BE185D]/25'
                  : 'text-[#831843] hover:text-[#4C0519] hover:bg-white/60'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>{t.vanityNav}</span>
              {savedLooksCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-[#FFE4EC] text-[#9F1239]">
                  {savedLooksCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Zone: Quick Try-On CTA */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onSelectTab('tryon')}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#9F1239] via-[#BE185D] to-[#831843] hover:from-[#881337] hover:to-[#701A75] text-white text-xs font-bold tracking-wide shadow-sm shadow-[#BE185D]/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live AI Try-On</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-[#FAD2DC]/40">
          <button
            onClick={() => onSelectTab('tryon')}
            className={`text-xs font-semibold py-1 px-3 rounded-full transition-all ${
              activeTab === 'tryon' ? 'bg-[#9F1239] text-white' : 'text-[#831843]'
            }`}
          >
            {t.tryOnNav}
          </button>
          <button
            onClick={() => onSelectTab('budget')}
            className={`text-xs font-semibold py-1 px-3 rounded-full transition-all ${
              activeTab === 'budget' ? 'bg-[#9F1239] text-white' : 'text-[#831843]'
            }`}
          >
            {t.budgetNav}
          </button>
          <button
            onClick={() => onSelectTab('vanity')}
            className={`text-xs font-semibold py-1 px-3 rounded-full transition-all flex items-center gap-1 ${
              activeTab === 'vanity' ? 'bg-[#9F1239] text-white' : 'text-[#831843]'
            }`}
          >
            <span>{t.vanityNav}</span>
            {savedLooksCount > 0 && (
              <span className="text-[10px] font-bold bg-[#FFE4EC] text-[#9F1239] px-1 rounded-full">
                {savedLooksCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
