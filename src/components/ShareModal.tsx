import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { Product } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  lookData: {
    title: string;
    skinTone: string;
    outfitName: string;
    lipShadeName: string;
    products: Product[];
  } | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  lookData,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen || !lookData) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://touchandglow.in';

  // Construct Viral Pre-filled WhatsApp Message
  const productsSummary = lookData.products
    .map((p) => `• ${p.brand} (${p.exactShade.split('(')[0]}): ₹${p.price} [${p.store}]`)
    .join('\n');

  const shareText = `Hey! Check out my virtual makeup try-on from *Touch & Glow* 💖

💄 *Look*: ${lookData.title}
👗 *Outfit Match*: ${lookData.outfitName}
✨ *Tone Harmonization*: ${lookData.skinTone}
💋 *Featured Lip*: ${lookData.lipShadeName}

*Products Used*:
${productsSummary}

Try it on your face or shop the shades here:
${currentUrl}`;

  const encodedWhatsAppUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#FAD2DC] p-6 sm:p-7 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FFF0F3] hover:bg-[#FCE7EC] text-[#9D5065] flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#25D366] to-[#128C7E] flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#4C0519]">
              Ask a Friend / Share Look
            </h3>
            <p className="text-xs text-[#9D5065]">
              Get your besties' opinion before wedding & festive events!
            </p>
          </div>
        </div>

        {/* Look Glam Summary Preview Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FFF5F7] to-[#FDE8EF] border border-[#FAD2DC] mb-5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#BE185D] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {lookData.title}
            </span>
            <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-[#FAD2DC] font-semibold text-[#4C0519]">
              {lookData.skinTone}
            </span>
          </div>

          <div className="text-xs text-[#4C0519] space-y-1 pt-1">
            <p>
              <strong className="text-[#831843]">Outfit:</strong> {lookData.outfitName}
            </p>
            <p>
              <strong className="text-[#831843]">Lip Shade:</strong> {lookData.lipShadeName}
            </p>
          </div>

          <div className="pt-2 border-t border-[#FAD2DC]/60 text-[11px] text-[#9D5065]">
            Includes verified affiliate buy links to Nykaa, Amazon, and Myntra.
          </div>
        </div>

        {/* One-Click WhatsApp Share Button */}
        <div className="space-y-3">
          <a
            href={encodedWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20BA5C] hover:to-[#0E7A6E] text-white text-sm font-bold tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Send Look & Links to WhatsApp</span>
          </a>

          {/* Copy Message / Link Action */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full py-3 px-4 rounded-2xl bg-[#FFF0F3] hover:bg-[#FCE7EC] text-[#9F1239] border border-[#FAD2DC] text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Shareable Text & Links</span>
              </>
            )}
          </button>
        </div>

        <p className="text-center text-[10px] text-[#9D5065] mt-4">
          All recommendations strictly link to certified Indian cosmetics retailers with zero markup.
        </p>

      </div>
    </div>
  );
};
