import React from 'react';
import { ShoppingBag, Star, ExternalLink, Sparkles, Check, Heart, TrendingUp, Tag } from 'lucide-react';
import { Product, LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface AppliedProductsListProps {
  products: Product[];
  currentLang: LanguageCode;
  onSaveProductToVanity?: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
}

export const AppliedProductsList: React.FC<AppliedProductsListProps> = ({
  products,
  currentLang,
  onSaveProductToVanity,
  onSelectProduct,
}) => {
  const t = TRANSLATIONS[currentLang];

  // Helper to determine prominent deal badge
  const getDealBadge = (product: Product, index: number) => {
    const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);
    
    // Products with high discount, accessible tier, or low budget qualify as "Best Value"
    const isBestValue = discountPercent >= 25 || product.price <= 350 || product.qualityTier === 'accessible' || product.qualityTier === 'budget_hero';
    
    if (isBestValue) {
      return {
        type: 'best_value',
        label: 'Best Value',
        subtext: `${discountPercent}% OFF`,
        badgeClass: 'bg-gradient-to-r from-[#059669] via-[#047857] to-[#065F46] text-white shadow-sm shadow-emerald-900/20',
        Icon: Tag,
      };
    }

    // Top-rated / luxury or flagship bestseller qualifies as "Trending"
    return {
      type: 'trending',
      label: 'Trending',
      subtext: `${product.rating}★ Top Pick`,
      badgeClass: 'bg-gradient-to-r from-[#9F1239] via-[#BE185D] to-[#831843] text-white shadow-sm shadow-[#BE185D]/30 ring-1 ring-white/30',
      Icon: TrendingUp,
    };
  };

  return (
    <div className="py-8 bg-[#FFF5F7]/70 border-t border-[#FAD2DC]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9F1239] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#BE185D]" />
              <span>Applied Cosmetics In This Look</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#4C0519]">
              {t.appliedProducts}
            </h3>
          </div>
          <p className="text-xs text-[#9D5065]">
            Verified external affiliate links · Seamless delivery across India
          </p>
        </div>

        {/* Swipeable / Scrollable Cards Row with Staggered Reveal Animation */}
        <div className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin">
          {products.map((product, index) => {
            const dealBadge = getDealBadge(product, index);

            const storeBadge =
              product.store === 'Nykaa'
                ? { bg: 'bg-[#FF1493]/10', text: 'text-[#FF1493]', border: 'border-[#FF1493]/25' }
                : product.store === 'Amazon India'
                ? { bg: 'bg-[#FF9900]/10', text: 'text-[#B26A00]', border: 'border-[#FF9900]/25' }
                : product.store === 'Myntra'
                ? { bg: 'bg-[#FF3F6C]/10', text: 'text-[#FF3F6C]', border: 'border-[#FF3F6C]/25' }
                : { bg: 'bg-[#9C27B0]/10', text: 'text-[#7B1FA2]', border: 'border-[#9C27B0]/25' };

            const ctaLabel =
              product.store === 'Nykaa'
                ? t.buyOnNykaa
                : product.store === 'Amazon India'
                ? t.buyOnAmazon
                : product.store === 'Myntra'
                ? t.buyOnMyntra
                : t.buyOnPurplle;

            return (
              <div
                key={`${product.id}-${product.exactShade}`}
                style={{
                  animationDelay: `${index * 70}ms`,
                }}
                className="w-72 sm:w-80 shrink-0 snap-start bg-white rounded-3xl p-4.5 border border-[#FAD2DC] shadow-sm hover:shadow-xl hover:shadow-[#BE185D]/10 transition-all duration-200 flex flex-col justify-between animate-card-reveal"
              >
                <div>
                  {/* Category Header & Affiliate Tag */}
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9D5065]">
                      {product.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${storeBadge.bg} ${storeBadge.text} ${storeBadge.border}`}>
                      {product.store}
                    </span>
                  </div>

                  {/* Cosmetic Swatch & Visual Frame with Prominent Badge */}
                  <div className="relative w-full h-34 rounded-2xl bg-gradient-to-tr from-[#FFF5F7] to-[#FFF0F3] border border-[#FCE7EC] flex items-center justify-center p-3 mb-3 overflow-hidden">
                    
                    {/* Prominent 'Best Value' or 'Trending' Badge */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${dealBadge.badgeClass}`}>
                        <dealBadge.Icon className="w-3 h-3 shrink-0" />
                        <span>{dealBadge.label}</span>
                        <span className="opacity-75 font-semibold text-[9px] lowercase">· {dealBadge.subtext}</span>
                      </span>
                    </div>

                    <div className="flex flex-col items-center pt-2">
                      <div
                        className="w-12 h-12 rounded-full shadow-inner border-2 border-white flex items-center justify-center mb-1 transition-transform group-hover:scale-105"
                        style={{ backgroundColor: product.shadeHex }}
                      >
                        <div className="w-4 h-4 rounded-full bg-white/30 backdrop-blur-xs" />
                      </div>
                      <span className="text-[11px] font-bold text-[#4C0519] truncate max-w-[200px]">
                        {product.exactShade}
                      </span>
                      {product.badge && (
                        <span className="text-[9px] text-[#BE185D] font-medium bg-[#FFE4EC] px-2 py-0.2 rounded-full mt-0.5">
                          {product.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Brand & Name */}
                  <div className="text-[11px] font-bold text-[#831843] uppercase tracking-wider">
                    {product.brand}
                  </div>
                  <h4 className="text-sm font-semibold text-[#4C0519] line-clamp-2 mt-0.5 leading-snug">
                    {product.name}
                  </h4>

                  {/* Rating Stars & Count */}
                  <div className="flex items-center gap-1.5 mt-2 text-xs">
                    <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                    </div>
                    <span className="text-[#9D5065] text-[11px]">
                      ({product.reviewsCount.toLocaleString('en-IN')} reviews)
                    </span>
                  </div>

                  {/* Exact Shade Swatch Tag */}
                  <div className="mt-2.5 flex items-center gap-2 p-1.5 rounded-xl bg-[#FFF9F9] border border-[#FAD2DC]/60">
                    <div
                      className="w-3.5 h-3.5 rounded-full shrink-0 border border-white shadow-xs"
                      style={{ backgroundColor: product.shadeHex }}
                    />
                    <span className="text-[11px] text-[#4C0519] truncate">
                      {t.exactShade}: <strong>{product.exactShade.split('(')[0]}</strong>
                    </span>
                  </div>
                </div>

                {/* Price & Affiliate CTA Button */}
                <div className="mt-4 pt-3 border-t border-[#FAD2DC]/60">
                  <div className="flex items-baseline justify-between mb-2">
                    <div>
                      <span className="font-serif text-lg font-bold text-[#4C0519]">
                        ₹{product.price}
                      </span>
                      <span className="text-xs text-[#9D5065] line-through ml-1.5">
                        ₹{product.mrp}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                      {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                    </span>
                  </div>

                  <a
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#9F1239] via-[#BE185D] to-[#831843] hover:from-[#881337] hover:to-[#701A75] text-white text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 shadow-sm shadow-[#BE185D]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{ctaLabel}</span>
                    <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

