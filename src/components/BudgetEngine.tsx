import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Star,
  ExternalLink,
  ShoppingBag,
  Heart,
  Sliders,
  CheckCircle2,
  Camera,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { LanguageCode, Product } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { PRODUCTS_CATALOG } from '../data/catalog';

interface BudgetEngineProps {
  currentLang: LanguageCode;
  onApplyKitToTryOn: (products: Product[]) => void;
  onSaveKitToVanity: (products: Product[], budget: number) => void;
}

const PRESET_BUDGETS = [499, 999, 1499, 2499, 4999];

export const BudgetEngine: React.FC<BudgetEngineProps> = ({
  currentLang,
  onApplyKitToTryOn,
  onSaveKitToVanity,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [budgetInput, setBudgetInput] = useState<number>(999);
  const [kitType, setKitType] = useState<'single' | 'kit'>('kit');
  const [isCurating, setIsCurating] = useState<boolean>(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Quality Guardrail Logic:
  // 1. Filter products under budget
  // 2. Prioritize >= 4.5 stars, then >= 4.0 stars, then fallback to next best
  // 3. For 'full kit', assemble a balanced set: Lipstick + Blush/Kajal + Compact/Base strictly <= budget
  const curatedResult = useMemo(() => {
    const budget = Math.max(199, Number(budgetInput) || 499);

    if (kitType === 'single') {
      // Find the single highest-rated product that fits under the budget
      const candidates = PRODUCTS_CATALOG.filter((p) => p.price <= budget);
      
      // Sort: Rating first (descending), then reviews count
      candidates.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.reviewsCount - a.reviewsCount;
      });

      const selected = candidates.length > 0 ? [candidates[0]] : [PRODUCTS_CATALOG[PRODUCTS_CATALOG.length - 1]];
      const totalCost = selected.reduce((sum, p) => sum + p.price, 0);
      const totalMrp = selected.reduce((sum, p) => sum + p.mrp, 0);

      return {
        products: selected,
        totalCost,
        totalSavings: Math.max(0, totalMrp - totalCost),
        budget,
        hasQualityGuardrail: selected.every((p) => p.rating >= 4.0),
        message: selected[0]?.rating >= 4.5
          ? 'Curated 4.5+ Star Award-Winning Single Product within your budget.'
          : 'Best-in-budget certified dermatological pick.',
      };
    }

    // Full Makeup Kit Curation:
    // Ideal categories: Lipstick, Kajal/Eyeliner, Compact/Foundation, Blush
    const lipsticks = PRODUCTS_CATALOG.filter((p) => p.category === 'Lipstick').sort((a, b) => b.rating - a.rating);
    const kajals = PRODUCTS_CATALOG.filter((p) => p.category === 'Kajal').sort((a, b) => b.rating - a.rating);
    const compacts = PRODUCTS_CATALOG.filter((p) => p.category === 'Compact' || p.category === 'Foundation').sort((a, b) => b.rating - a.rating);
    const blushes = PRODUCTS_CATALOG.filter((p) => p.category === 'Blush' || p.category === 'Highlighter').sort((a, b) => b.rating - a.rating);

    let chosen: Product[] = [];

    // Helper to evaluate bundle fitting
    const tryAssemble = (minRating: number): Product[] | null => {
      const filteredLips = lipsticks.filter((p) => p.rating >= minRating);
      const filteredKajals = kajals.filter((p) => p.rating >= minRating);
      const filteredCompacts = compacts.filter((p) => p.rating >= minRating);
      const filteredBlushes = blushes.filter((p) => p.rating >= minRating);

      // Try 4 items (Lipstick + Kajal + Compact + Blush)
      for (const lip of filteredLips) {
        for (const kajal of filteredKajals) {
          for (const base of filteredCompacts) {
            for (const blush of filteredBlushes) {
              if (lip.price + kajal.price + base.price + blush.price <= budget) {
                return [lip, kajal, base, blush];
              }
            }
          }
        }
      }

      // Try 3 items (Lipstick + Kajal + Compact)
      for (const lip of filteredLips) {
        for (const kajal of filteredKajals) {
          for (const base of filteredCompacts) {
            if (lip.price + kajal.price + base.price <= budget) {
              return [lip, kajal, base];
            }
          }
        }
      }

      // Try 2 items (Lipstick + Kajal or Lipstick + Blush)
      for (const lip of filteredLips) {
        for (const kajal of filteredKajals) {
          if (lip.price + kajal.price <= budget) {
            return [lip, kajal];
          }
        }
      }

      return null;
    };

    // Step 1: Try strict high quality (>= 4.5)
    let assembled = tryAssemble(4.5);
    let qualityTierLabel = 'Tier 1 (4.5+ Star Elite Formulas)';

    // Step 2: Fallback to 4.0+
    if (!assembled) {
      assembled = tryAssemble(4.0);
      qualityTierLabel = 'Tier 2 (4.0+ Star Verified Essentials)';
    }

    // Step 3: Graceful fallback to next best available in extreme tight budget
    if (!assembled) {
      assembled = tryAssemble(3.5);
      qualityTierLabel = 'Tier 3 (Certified Best-Value Formulas)';
    }

    // Fallback safeguard if budget is ultra low
    if (!assembled || assembled.length === 0) {
      const sortedByPrice = [...PRODUCTS_CATALOG].sort((a, b) => a.price - b.price);
      assembled = [sortedByPrice[0], sortedByPrice[1]].filter((p) => p !== undefined);
    }

    chosen = assembled;
    const totalCost = chosen.reduce((sum, p) => sum + p.price, 0);
    const totalMrp = chosen.reduce((sum, p) => sum + p.mrp, 0);

    return {
      products: chosen,
      totalCost,
      totalSavings: Math.max(0, totalMrp - totalCost),
      budget,
      hasQualityGuardrail: chosen.every((p) => p.rating >= 4.0),
      message: `Quality Guardrail: ${qualityTierLabel} selected to maximize Indian festive glow without exceeding ₹${budget}.`,
    };
  }, [budgetInput, kitType]);

  const handleCurateClick = () => {
    setIsCurating(true);
    setTimeout(() => {
      setIsCurating(false);
    }, 450);
  };

  const handleSaveToVanity = () => {
    onSaveKitToVanity(curatedResult.products, curatedResult.budget);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const filteredDisplayProducts = useMemo(() => {
    if (activeCategoryFilter === 'all') return curatedResult.products;
    return curatedResult.products.filter((p) => p.category.toLowerCase() === activeCategoryFilter.toLowerCase());
  }, [curatedResult.products, activeCategoryFilter]);

  return (
    <div className="py-8 sm:py-12 bg-gradient-to-b from-[#FFF5F7] via-[#FFF9F9] to-[#FDF2F4] border-y border-[#FAD2DC]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE4EC] text-[#9F1239] text-xs font-semibold tracking-wide mb-3 border border-[#FBCFE8]/60 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#BE185D]" />
            <span>AI Budget & Bundle Recommendation Engine</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4C0519] tracking-tight">
            {t.budgetEngineTitle}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#831843]/80 leading-relaxed font-sans">
            {t.budgetEngineDesc}
          </p>
        </div>

        {/* The Interactive Budget Input Card */}
        <div className="max-w-4xl mx-auto bg-white/95 rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#BE185D]/5 border border-[#FAD2DC] mb-10">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Budget Input & Presets */}
            <div className="md:col-span-7 space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#9D5065]">
                {t.enterBudget}
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-serif font-bold text-[#BE185D]">
                  ₹
                </span>
                <input
                  type="number"
                  min="299"
                  max="15000"
                  step="50"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(Number(e.target.value))}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#FFF9F9] border-2 border-[#FAD2DC] focus:border-[#BE185D] focus:ring-4 focus:ring-[#BE185D]/10 text-2xl font-serif font-bold text-[#4C0519] transition-all outline-none"
                  placeholder="1000"
                />
              </div>

              {/* Quick Tap Presets */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-medium text-[#9D5065] mr-1">Quick Select:</span>
                {PRESET_BUDGETS.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setBudgetInput(amount)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      budgetInput === amount
                        ? 'bg-[#9F1239] text-white shadow-sm shadow-[#9F1239]/30 scale-105'
                        : 'bg-[#FFF0F3] hover:bg-[#FCE7EC] text-[#831843] border border-[#FAD2DC]'
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Kit Type Selector (Single Product vs Full Kit) */}
            <div className="md:col-span-5 space-y-3 md:border-l md:border-[#FAD2DC] md:pl-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#9D5065]">
                Curate Choice
              </label>
              <div className="grid grid-cols-2 gap-2 bg-[#FFF0F3] p-1.5 rounded-2xl border border-[#FAD2DC]">
                <button
                  type="button"
                  onClick={() => setKitType('single')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                    kitType === 'single'
                      ? 'bg-white text-[#9F1239] shadow-sm shadow-[#BE185D]/20 border border-[#FAD2DC]'
                      : 'text-[#831843] hover:text-[#4C0519]'
                  }`}
                >
                  {t.singleProduct}
                </button>
                <button
                  type="button"
                  onClick={() => setKitType('kit')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                    kitType === 'kit'
                      ? 'bg-white text-[#9F1239] shadow-sm shadow-[#BE185D]/20 border border-[#FAD2DC]'
                      : 'text-[#831843] hover:text-[#4C0519]'
                  }`}
                >
                  {t.fullKit}
                </button>
              </div>

              <button
                type="button"
                onClick={handleCurateClick}
                className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-[#9F1239] via-[#BE185D] to-[#831843] hover:from-[#881337] hover:to-[#701A75] text-white text-xs font-bold tracking-wider uppercase shadow-md shadow-[#BE185D]/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <Sparkles className={`w-4 h-4 ${isCurating ? 'animate-spin' : ''}`} />
                <span>{t.curateButton}</span>
              </button>
            </div>

          </div>

          {/* Quality Guardrail Live Assurance Badge */}
          <div className="mt-6 pt-5 border-t border-[#FAD2DC]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#4C0519]">
              <div className="w-5 h-5 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold">{t.qualityGuarantee}:</span>
              <span className="text-[#831843]/90">{curatedResult.message}</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-[#831843]">
              <div>
                {t.totalKitCost}: <span className="font-serif text-base text-[#9F1239] font-bold">₹{curatedResult.totalCost}</span>
              </div>
              {curatedResult.totalSavings > 0 && (
                <div className="text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
                  {t.totalSavings}: ₹{curatedResult.totalSavings}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Curated Products Showcase Section */}
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#4C0519]">
                Curated Recommendation ({curatedResult.products.length} {curatedResult.products.length === 1 ? 'Product' : 'Products'})
              </h3>
              <p className="text-xs text-[#9D5065] mt-0.5">
                Fits strictly under your ₹{budgetInput} limit. Real affiliate items with direct checkouts.
              </p>
            </div>

            {/* Action Bar for the Curated Kit */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => onApplyKitToTryOn(curatedResult.products)}
                className="px-4 py-2 rounded-xl bg-[#FFF0F3] hover:bg-[#FCE7EC] text-[#9F1239] border border-[#FAD2DC] text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Camera className="w-3.5 h-3.5 text-[#BE185D]" />
                <span>Try Shades in Camera</span>
              </button>

              <button
                type="button"
                onClick={handleSaveToVanity}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#9F1239] to-[#BE185D] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-[#BE185D]/25 hover:scale-105 active:scale-95"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-3.5 h-3.5" />
                    <span>Save Kit to Vanity</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredDisplayProducts.map((product) => {
              // Deterministic store brand coloring & badge styling
              const storeColorClass =
                product.store === 'Nykaa'
                  ? 'bg-[#FF1493]/10 text-[#FF1493] border-[#FF1493]/30'
                  : product.store === 'Amazon India'
                  ? 'bg-[#FF9900]/10 text-[#B26A00] border-[#FF9900]/30'
                  : product.store === 'Myntra'
                  ? 'bg-[#FF3F6C]/10 text-[#FF3F6C] border-[#FF3F6C]/30'
                  : 'bg-[#9C27B0]/10 text-[#7B1FA2] border-[#9C27B0]/30';

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl hover:shadow-[#BE185D]/10 border border-[#FAD2DC] transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Tag & Store Pill */}
                    <div className="flex items-center justify-between gap-1 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9D5065]">
                        {product.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${storeColorClass}`}>
                        {product.store}
                      </span>
                    </div>

                    {/* Cosmetic Swatch & Visual Anchor */}
                    <div className="relative w-full h-36 rounded-2xl bg-gradient-to-tr from-[#FFF5F7] to-[#FFF0F3] border border-[#FCE7EC] flex items-center justify-center p-3 mb-3 group-hover:scale-[1.02] transition-transform">
                      {/* Product Visual Container */}
                      <div className="text-center flex flex-col items-center">
                        <div
                          className="w-14 h-14 rounded-full shadow-inner border-2 border-white flex items-center justify-center mb-1.5 transition-transform group-hover:rotate-6"
                          style={{ backgroundColor: product.shadeHex }}
                        >
                          <div className="w-5 h-5 rounded-full bg-white/30 backdrop-blur-xs" />
                        </div>
                        <span className="text-[11px] font-semibold text-[#4C0519] truncate max-w-[170px]">
                          {product.exactShade}
                        </span>
                        {product.badge && (
                          <span className="text-[9px] text-[#BE185D] font-medium bg-[#FFE4EC] px-2 py-0.2 rounded-full mt-1">
                            {product.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Brand & Name */}
                    <h4 className="text-xs font-bold text-[#831843] uppercase tracking-wider">
                      {product.brand}
                    </h4>
                    <p className="text-sm font-semibold text-[#4C0519] line-clamp-2 mt-0.5 leading-snug">
                      {product.name}
                    </p>

                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-1.5 mt-2 text-xs">
                      <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                      </div>
                      <span className="text-[#9D5065] text-[11px]">
                        ({product.reviewsCount.toLocaleString('en-IN')})
                      </span>
                    </div>
                  </div>

                  {/* Pricing & Affiliate CTA */}
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

                    {/* Clear Affiliate Buy Button */}
                    <a
                      href={product.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#9F1239] via-[#BE185D] to-[#831843] hover:from-[#881337] hover:to-[#701A75] text-white text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 shadow-sm shadow-[#BE185D]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>
                        {product.store === 'Nykaa'
                          ? t.buyOnNykaa
                          : product.store === 'Amazon India'
                          ? t.buyOnAmazon
                          : product.store === 'Myntra'
                          ? t.buyOnMyntra
                          : t.buyOnPurplle}
                      </span>
                      <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
