/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LanguageCode, Product, SavedLook, UserProfile } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { DualModeTryOn } from './components/DualModeTryOn';
import { AppliedProductsList } from './components/AppliedProductsList';
import { BudgetEngine } from './components/BudgetEngine';
import { VirtualVanity } from './components/VirtualVanity';
import { ShareModal } from './components/ShareModal';
import { GoogleLoginModal } from './components/GoogleLoginModal';
import { Footer } from './components/Footer';
import { BottomProfileHub } from './components/BottomProfileHub';
import { PRODUCTS_CATALOG } from './data/catalog';

// Initial pre-curated sample saved looks for immediate rich visual experience in "My Virtual Vanity"
const INITIAL_SAVED_LOOKS: SavedLook[] = [
  {
    id: 'look-sangeet-glam-1',
    title: 'Sangeet Royal Rose Glam',
    date: 'Oct 02, 2026',
    viewMode: 'split',
    skinTone: 'Wheatish Warm',
    undertone: 'Warm Golden',
    faceShape: 'Oval',
    outfitName: 'Pastel Blush Pink Embroidered Lehenga',
    outfitHex: '#E8AAB8',
    products: [
      PRODUCTS_CATALOG[0], // Kay Beauty Fame
      PRODUCTS_CATALOG[6], // Kay Beauty Rosy Romance Blush
      PRODUCTS_CATALOG[11], // Colossal Bold Eyeliner
      PRODUCTS_CATALOG[14], // Lakmé CC Cream
    ],
    lipHex: '#A33454',
    blushHex: '#D97587',
    priceAlertActive: true,
    notes: 'Harmonized for warm sunset lighting and heavy silver resham embroidery.',
  },
  {
    id: 'look-diwali-silk-2',
    title: 'Diwali Banarasi Festive Red',
    date: 'Sep 28, 2026',
    viewMode: 'complete',
    skinTone: 'Golden Dusky',
    undertone: 'Golden Olive',
    faceShape: 'Round',
    outfitName: 'Crimson Red Banarasi Silk Saree',
    outfitHex: '#9B1B30',
    products: [
      PRODUCTS_CATALOG[1], // Maybelline Pioneer Red
      PRODUCTS_CATALOG[7], // SUGAR Peach Peak Blush
      PRODUCTS_CATALOG[10], // Faces Canada Kajal
      PRODUCTS_CATALOG[13], // Fit Me Compact
    ],
    lipHex: '#A81831',
    blushHex: '#EE8B74',
    priceAlertActive: false,
    notes: 'Smudge-proof wedding feast lip formula with golden kohl.',
  },
];

export default function App() {
  // Navigation & Language State
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [activeTab, setActiveTab] = useState<'tryon' | 'budget' | 'vanity'>('tryon');

  // User Profile State
  const [user, setUser] = useState<UserProfile>({
    name: 'Priya Sharma',
    email: 'priya.sharma92@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    skinTone: 'wheatish',
    undertone: 'warm',
    isLoggedIn: true,
    savedVanityCount: 2,
  });

  // Saved Looks in Vanity
  const [savedLooks, setSavedLooks] = useState<SavedLook[]>(() => {
    try {
      const stored = localStorage.getItem('touch_and_glow_vanity');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return INITIAL_SAVED_LOOKS;
  });

  // Save to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem('touch_and_glow_vanity', JSON.stringify(savedLooks));
    } catch {
      // ignore
    }
  }, [savedLooks]);

  // Modals State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState<{
    title: string;
    skinTone: string;
    outfitName: string;
    lipShadeName: string;
    products: Product[];
  } | null>(null);

  // Active Applied Products in Try-On
  const [selectedAppliedProducts, setSelectedAppliedProducts] = useState<Product[]>([
    PRODUCTS_CATALOG[0], // Kay Beauty Fame 04
    PRODUCTS_CATALOG[6], // Kay Beauty Rosy Romance Blush
    PRODUCTS_CATALOG[10], // Faces Canada Kajal
    PRODUCTS_CATALOG[13], // Maybelline Fit Me Compact
  ]);

  // Handle Saving Look to Vanity
  const handleSaveLook = (lookData: {
    title: string;
    viewMode: 'split' | 'complete';
    skinTone: string;
    undertone: string;
    faceShape: string;
    outfitName: string;
    outfitHex: string;
    products: Product[];
    lipHex: string;
    blushHex: string;
  }) => {
    const newLook: SavedLook = {
      id: `look-${Date.now()}`,
      title: lookData.title,
      date: new Date().toLocaleDateString('en-IN', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
      viewMode: lookData.viewMode,
      skinTone: lookData.skinTone,
      undertone: lookData.undertone,
      faceShape: lookData.faceShape,
      outfitName: lookData.outfitName,
      outfitHex: lookData.outfitHex,
      products: lookData.products,
      lipHex: lookData.lipHex,
      blushHex: lookData.blushHex,
      priceAlertActive: true,
      notes: `Customized with ${lookData.products.length} affiliate-matched formulas.`,
    };

    setSavedLooks((prev) => [newLook, ...prev]);
  };

  // Toggle Price Drop Alert on a Saved Look
  const handleTogglePriceAlert = (lookId: string) => {
    setSavedLooks((prev) =>
      prev.map((look) =>
        look.id === lookId
          ? { ...look, priceAlertActive: !look.priceAlertActive }
          : look
      )
    );
  };

  // Delete Look
  const handleDeleteLook = (lookId: string) => {
    setSavedLooks((prev) => prev.filter((look) => look.id !== lookId));
  };

  // Reapply Saved Look into Camera Try-On
  const handleReapplyLook = (look: SavedLook) => {
    setSelectedAppliedProducts(look.products);
    setActiveTab('tryon');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // Save Entire Curated Kit from Budget Engine
  const handleSaveKitToVanity = (products: Product[], budget: number) => {
    const newLook: SavedLook = {
      id: `kit-${Date.now()}`,
      title: `₹${budget} Budget Glow Kit`,
      date: new Date().toLocaleDateString('en-IN', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
      viewMode: 'complete',
      skinTone: 'Wheatish Warm',
      undertone: 'Warm Golden',
      faceShape: 'Oval',
      outfitName: 'Festive Everyday Ethnic',
      outfitHex: '#BE185D',
      products,
      lipHex: products[0]?.shadeHex || '#A33454',
      blushHex: products.find((p) => p.category === 'Blush')?.shadeHex || '#EE8B74',
      priceAlertActive: true,
      notes: `Smart budget bundle capped under ₹${budget}.`,
    };

    setSavedLooks((prev) => [newLook, ...prev]);
  };

  // Apply Kit directly to Try-On Camera
  const handleApplyKitToTryOn = (products: Product[]) => {
    setSelectedAppliedProducts(products);
    setActiveTab('tryon');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  // Open Share Dialog
  const handleOpenShareModal = (data: {
    title: string;
    skinTone: string;
    outfitName: string;
    lipShadeName: string;
    products: Product[];
  }) => {
    setShareData(data);
    setIsShareModalOpen(true);
  };

  // Share Look from Vanity
  const handleShareSavedLook = (look: SavedLook) => {
    const lip = look.products[0];
    setShareData({
      title: look.title,
      skinTone: look.skinTone,
      outfitName: look.outfitName,
      lipShadeName: lip ? `${lip.brand} ${lip.exactShade}` : 'Velvet Berry',
      products: look.products,
    });
    setIsShareModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F9] text-[#2C1820]">
      
      {/* Smart Header with Navigation */}
      <Header
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        savedLooksCount={savedLooks.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Hero Section (always visible on Home Try-On tab) */}
        {activeTab === 'tryon' && (
          <Hero
            currentLang={currentLang}
            onStartTryOn={() => {
              const el = document.getElementById('tryon-studio');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onExploreBudget={() => {
              setActiveTab('budget');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Tab 1: Dual-Mode AI Live Try-On & Smart Applied Products */}
        {activeTab === 'tryon' && (
          <div id="tryon-studio">
            <DualModeTryOn
              currentLang={currentLang}
              onSaveLook={handleSaveLook}
              onOpenShareModal={handleOpenShareModal}
              selectedAppliedProducts={selectedAppliedProducts}
              onAppliedProductsChange={(newProducts) => {
                setSelectedAppliedProducts(newProducts);
              }}
              onSelectProduct={(p) => {
                setSelectedAppliedProducts((prev) => [p, ...prev.filter((item) => item.id !== p.id)]);
              }}
            />

            {/* Smart Product Display & Affiliate Actions below Camera */}
            <AppliedProductsList
              products={selectedAppliedProducts}
              currentLang={currentLang}
              onSelectProduct={(p) => {
                setSelectedAppliedProducts((prev) => [p, ...prev.filter((item) => item.id !== p.id)]);
              }}
            />

            {/* Quick Teaser / Inline Budget Curation Strip */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="bg-gradient-to-r from-[#FFF5F7] via-[#FFF0F3] to-[#FCE7EC] p-6 rounded-3xl border border-[#FAD2DC] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-serif text-xl font-bold text-[#4C0519]">
                    Need a Curated Makeup Kit Under ₹500 or ₹1,000?
                  </h4>
                  <p className="text-xs text-[#831843]/80 mt-0.5">
                    Our AI curates 4+ star products that maximize savings across Nykaa, Amazon, and Myntra.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('budget');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="py-2.5 px-6 rounded-full bg-gradient-to-r from-[#9F1239] to-[#BE185D] text-white text-xs font-bold shadow-md shadow-[#BE185D]/25 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                >
                  Open Budget & Bundle Engine →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: The "Budget & Bundle" Engine */}
        {activeTab === 'budget' && (
          <BudgetEngine
            currentLang={currentLang}
            onApplyKitToTryOn={handleApplyKitToTryOn}
            onSaveKitToVanity={handleSaveKitToVanity}
          />
        )}

        {/* Tab 3: User Dashboard ("My Virtual Vanity") */}
        {activeTab === 'vanity' && (
          <VirtualVanity
            savedLooks={savedLooks}
            currentLang={currentLang}
            user={user}
            onTogglePriceAlert={handleTogglePriceAlert}
            onDeleteLook={handleDeleteLook}
            onReapplyLook={handleReapplyLook}
            onShareLook={handleShareSavedLook}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onStartTryOn={() => {
              setActiveTab('tryon');
              window.scrollTo({ top: 380, behavior: 'smooth' });
            }}
          />
        )}

      </main>

      {/* WhatsApp Viral Sharing Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        lookData={shareData}
      />

      {/* Google Sign-In Simulation Modal */}
      <GoogleLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(newProfile) => setUser(newProfile)}
      />

      {/* Luxury Footer with Affiliate Transparency */}
      <Footer
        currentLang={currentLang}
        onSelectTab={setActiveTab}
      />

      {/* Floating Bottom Profile & Language Hub */}
      <BottomProfileHub
        user={user}
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={() =>
          setUser({
            name: 'Guest User',
            email: '',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            skinTone: 'wheatish',
            undertone: 'warm',
            isLoggedIn: false,
            savedVanityCount: 0,
          })
        }
        savedLooksCount={savedLooks.length}
        onNavigateVanity={() => {
          setActiveTab('vanity');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

    </div>
  );
}
