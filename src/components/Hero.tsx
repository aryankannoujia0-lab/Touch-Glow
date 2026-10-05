import React from 'react';
import { Sparkles, Camera, ShoppingBag, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface HeroProps {
  currentLang: LanguageCode;
  onStartTryOn: () => void;
  onExploreBudget: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  currentLang,
  onStartTryOn,
  onExploreBudget,
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F7] via-[#FFF9F9] to-[#FFF0F3] pt-8 pb-14 border-b border-[#FAD2DC]/60">
      
      {/* Decorative Dreamy Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FFE4EC]/60 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-[#FCE7EC]/50 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Pill Kicker */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#FAD2DC] shadow-xs text-xs font-semibold text-[#9F1239]">
              <Sparkles className="w-3.5 h-3.5 text-[#BE185D]" />
              <span>India's #1 AI Makeup & Outfit Harmonizer</span>
            </div>

            {/* Main Luxury Serif Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#4C0519] tracking-tight leading-[1.1] text-balance">
              {t.heroTitle}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#831843]/85 max-w-xl mx-auto lg:mx-0 font-sans leading-relaxed">
              {t.heroSubtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                type="button"
                onClick={onStartTryOn}
                className="w-full sm:w-auto py-3.5 px-7 rounded-full bg-gradient-to-r from-[#9F1239] via-[#BE185D] to-[#831843] hover:from-[#881337] hover:to-[#701A75] text-white text-sm font-bold tracking-wide shadow-lg shadow-[#BE185D]/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>{t.heroCta}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                type="button"
                onClick={onExploreBudget}
                className="w-full sm:w-auto py-3.5 px-6 rounded-full bg-white hover:bg-[#FFF0F3] text-[#9F1239] border border-[#FAD2DC] text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-[#BE185D]" />
                <span>{t.budgetHeadline}</span>
              </button>
            </div>

            {/* Social Trust Marks */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-[#9D5065]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#059669]" />
                <span>4.0+ Star Quality Guardrail</span>
              </div>
              <span className="hidden sm:inline text-gray-300">·</span>
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#BE185D]" />
                <span>100% Indian Undertone Match</span>
              </div>
              <span className="hidden sm:inline text-gray-300">·</span>
              <div>
                <span>Nykaa · Amazon · Myntra · Purplle</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Anchor (Split-Screen Miniature Interactive Showcase) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-white rounded-3xl p-3 shadow-2xl shadow-[#BE185D]/15 border-2 border-[#FAD2DC]">
              
              {/* Artistic Split Screen Visual Showcase */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#FFF5F7] border border-[#FAD2DC]">
                
                {/* Glam Side (Right half) */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FFF0F5] to-[#FCE7EC] flex items-center justify-center">
                  <svg viewBox="0 0 400 300" className="w-full h-full object-cover">
                    {/* Background Soft Glow */}
                    <circle cx="200" cy="150" r="140" fill="#FFE4EC" opacity="0.7" />
                    {/* Blouse */}
                    <path d="M100 300 C 100 230, 150 210, 200 210 C 250 210, 300 230, 300 300 Z" fill="#9B1B30" />
                    <path d="M140 220 Q 200 240 260 220" stroke="#D4AF37" strokeWidth="5" fill="none" />
                    {/* Neck */}
                    <path d="M175 160 L 175 220 Q 200 225 225 220 L 225 160 Z" fill="#DFAC7C" />
                    {/* Face */}
                    <ellipse cx="200" cy="130" rx="65" ry="80" fill="#DFAC7C" />
                    {/* Cheeks Blush */}
                    <circle cx="160" cy="140" r="22" fill="#E78C79" opacity="0.6" />
                    <circle cx="240" cy="140" r="22" fill="#E78C79" opacity="0.6" />
                    {/* Kohl Eyes */}
                    <ellipse cx="170" cy="115" rx="14" ry="7" fill="#FFFFFF" />
                    <circle cx="170" cy="115" r="5" fill="#2E1B10" />
                    <path d="M156 112 Q 170 105 186 114" stroke="#111111" strokeWidth="2.5" fill="none" />
                    <ellipse cx="230" cy="115" rx="14" ry="7" fill="#FFFFFF" />
                    <circle cx="230" cy="115" r="5" fill="#2E1B10" />
                    <path d="M214 114 Q 230 105 244 112" stroke="#111111" strokeWidth="2.5" fill="none" />
                    {/* Bindi */}
                    <circle cx="200" cy="105" r="2" fill="#A81831" />
                    {/* Berry Lips */}
                    <path d="M180 160 Q 200 155 220 160 Q 200 174 180 160 Z" fill="#A33454" />
                    {/* Hair */}
                    <path d="M130 130 C 125 50, 275 50, 270 130 C 275 190, 260 260, 250 260 C 230 180, 170 180, 150 260 C 140 260, 125 190, 130 130 Z" fill="#1A110D" />
                    {/* Jhumka */}
                    <circle cx="135" cy="150" r="2.5" fill="#D4AF37" />
                    <circle cx="265" cy="150" r="2.5" fill="#D4AF37" />
                  </svg>
                </div>

                {/* Left Side (Bare Skin Clip) */}
                <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden border-r-2 border-white shadow-xl">
                  <div className="w-[200%] h-full bg-[#FAF5F0]">
                    <svg viewBox="0 0 400 300" className="w-full h-full object-cover">
                      <path d="M100 300 C 100 230, 150 210, 200 210 C 250 210, 300 300 Z" fill="#E5DDD3" />
                      <path d="M175 160 L 175 220 Q 200 225 225 220 L 225 160 Z" fill="#D6A374" />
                      <ellipse cx="200" cy="130" rx="65" ry="80" fill="#D6A374" />
                      <ellipse cx="170" cy="115" rx="13" ry="6" fill="#FFFFFF" />
                      <circle cx="170" cy="115" r="4.5" fill="#3D291F" />
                      <ellipse cx="230" cy="115" rx="13" ry="6" fill="#FFFFFF" />
                      <circle cx="230" cy="115" r="4.5" fill="#3D291F" />
                      <path d="M180 160 Q 200 156 220 160 Q 200 170 180 160 Z" fill="#C48E83" />
                      <path d="M130 130 C 125 50, 275 50, 270 130 C 275 190, 260 260, 250 260 C 230 180, 170 180, 150 260 C 140 260, 125 190, 130 130 Z" fill="#221712" />
                    </svg>
                  </div>
                </div>

                {/* Interactive Split Bar Overlay Tag */}
                <div className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#4C0519] border border-[#FAD2DC]">
                  Real Me
                </div>

                <div className="absolute bottom-2.5 right-2.5 bg-[#9F1239] text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-xs">
                  Glam Me
                </div>

              </div>

              {/* Caption Banner under Showcase */}
              <div className="mt-3 flex items-center justify-between px-2 text-xs">
                <div>
                  <span className="font-bold text-[#4C0519]">Live Dual-Mode Simulation</span>
                  <p className="text-[11px] text-[#9D5065]">Real-time undertone & saree match</p>
                </div>
                <button
                  type="button"
                  onClick={onStartTryOn}
                  className="px-3 py-1.5 rounded-xl bg-[#FFF0F3] hover:bg-[#FCE7EC] text-[#9F1239] border border-[#FAD2DC] font-bold text-[11px] transition-colors"
                >
                  Try Now →
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
