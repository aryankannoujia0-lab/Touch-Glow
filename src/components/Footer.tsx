import React from 'react';
import { Sparkles, ShieldCheck, Heart, Award, ExternalLink } from 'lucide-react';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface FooterProps {
  currentLang: LanguageCode;
  onSelectTab: (tab: 'tryon' | 'budget' | 'vanity') => void;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onSelectTab }) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <footer className="bg-[#FFF0F3] border-t border-[#FAD2DC] pt-12 pb-10 text-[#4C0519]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Trust Features Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-10 border-b border-[#FAD2DC]/70 text-xs">
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white text-[#BE185D] flex items-center justify-center shrink-0 shadow-xs border border-[#FAD2DC]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold text-[#4C0519]">AI Undertone Precision</h5>
              <p className="text-[#831843]/80 mt-0.5">
                Calibrated specifically for Indian wheatish, dusky, and deep skin tones.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white text-[#BE185D] flex items-center justify-center shrink-0 shadow-xs border border-[#FAD2DC]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h5 className="font-bold text-[#4C0519]">Quality Guardrail 4.0+</h5>
              <p className="text-[#831843]/80 mt-0.5">
                Prioritizes dermatologically tested cosmetics with verified consumer acclaim.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white text-[#BE185D] flex items-center justify-center shrink-0 shadow-xs border border-[#FAD2DC]">
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h5 className="font-bold text-[#4C0519]">Zero Direct Markups</h5>
              <p className="text-[#831843]/80 mt-0.5">
                Pure affiliate links to Nykaa, Amazon India, Myntra, and Purplle official stores.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white text-[#BE185D] flex items-center justify-center shrink-0 shadow-xs border border-[#FAD2DC]">
              <Heart className="w-4 h-4 text-[#BE185D]" />
            </div>
            <div>
              <h5 className="font-bold text-[#4C0519]">Indian Outfit Harmony</h5>
              <p className="text-[#831843]/80 mt-0.5">
                Coordinates lip and cheek pigments with Banarasi sarees and bridal lehengas.
              </p>
            </div>
          </div>

        </div>

        {/* Brand & Links Grid */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-6 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#9F1239] to-[#BE185D] flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif text-xl font-bold text-[#4C0519]">
                Touch & Glow
              </span>
            </div>
            <p className="text-xs text-[#831843]/80 max-w-md font-sans">
              India's premier AI-powered virtual makeup and outfit try-on platform. Empowering every woman to visualize shades, discover budget kits, and shop authenticated beauty formulas effortlessly.
            </p>
          </div>

          <div className="md:col-span-6 flex flex-wrap md:justify-end gap-5 text-xs font-semibold text-[#831843]">
            <button
              onClick={() => onSelectTab('tryon')}
              className="hover:text-[#4C0519] transition-colors"
            >
              {t.tryOnNav}
            </button>
            <button
              onClick={() => onSelectTab('budget')}
              className="hover:text-[#4C0519] transition-colors"
            >
              {t.budgetNav}
            </button>
            <button
              onClick={() => onSelectTab('vanity')}
              className="hover:text-[#4C0519] transition-colors"
            >
              {t.vanityNav}
            </button>
            <a
              href="https://www.nykaa.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#4C0519] transition-colors inline-flex items-center gap-1"
            >
              <span>Nykaa Luxe</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
            <a
              href="https://www.amazon.in/beauty"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#4C0519] transition-colors inline-flex items-center gap-1"
            >
              <span>Amazon Beauty</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </div>

        </div>

        {/* Affiliate Disclosure Notice (Monetization Compliance) */}
        <div className="pt-6 border-t border-[#FAD2DC]/60 text-[11px] text-[#9D5065] space-y-1">
          <p>
            <strong>Affiliate Transparency Notice:</strong> Touch & Glow is strictly an affiliate product recommendation service. When you click on affiliate links to Nykaa, Amazon India, Myntra, or Purplle and complete a purchase, we may earn a small referral commission at no additional cost to you. All prices, discounts, and inventory availability are managed directly by the merchant platforms.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 text-[10px]">
            <span>© 2026 Touch & Glow Studio. Handcrafted for the Indian Market. All rights reserved.</span>
            <span className="mt-1 sm:mt-0">Made with love for Indian festive and daily glam.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
