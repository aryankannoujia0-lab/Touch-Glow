export type LanguageCode =
  | 'en' // English
  | 'hi' // Hindi (हिन्दी)
  | 'mr' // Marathi (मराठी)
  | 'ta' // Tamil (தமிழ்)
  | 'te' // Telugu (తెలుగు)
  | 'bn' // Bengali (বাংলা)
  | 'gu' // Gujarati (ગુજરાતી)
  | 'kn' // Kannada (ಕನ್ನಡ)
  | 'ml' // Malayalam (മലയാളം)
  | 'pa'; // Punjabi (ਪੰਜਾਬੀ)

export type SkinToneType = 'fair' | 'wheatish' | 'dusky' | 'deep';
export type UndertoneType = 'warm' | 'cool' | 'neutral' | 'olive';
export type FaceShapeType = 'oval' | 'round' | 'heart' | 'square';

export type AffiliateStore = 'Nykaa' | 'Amazon India' | 'Myntra' | 'Purplle';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'Lipstick' | 'Foundation' | 'Blush' | 'Kajal' | 'Eyeshadow' | 'Compact' | 'Primer' | 'Highlighter';
  exactShade: string;
  shadeHex: string;
  price: number;
  mrp: number;
  rating: number;
  reviewsCount: number;
  store: AffiliateStore;
  affiliateUrl: string;
  description: string;
  badge?: string;
  qualityTier: 'luxury' | 'premium' | 'budget_hero' | 'accessible';
}

export interface OutfitOption {
  id: string;
  name: string;
  category: string;
  colorName: string;
  primaryHex: string;
  secondaryHex: string;
  imageUrl?: string;
  suggestedLipHex: string;
  suggestedBlushHex: string;
  suggestedEyeTone: string;
}

export interface SavedLook {
  id: string;
  title: string;
  date: string;
  viewMode: 'split' | 'complete';
  skinTone: string;
  undertone: string;
  faceShape: string;
  outfitName: string;
  outfitHex: string;
  products: Product[];
  lipHex: string;
  blushHex: string;
  priceAlertActive: boolean;
  notes?: string;
  previewUrl?: string;
}

export interface ModelPreset {
  id: string;
  name: string;
  skinToneLabel: string;
  skinToneKey: 'fair' | 'wheatish' | 'dusky' | 'deep';
  undertoneLabel: string;
  undertoneKey: 'warm' | 'cool' | 'neutral' | 'olive';
  faceShape: 'Oval' | 'Round' | 'Heart' | 'Square';
  skinHex: string;
  glamSkinHex: string;
  defaultLipHex: string;
  defaultBlushHex: string;
  description: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  skinTone: SkinToneType;
  undertone: UndertoneType;
  isLoggedIn: boolean;
  savedVanityCount: number;
}
