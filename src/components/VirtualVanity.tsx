import React, { useState } from 'react';
import {
  Heart,
  Bell,
  BellOff,
  ShoppingBag,
  ExternalLink,
  Trash2,
  Share2,
  Camera,
  Sparkles,
  Calendar,
  CheckCircle,
  Tag,
} from 'lucide-react';
import { SavedLook, Product, LanguageCode, UserProfile } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface VirtualVanityProps {
  savedLooks: SavedLook[];
  currentLang: LanguageCode;
  user: UserProfile;
  onTogglePriceAlert: (lookId: string) => void;
  onDeleteLook: (lookId: string) => void;
  onReapplyLook: (look: SavedLook) => void;
  onShareLook: (look: SavedLook) => void;
  onOpenLogin: () => void;
  onStartTryOn: () => void;
}

export const VirtualVanity: React.FC<VirtualVanityProps> = ({
  savedLooks,
  currentLang,
  user,
  onTogglePriceAlert,
  onDeleteLook,
  onReapplyLook,
  onShareLook,
  onOpenLogin,
  onStartTryOn,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [alertFeedback, setAlertFeedback] = useState<string | null>(null);

  const handleToggleAlertWithToast = (lookId: string) => {
    onTogglePriceAlert(lookId);
    setAlertFeedback('Price Drop Alert updated! You will receive notification when items discount.');
    setTimeout(() => setAlertFeedback(null), 3500);
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Vanity Profile Header */}
      <div className="bg-gradient-to-r from-[#FFF5F7] via-[#FFF0F3] to-[#FDE8EF] rounded-3xl p-6 sm:p-8 border border-[#FAD2DC] mb-10 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#BE185D] text-white flex items-center justify-center text-xs shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4C0519]">
                  {t.vanityTitle}
                </h1>
                <span className="text-[10px] font-bold text-[#BE185D] bg-white px-2.5 py-0.5 rounded-full border border-[#FAD2DC] shadow-xs">
                  VIP Beauty Diary
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#831843]/80 mt-1">
                {user.isLoggedIn ? `Welcome back, ${user.name} · ${savedLooks.length} Saved Looks` : 'Sign in to sync your saved looks across devices.'}
              </p>
            </div>
          </div>

          {!user.isLoggedIn ? (
            <button
              type="button"
              onClick={onOpenLogin}
              className="py-2.5 px-5 rounded-full bg-gradient-to-r from-[#9F1239] to-[#BE185D] text-white text-xs font-bold shadow-md shadow-[#BE185D]/25 hover:scale-105 active:scale-95 transition-all self-start sm:self-auto"
            >
              {t.loginGoogle}
            </button>
          ) : (
            <button
              type="button"
              onClick={onStartTryOn}
              className="py-2.5 px-5 rounded-full bg-gradient-to-r from-[#9F1239] to-[#BE185D] text-white text-xs font-bold shadow-md shadow-[#BE185D]/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 self-start sm:self-auto"
            >
              <Camera className="w-4 h-4" />
              <span>Create New Glam Look</span>
            </button>
          )}

        </div>
      </div>

      {/* Alert Toast Notification */}
      {alertFeedback && (
        <div className="mb-6 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{alertFeedback}</span>
        </div>
      )}

      {/* Saved Looks Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#4C0519]">
              {t.savedLooks}
            </h2>
            <p className="text-xs text-[#9D5065] mt-0.5">
              Each look preserves your exact harmonized lipstick, blush, and affiliate partner links.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#831843] bg-[#FFE4EC] px-3 py-1 rounded-full border border-[#FAD2DC]">
            {savedLooks.length} {savedLooks.length === 1 ? 'Look' : 'Looks'}
          </span>
        </div>

        {savedLooks.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-[#FAD2DC] max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#FFF0F3] text-[#BE185D] flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#4C0519]">
              Your Vanity Is Empty
            </h3>
            <p className="text-xs text-[#9D5065] mt-1 max-w-sm mx-auto">
              {t.noSavedLooks}
            </p>
            <button
              type="button"
              onClick={onStartTryOn}
              className="mt-5 py-2.5 px-6 rounded-full bg-gradient-to-r from-[#9F1239] to-[#BE185D] text-white text-xs font-bold shadow-md shadow-[#BE185D]/25 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>Launch Virtual Try-On</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedLooks.map((look) => {
              return (
                <div
                  key={look.id}
                  className="bg-white rounded-3xl border border-[#FAD2DC] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#BE185D]/10 transition-all flex flex-col justify-between"
                >
                  {/* Top Preview Card */}
                  <div>
                    <div className="relative h-48 bg-gradient-to-br from-[#FFF5F7] to-[#FCE7EC] p-4 flex items-center justify-center border-b border-[#FAD2DC]/60 overflow-hidden">
                      
                      {/* Stylized Visual Miniature */}
                      <div className="text-center flex flex-col items-center">
                        <div className="relative">
                          <div
                            className="w-20 h-20 rounded-full border-4 border-white shadow-md flex items-center justify-center"
                            style={{ backgroundColor: look.outfitHex }}
                          >
                            <div
                              className="w-8 h-8 rounded-full border-2 border-white shadow-inner"
                              style={{ backgroundColor: look.lipHex }}
                            />
                          </div>
                          <span className="absolute -bottom-1 -right-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#4C0519] border border-[#FAD2DC] shadow-xs">
                            {look.viewMode === 'split' ? 'Split View' : 'Complete Look'}
                          </span>
                        </div>

                        <span className="text-xs font-bold text-[#4C0519] mt-2.5 truncate max-w-[200px]">
                          {look.outfitName}
                        </span>
                      </div>

                      {/* Date Badge */}
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#9D5065] text-[10px] font-semibold px-2 py-1 rounded-lg border border-[#FAD2DC] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#BE185D]" />
                        <span>{look.date}</span>
                      </div>

                      {/* Delete Action */}
                      <button
                        type="button"
                        onClick={() => onDeleteLook(look.id)}
                        className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 hover:bg-red-50 text-[#9D5065] hover:text-red-600 border border-[#FAD2DC] flex items-center justify-center transition-colors shadow-xs"
                        title={t.deleteLook}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Metadata & Diagnostics Info */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h4 className="font-serif text-lg font-bold text-[#4C0519]">
                          {look.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-[#831843]">
                          <span className="bg-[#FFF0F3] px-2 py-0.5 rounded-md border border-[#FAD2DC]">
                            {look.skinTone}
                          </span>
                          <span className="bg-[#FFF0F3] px-2 py-0.5 rounded-md border border-[#FAD2DC]">
                            {look.undertone}
                          </span>
                          <span className="bg-[#FFF0F3] px-2 py-0.5 rounded-md border border-[#FAD2DC]">
                            {look.faceShape} Face
                          </span>
                        </div>
                      </div>

                      {/* Price Drop Alert Toggle Switch */}
                      <div className="p-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FAD2DC] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {look.priceAlertActive ? (
                            <Bell className="w-4 h-4 text-emerald-600 animate-bounce" />
                          ) : (
                            <BellOff className="w-4 h-4 text-[#9D5065]" />
                          )}
                          <div>
                            <span className="text-xs font-bold text-[#4C0519]">
                              {t.priceDropAlert}
                            </span>
                            <p className="text-[10px] text-[#9D5065]">
                              {look.priceAlertActive ? 'Monitoring discounts on Nykaa & Amazon' : 'Turn on for discount alerts'}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleAlertWithToast(look.id)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            look.priceAlertActive ? 'bg-[#BE185D]' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                              look.priceAlertActive ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Saved Products List with Direct Affiliate Links */}
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#9D5065] block mb-1.5">
                          Products Used ({look.products.length}):
                        </span>
                        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                          {look.products.map((prod) => (
                            <div
                              key={prod.id}
                              className="p-2 rounded-xl bg-[#FFF5F7]/80 border border-[#FCE7EC] flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2 overflow-hidden">
                                <div
                                  className="w-3 h-3 rounded-full shrink-0 border border-white"
                                  style={{ backgroundColor: prod.shadeHex }}
                                />
                                <div className="truncate">
                                  <span className="font-bold text-[#4C0519]">{prod.brand}</span>{' '}
                                  <span className="text-[#831843] text-[11px] truncate">({prod.exactShade.split('(')[0]})</span>
                                </div>
                              </div>

                              <a
                                href={prod.affiliateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] font-bold text-[#BE185D] hover:underline flex items-center gap-0.5 shrink-0 ml-2"
                              >
                                <span>₹{prod.price}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Card Bottom Action Bar */}
                  <div className="p-4 pt-2 border-t border-[#FAD2DC]/60 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onReapplyLook(look)}
                      className="py-2 px-3 rounded-xl bg-[#FFF0F3] hover:bg-[#FCE7EC] text-[#9F1239] border border-[#FAD2DC] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{t.reapplyLook}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onShareLook(look)}
                      className="py-2 px-3 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs hover:scale-102 active:scale-98"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
};
