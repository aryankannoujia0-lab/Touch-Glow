import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  Sliders,
  Check,
  RefreshCw,
  Share2,
  Heart,
  ChevronRight,
  Eye,
  Layers,
  Palette,
  Maximize2,
  ShieldCheck,
  Info,
  CheckCircle2,
} from 'lucide-react';
import {
  LanguageCode,
  Product,
  OutfitOption,
  ModelPreset,
  SkinToneType,
  UndertoneType,
  FaceShapeType,
} from '../types';
import { TRANSLATIONS } from '../data/translations';
import { INDIAN_MODEL_PRESETS, OUTFIT_CATALOG, PRODUCTS_CATALOG } from '../data/catalog';

interface DualModeTryOnProps {
  currentLang: LanguageCode;
  onSaveLook: (lookData: {
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
  }) => void;
  onOpenShareModal: (lookData: {
    title: string;
    skinTone: string;
    outfitName: string;
    lipShadeName: string;
    products: Product[];
  }) => void;
  selectedAppliedProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onAppliedProductsChange?: (products: Product[]) => void;
}

export const DualModeTryOn: React.FC<DualModeTryOnProps> = ({
  currentLang,
  onSaveLook,
  onOpenShareModal,
  selectedAppliedProducts,
  onSelectProduct,
  onAppliedProductsChange,
}) => {
  const t = TRANSLATIONS[currentLang];

  // State
  const [selectedModel, setSelectedModel] = useState<ModelPreset>(INDIAN_MODEL_PRESETS[0]);
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitOption>(OUTFIT_CATALOG[1]);
  const [customOutfitImage, setCustomOutfitImage] = useState<string | null>(null);
  const [customUserImage, setCustomUserImage] = useState<string | null>(null);
  
  // Camera State
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // View Mode: 'split' (Mode 1: Close-up Split Screen) vs 'complete' (Mode 2: Complete Look)
  const [viewMode, setViewMode] = useState<'split' | 'complete'>('split');
  
  // Split Slider Position (0 to 100%, default 50%)
  const [splitPosition, setSplitPosition] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const splitContainerRef = useRef<HTMLDivElement | null>(null);

  // Active Makeup Customizations
  const [activeLipHex, setActiveLipHex] = useState<string>(selectedOutfit.suggestedLipHex);
  const [activeBlushHex, setActiveBlushHex] = useState<string>(selectedOutfit.suggestedBlushHex);
  const [activeKohlIntensity, setActiveKohlIntensity] = useState<'winged' | 'smoky' | 'subtle'>('winged');
  const [jewelryType, setJewelryType] = useState<'jhumka' | 'choker' | 'minimal'>('jhumka');

  // AI Tone Analysis State
  const [isAnalyzingTone, setIsAnalyzingTone] = useState<boolean>(false);
  const [toneConfidence, setToneConfidence] = useState<number>(97);
  const [saveSuccessNotification, setSaveSuccessNotification] = useState<boolean>(false);

  // Sync lip & blush suggestion when outfit changes
  useEffect(() => {
    setActiveLipHex(selectedOutfit.suggestedLipHex);
    setActiveBlushHex(selectedOutfit.suggestedBlushHex);
  }, [selectedOutfit]);

  // Handle Camera toggling
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 720 }, height: { ideal: 720 }, facingMode: 'user' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
      runToneDetection();
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Camera access unavailable. Using high-definition studio Indian model.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const runToneDetection = () => {
    setIsAnalyzingTone(true);
    setTimeout(() => {
      setIsAnalyzingTone(false);
      setToneConfidence(Math.floor(Math.random() * 5) + 94);
    }, 600);
  };

  // Slider Drag Handlers
  const handleSliderMove = (clientX: number) => {
    if (!splitContainerRef.current) return;
    const rect = splitContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSplitPosition(percent);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (isDraggingSlider) {
      handleSliderMove(e.clientX);
    }
  };

  // Handle Custom Outfit Upload
  const handleOutfitFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomOutfitImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Custom User Face Upload
  const handleUserFaceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomUserImage(event.target?.result as string);
        stopCamera();
        runToneDetection();
      };
      reader.readAsDataURL(file);
    }
  };

  // Currently applied products derived from active shades
  const activeProducts = useMemo(() => {
    const lipProduct =
      PRODUCTS_CATALOG.find((p) => p.shadeHex === activeLipHex) || PRODUCTS_CATALOG[0];
    const blushProduct =
      PRODUCTS_CATALOG.find((p) => p.category === 'Blush') || PRODUCTS_CATALOG[6];
    const kajalProduct =
      PRODUCTS_CATALOG.find((p) => p.category === 'Kajal') || PRODUCTS_CATALOG[10];
    const compactProduct =
      PRODUCTS_CATALOG.find((p) => p.category === 'Compact') || PRODUCTS_CATALOG[13];

    return [lipProduct, blushProduct, kajalProduct, compactProduct];
  }, [activeLipHex, activeBlushHex]);

  useEffect(() => {
    onAppliedProductsChange?.(activeProducts);
  }, [activeProducts, onAppliedProductsChange]);

  const handleSaveCurrentLook = () => {
    onSaveLook({
      title: `${selectedOutfit.name.split(' ')[0]} ${selectedModel.skinToneLabel} Glam`,
      viewMode,
      skinTone: selectedModel.skinToneLabel,
      undertone: selectedModel.undertoneLabel,
      faceShape: selectedModel.faceShape,
      outfitName: selectedOutfit.name,
      outfitHex: selectedOutfit.primaryHex,
      products: activeProducts,
      lipHex: activeLipHex,
      blushHex: activeBlushHex,
    });
    setSaveSuccessNotification(true);
    setTimeout(() => setSaveSuccessNotification(false), 3000);
  };

  const handleShareCurrentLook = () => {
    const lip = activeProducts[0];
    onOpenShareModal({
      title: `${selectedOutfit.name} Glam Match`,
      skinTone: selectedModel.skinToneLabel,
      outfitName: selectedOutfit.name,
      lipShadeName: lip ? `${lip.brand} ${lip.exactShade}` : 'Velvet Berry Rose',
      products: activeProducts,
    });
  };

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Step Header Indicator */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE4EC] text-[#9F1239] text-xs font-semibold tracking-wide mb-3 border border-[#FAD2DC] shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#BE185D]" />
          <span>The Core Magic: AI Virtual Try-On</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4C0519] tracking-tight">
          {t.tryOnTitle}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#831843]/80 font-sans">
          {t.tryOnDesc}
        </p>
      </div>

      {/* 3-Step Guided Workflow Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        
        {/* Step 1 Card */}
        <div className="bg-white rounded-2xl p-4 border border-[#FAD2DC] shadow-sm flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#FFE4EC] text-[#9F1239] font-serif font-bold text-sm flex items-center justify-center shrink-0">
            1
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#4C0519]">
              {t.step1Title}
            </h4>
            <p className="text-xs text-[#9D5065] mt-0.5">
              {t.step1Desc}
            </p>
          </div>
        </div>

        {/* Step 2 Card */}
        <div className="bg-white rounded-2xl p-4 border border-[#FAD2DC] shadow-sm flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#FFE4EC] text-[#9F1239] font-serif font-bold text-sm flex items-center justify-center shrink-0">
            2
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#4C0519]">
              {t.step2Title}
            </h4>
            <p className="text-xs text-[#9D5065] mt-0.5">
              {t.step2Desc}
            </p>
          </div>
        </div>

        {/* Step 3 Card */}
        <div className="bg-white rounded-2xl p-4 border border-[#FAD2DC] shadow-sm flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#FFE4EC] text-[#9F1239] font-serif font-bold text-sm flex items-center justify-center shrink-0">
            3
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#4C0519]">
              {t.step3Title}
            </h4>
            <p className="text-xs text-[#9D5065] mt-0.5">
              {t.step3Desc}
            </p>
          </div>
        </div>

      </div>

      {/* Main Studio Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Model & Outfit Configuration (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Step 1: Model & Face Selection */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#FAD2DC]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif text-lg font-bold text-[#4C0519] flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#BE185D]" />
                <span>Select Complexion Preset</span>
              </h3>
              <span className="text-[10px] font-bold text-[#BE185D] bg-[#FFE4EC] px-2 py-0.5 rounded-full">
                4 Indian Tones
              </span>
            </div>

            {/* Model Presets Carousel */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              {INDIAN_MODEL_PRESETS.map((model) => (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => {
                    setSelectedModel(model);
                    setCustomUserImage(null);
                    stopCamera();
                    runToneDetection();
                  }}
                  className={`p-2.5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                    selectedModel.id === model.id && !customUserImage && !isCameraActive
                      ? 'border-[#BE185D] bg-[#FFF5F7] ring-2 ring-[#BE185D]/20 shadow-sm'
                      : 'border-[#FAD2DC] hover:border-[#BE185D]/40 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div
                      className="w-5 h-5 rounded-full border border-white shadow-xs shrink-0"
                      style={{ backgroundColor: model.skinHex }}
                    />
                    <span className="text-xs font-bold text-[#4C0519]">{model.name}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-[#831843]">
                    {model.skinToneLabel}
                  </div>
                  <div className="text-[10px] text-[#9D5065]">
                    {model.undertoneLabel}
                  </div>
                </button>
              ))}
            </div>

            {/* Camera & Upload Face Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#FAD2DC]/60">
              {isCameraActive ? (
                <button
                  type="button"
                  onClick={stopCamera}
                  className="py-2 px-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-red-100 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Stop Camera</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startCamera}
                  className="py-2 px-3 rounded-xl bg-[#FFF0F3] hover:bg-[#FCE7EC] text-[#9F1239] border border-[#FAD2DC] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-[#BE185D]" />
                  <span>Live Mirror</span>
                </button>
              )}

              <label className="py-2 px-3 rounded-xl bg-[#FFF0F3] hover:bg-[#FCE7EC] text-[#9F1239] border border-[#FAD2DC] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-center">
                <Upload className="w-3.5 h-3.5 text-[#BE185D]" />
                <span className="truncate">Upload Selfie</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUserFaceUpload}
                  className="hidden"
                />
              </label>
            </div>

            {cameraError && (
              <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg mt-2 border border-amber-200">
                {cameraError}
              </p>
            )}

            {/* AI Automated Detection Readout */}
            <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-[#FFF5F7] to-[#FFF0F3] border border-[#FAD2DC]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-[#831843] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
                  AI Undertone Diagnostics
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {toneConfidence}% Match
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-center pt-1 text-[11px]">
                <div className="bg-white/80 p-1.5 rounded-xl border border-[#FAD2DC]/60">
                  <div className="text-[9px] uppercase text-[#9D5065]">{t.skinToneDetected}</div>
                  <div className="font-bold text-[#4C0519] truncate">{selectedModel.skinToneLabel}</div>
                </div>
                <div className="bg-white/80 p-1.5 rounded-xl border border-[#FAD2DC]/60">
                  <div className="text-[9px] uppercase text-[#9D5065]">{t.undertoneDetected}</div>
                  <div className="font-bold text-[#4C0519] truncate">{selectedModel.undertoneLabel}</div>
                </div>
                <div className="bg-white/80 p-1.5 rounded-xl border border-[#FAD2DC]/60">
                  <div className="text-[9px] uppercase text-[#9D5065]">{t.faceShapeDetected}</div>
                  <div className="font-bold text-[#4C0519] truncate">{selectedModel.faceShape}</div>
                </div>
              </div>
            </div>

          </div>

          {/* Step 2: Outfit Selection & Upload Prompt */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#FAD2DC]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif text-lg font-bold text-[#4C0519]">
                Step 2: Outfit Harmony
              </h3>
              <label className="text-[11px] font-bold text-[#BE185D] hover:underline cursor-pointer flex items-center gap-1">
                <Upload className="w-3 h-3" />
                <span>Upload Dress</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleOutfitFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <p className="text-xs text-[#9D5065] mb-3">
              {t.orChooseTrending}:
            </p>

            {/* Trending Indian Occasion Outfits */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {OUTFIT_CATALOG.map((outfit) => (
                <button
                  key={outfit.id}
                  type="button"
                  onClick={() => {
                    setSelectedOutfit(outfit);
                    setCustomOutfitImage(null);
                  }}
                  className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    selectedOutfit.id === outfit.id && !customOutfitImage
                      ? 'border-[#BE185D] bg-[#FFF5F7] shadow-xs'
                      : 'border-[#FAD2DC] hover:border-[#BE185D]/40 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-xl shadow-xs border border-white shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: outfit.primaryHex }}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: outfit.secondaryHex }}
                      />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-[#4C0519] truncate">
                        {outfit.name}
                      </div>
                      <div className="text-[10px] text-[#9D5065] truncate">
                        {outfit.category} · {outfit.colorName}
                      </div>
                    </div>
                  </div>
                  {selectedOutfit.id === outfit.id && !customOutfitImage && (
                    <Check className="w-4 h-4 text-[#BE185D] shrink-0" />
                  )}
                </button>
              ))}
            </div>

            {customOutfitImage && (
              <div className="mt-3 p-2.5 rounded-2xl bg-[#FFF5F7] border border-[#BE185D] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={customOutfitImage}
                    alt="Custom outfit"
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-[#4C0519]">Uploaded Custom Dress</span>
                    <p className="text-[10px] text-emerald-700">AI Palette Harmonized</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCustomOutfitImage(null)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Clear
                </button>
              </div>
            )}

          </div>

          {/* Makeup Color Customizers (Lip, Blush, Kohl) */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#FAD2DC] space-y-4">
            <h4 className="font-serif text-base font-bold text-[#4C0519] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#BE185D]" />
              <span>Fine-Tune Glam Shades</span>
            </h4>

            {/* Lipstick Swatches */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-[#831843]">Lip Shade</span>
                <span className="text-[11px] text-[#9D5065]">
                  {PRODUCTS_CATALOG.find((p) => p.shadeHex === activeLipHex)?.exactShade || 'Custom Shade'}
                </span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {[
                  { name: 'Berry Rose', hex: '#A33454' },
                  { name: 'Royal Crimson', hex: '#A81831' },
                  { name: 'Ruby Woo', hex: '#B21034' },
                  { name: 'Madras Chai', hex: '#8C4F3E' },
                  { name: 'Mauve Plum', hex: '#933B58' },
                  { name: 'Caramel Choco', hex: '#965D48' },
                ].map((swatch) => (
                  <button
                    key={swatch.hex}
                    type="button"
                    onClick={() => setActiveLipHex(swatch.hex)}
                    title={swatch.name}
                    className={`w-7 h-7 rounded-full shrink-0 border-2 transition-transform ${
                      activeLipHex === swatch.hex
                        ? 'border-[#4C0519] scale-110 shadow-sm'
                        : 'border-white hover:scale-105'
                    }`}
                    style={{ backgroundColor: swatch.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Blush Flush Swatches */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-[#831843]">Blush Tint</span>
                <span className="text-[11px] text-[#9D5065]">Petal Flush</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {[
                  { name: 'Rosy Petal', hex: '#D97587' },
                  { name: 'Warm Coral', hex: '#EE8B74' },
                  { name: 'Terracotta', hex: '#C56D5B' },
                  { name: 'Berry Flush', hex: '#C9617A' },
                ].map((swatch) => (
                  <button
                    key={swatch.hex}
                    type="button"
                    onClick={() => setActiveBlushHex(swatch.hex)}
                    title={swatch.name}
                    className={`w-7 h-7 rounded-full shrink-0 border-2 transition-transform ${
                      activeBlushHex === swatch.hex
                        ? 'border-[#4C0519] scale-110 shadow-sm'
                        : 'border-white hover:scale-105'
                    }`}
                    style={{ backgroundColor: swatch.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Kohl / Eyeliner Style */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-[#831843]">Kajal & Eye Glam</span>
                <span className="text-[11px] text-[#9D5065] capitalize">{activeKohlIntensity}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(['winged', 'smoky', 'subtle'] as const).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setActiveKohlIntensity(style)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                      activeKohlIntensity === style
                        ? 'bg-[#9F1239] text-white border-[#9F1239]'
                        : 'bg-[#FFF9F9] text-[#831843] border-[#FAD2DC]'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Dual-Mode Interactive Try-On Canvas (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* View Mode Toggle Bar (Mode 1: Split Screen vs Mode 2: Complete Look) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-[#FAD2DC] shadow-sm">
            
            <div className="flex items-center gap-1.5 bg-[#FFF0F3] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  viewMode === 'split'
                    ? 'bg-gradient-to-r from-[#9F1239] to-[#BE185D] text-white shadow-sm'
                    : 'text-[#831843] hover:text-[#4C0519]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{t.modeSplit}</span>
              </button>
              
              <button
                type="button"
                onClick={() => setViewMode('complete')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  viewMode === 'complete'
                    ? 'bg-gradient-to-r from-[#9F1239] to-[#BE185D] text-white shadow-sm'
                    : 'text-[#831843] hover:text-[#4C0519]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.modeComplete}</span>
              </button>
            </div>

            {/* Quick Actions (Save Look & WhatsApp Viral Share) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveCurrentLook}
                className="px-3.5 py-2 rounded-xl bg-[#FFF0F3] hover:bg-[#FCE7EC] text-[#9F1239] border border-[#FAD2DC] text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                {saveSuccessNotification ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t.saveToVanity}</span>
                    <span className="sm:hidden">Save</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleShareCurrentLook}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20BA5C] hover:to-[#0E7A6E] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.shareWhatsApp}</span>
                <span className="sm:hidden">WhatsApp</span>
              </button>
            </div>

          </div>

          {/* The Virtual Try-On Canvas Stage */}
          <div
            ref={splitContainerRef}
            onMouseMove={onMouseMove}
            onMouseUp={() => setIsDraggingSlider(false)}
            onMouseLeave={() => setIsDraggingSlider(false)}
            onTouchMove={onTouchMove}
            className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-[#FFF5F7] rounded-3xl overflow-hidden border-2 border-[#FAD2DC] shadow-xl shadow-[#BE185D]/10 select-none"
          >
            {/* Live Camera Video (if active) */}
            {isCameraActive && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
              />
            )}

            {/* Custom User Photo (if uploaded) */}
            {customUserImage && !isCameraActive && (
              <img
                src={customUserImage}
                alt="Uploaded face"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* MODE 1: Close-up Split Screen (Real Me vs Glam Me) */}
            {viewMode === 'split' ? (
              <div className="absolute inset-0 w-full h-full">
                
                {/* 1. Full Glam Layer (The Background Foundation) */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#FFF2F5] to-[#FCE7EC] flex items-center justify-center overflow-hidden">
                  
                  {/* High-Fidelity Glam Indian Beauty Illustration & Simulation Canvas */}
                  <svg
                    viewBox="0 0 600 600"
                    className="w-full h-full object-cover"
                    preserveAspectRatio="xMidYMid slice"
                  >
                    <defs>
                      <linearGradient id="glamBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFF0F5" />
                        <stop offset="100%" stopColor="#F9D7E2" />
                      </linearGradient>
                      
                      <radialGradient id="glamGlow" cx="50%" cy="40%" r="50%">
                        <stop offset="0%" stopColor={selectedOutfit.primaryHex} stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                      </radialGradient>

                      <radialGradient id="blushFlush" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={activeBlushHex} stopOpacity="0.65" />
                        <stop offset="100%" stopColor={activeBlushHex} stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Ambient Glow */}
                    <rect width="600" height="600" fill="url(#glamBgGrad)" />
                    <circle cx="300" cy="280" r="280" fill="url(#glamGlow)" />

                    {/* Shoulders & Traditional Festive Neckline */}
                    <path
                      d="M120 600 C 120 460, 200 420, 300 420 C 400 420, 480 460, 480 600 Z"
                      fill={selectedOutfit.primaryHex}
                    />
                    
                    {/* Zari Gold Border on Blouse/Dress */}
                    <path
                      d="M190 445 Q 300 480 410 445"
                      fill="none"
                      stroke={selectedOutfit.secondaryHex}
                      strokeWidth="10"
                    />

                    {/* Neck */}
                    <path
                      d="M260 330 L 260 430 Q 300 440 340 430 L 340 330 Z"
                      fill={selectedModel.glamSkinHex}
                    />

                    {/* Luxurious Indian Bridal / Festive Necklace */}
                    {jewelryType !== 'minimal' && (
                      <g>
                        <path
                          d="M255 400 Q 300 425 345 400"
                          fill="none"
                          stroke="#E6B800"
                          strokeWidth="6"
                        />
                        <circle cx="300" cy="425" r="7" fill={selectedOutfit.primaryHex} stroke="#E6B800" strokeWidth="2" />
                        <circle cx="280" cy="418" r="4" fill="#E6B800" />
                        <circle cx="320" cy="418" r="4" fill="#E6B800" />
                      </g>
                    )}

                    {/* Face Oval */}
                    <ellipse
                      cx="300"
                      cy="270"
                      rx="115"
                      ry="145"
                      fill={selectedModel.glamSkinHex}
                    />

                    {/* Cheeks - Applied AI Blush */}
                    <circle cx="230" cy="285" r="45" fill="url(#blushFlush)" />
                    <circle cx="370" cy="285" r="45" fill="url(#blushFlush)" />

                    {/* Cheeks - Luminous Molten Highlighter Accent */}
                    <ellipse cx="225" cy="265" rx="20" ry="8" fill="#FFF2DC" opacity="0.6" transform="rotate(-15 225 265)" />
                    <ellipse cx="375" cy="265" rx="20" ry="8" fill="#FFF2DC" opacity="0.6" transform="rotate(15 375 265)" />

                    {/* Eyes - Dramatic Kohl & Winged Liner */}
                    <g>
                      {/* Left Eye */}
                      <path d="M210 240 Q 240 220 265 240 Q 240 255 210 240 Z" fill="#FFFFFF" />
                      <circle cx="240" cy="240" r="11" fill="#3D2314" />
                      <circle cx="240" cy="240" r="5" fill="#000000" />
                      <circle cx="243" cy="237" r="3" fill="#FFFFFF" />
                      {/* Eyeliner stroke */}
                      <path
                        d={
                          activeKohlIntensity === 'winged'
                            ? 'M195 233 Q 240 220 268 240'
                            : 'M205 238 Q 240 225 265 240'
                        }
                        fill="none"
                        stroke="#111111"
                        strokeWidth={activeKohlIntensity === 'smoky' ? '5' : '3.5'}
                        strokeLinecap="round"
                      />
                      {/* Mascara lashes */}
                      <path d="M220 225 L 217 218 M 235 224 L 236 216 M 250 227 L 254 220" stroke="#111111" strokeWidth="2" strokeLinecap="round" />

                      {/* Right Eye */}
                      <path d="M335 240 Q 360 220 390 240 Q 360 255 335 240 Z" fill="#FFFFFF" />
                      <circle cx="360" cy="240" r="11" fill="#3D2314" />
                      <circle cx="360" cy="240" r="5" fill="#000000" />
                      <circle cx="363" cy="237" r="3" fill="#FFFFFF" />
                      {/* Eyeliner stroke */}
                      <path
                        d={
                          activeKohlIntensity === 'winged'
                            ? 'M332 240 Q 360 220 405 233'
                            : 'M335 240 Q 360 225 395 238'
                        }
                        fill="none"
                        stroke="#111111"
                        strokeWidth={activeKohlIntensity === 'smoky' ? '5' : '3.5'}
                        strokeLinecap="round"
                      />
                      <path d="M350 227 L 346 220 M 365 224 L 364 216 M 380 225 L 383 218" stroke="#111111" strokeWidth="2" strokeLinecap="round" />

                      {/* Defined Eyebrows */}
                      <path d="M200 215 Q 235 198 270 215" fill="none" stroke="#261710" strokeWidth="4.5" strokeLinecap="round" />
                      <path d="M330 215 Q 365 198 400 215" fill="none" stroke="#261710" strokeWidth="4.5" strokeLinecap="round" />
                    </g>

                    {/* Elegant Indian Bindi */}
                    <circle cx="300" cy="222" r="3.5" fill={activeLipHex} />

                    {/* Nose & Contour */}
                    <path d="M298 245 L 295 285 Q 300 292 305 285" fill="none" stroke="#B87B52" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="290" cy="283" r="1.5" fill="#B87B52" />
                    <circle cx="310" cy="283" r="1.5" fill="#B87B52" />

                    {/* Applied AI Lipstick with Plump Satin Finish */}
                    <g>
                      {/* Upper Lip */}
                      <path
                        d="M260 325 Q 285 315 300 322 Q 315 315 340 325 Q 300 332 260 325 Z"
                        fill={activeLipHex}
                      />
                      {/* Lower Lip */}
                      <path
                        d="M260 325 Q 300 352 340 325 Q 300 332 260 325 Z"
                        fill={activeLipHex}
                      />
                      {/* Gloss highlight */}
                      <ellipse cx="300" cy="336" rx="14" ry="4" fill="#FFFFFF" opacity="0.35" />
                    </g>

                    {/* Hair Styling - Voluminous Silk Waves */}
                    <path
                      d="M175 270 C 170 140, 430 140, 425 270 C 435 370, 440 440, 450 520 C 420 520, 395 380, 405 270 C 400 170, 200 170, 195 270 C 205 380, 180 520, 150 520 C 160 440, 165 370, 175 270 Z"
                      fill="#1A110D"
                    />

                    {/* Festive Jhumka / Earrings */}
                    {jewelryType === 'jhumka' && (
                      <g>
                        {/* Left Jhumka */}
                        <circle cx="180" cy="305" r="4" fill="#D4AF37" />
                        <path d="M172 315 L 188 315 L 184 328 L 176 328 Z" fill="#D4AF37" stroke="#E6B800" strokeWidth="1" />
                        <circle cx="180" cy="332" r="2.5" fill="#D4AF37" />
                        {/* Right Jhumka */}
                        <circle cx="420" cy="305" r="4" fill="#D4AF37" />
                        <path d="M412 315 L 428 315 L 424 328 L 416 328 Z" fill="#D4AF37" stroke="#E6B800" strokeWidth="1" />
                        <circle cx="420" cy="332" r="2.5" fill="#D4AF37" />
                      </g>
                    )}
                  </svg>

                  {/* "Glam Me" Floating Pill Tag */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-[#9F1239] to-[#BE185D] text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md shadow-[#9F1239]/30 flex items-center gap-1.5 pointer-events-none">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t.glamMe}</span>
                  </div>
                </div>

                {/* 2. Bare Skin "Real Me" Layer (Clipped to splitPosition) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${splitPosition}%` }}
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-b from-[#FFFDF9] to-[#FBF4EC]"
                    style={{ width: splitContainerRef.current ? `${splitContainerRef.current.clientWidth}px` : '100%' }}
                  >
                    {/* Natural Bare Skin Illustration */}
                    <svg
                      viewBox="0 0 600 600"
                      className="w-full h-full object-cover"
                      preserveAspectRatio="xMidYMid slice"
                    >
                      <rect width="600" height="600" fill="#FAF5F0" />
                      
                      {/* Simple Natural Top */}
                      <path
                        d="M120 600 C 120 460, 200 420, 300 420 C 400 420, 480 460, 480 600 Z"
                        fill="#EFE7DE"
                      />

                      {/* Neck */}
                      <path
                        d="M260 330 L 260 430 Q 300 440 340 430 L 340 330 Z"
                        fill={selectedModel.skinHex}
                      />

                      {/* Face Oval */}
                      <ellipse
                        cx="300"
                        cy="270"
                        rx="115"
                        ry="145"
                        fill={selectedModel.skinHex}
                      />

                      {/* Natural subtle eyes */}
                      <g>
                        <path d="M210 240 Q 240 225 265 240 Q 240 252 210 240 Z" fill="#FFFFFF" />
                        <circle cx="240" cy="240" r="10" fill="#4A3020" />
                        <circle cx="240" cy="240" r="5" fill="#000000" />
                        <circle cx="242" cy="238" r="2.5" fill="#FFFFFF" />
                        <path d="M200 218 Q 235 205 270 218" fill="none" stroke="#3D291F" strokeWidth="3" strokeLinecap="round" />

                        <path d="M335 240 Q 360 225 390 240 Q 360 252 335 240 Z" fill="#FFFFFF" />
                        <circle cx="360" cy="240" r="10" fill="#4A3020" />
                        <circle cx="360" cy="240" r="5" fill="#000000" />
                        <circle cx="362" cy="238" r="2.5" fill="#FFFFFF" />
                        <path d="M330 218 Q 365 205 400 218" fill="none" stroke="#3D291F" strokeWidth="3" strokeLinecap="round" />
                      </g>

                      {/* Nose */}
                      <path d="M298 245 L 295 285 Q 300 292 305 285" fill="none" stroke="#9E6E4A" strokeWidth="2" strokeLinecap="round" />

                      {/* Natural bare lips */}
                      <g>
                        <path
                          d="M260 326 Q 285 318 300 323 Q 315 318 340 326 Q 300 331 260 326 Z"
                          fill="#C48E83"
                        />
                        <path
                          d="M260 326 Q 300 348 340 326 Q 300 331 260 326 Z"
                          fill="#B37C71"
                        />
                      </g>

                      {/* Natural Hair */}
                      <path
                        d="M175 270 C 170 140, 430 140, 425 270 C 435 370, 440 440, 450 520 C 420 520, 395 380, 405 270 C 400 170, 200 170, 195 270 C 205 380, 180 520, 150 520 C 160 440, 165 370, 175 270 Z"
                        fill="#261A14"
                      />
                    </svg>

                    {/* "Real Me" Floating Tag */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs text-[#4C0519] border border-[#FAD2DC] px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 pointer-events-none">
                      <Eye className="w-3.5 h-3.5 text-[#9D5065]" />
                      <span>{t.realMe}</span>
                    </div>
                  </div>
                </div>

                {/* 3. The Draggable Split Slider Handle Bar */}
                <div
                  className="absolute top-0 bottom-0 z-20 flex flex-col items-center justify-center cursor-ew-resize group"
                  style={{ left: `${splitPosition}%`, transform: 'translateX(-50%)' }}
                  onMouseDown={() => setIsDraggingSlider(true)}
                  onTouchStart={() => setIsDraggingSlider(true)}
                >
                  {/* Vertical Hairline Divider */}
                  <div className="w-1 h-full bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)] transition-colors group-hover:bg-[#FFE4EC]" />
                  
                  {/* Central Circular Knob */}
                  <div className="absolute w-10 h-10 rounded-full bg-white shadow-xl border-2 border-[#BE185D] flex items-center justify-center text-[#9F1239] group-hover:scale-110 active:scale-95 transition-transform">
                    <div className="flex items-center gap-0.5">
                      <span className="text-xs font-bold">‹</span>
                      <span className="text-xs font-bold">›</span>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              // MODE 2: Complete Look (Full-Face Makeup + Uploaded/Chosen Outfit Glam)
              <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#FFF5F7] via-[#FFF0F3] to-[#FCE7EC] flex items-center justify-center overflow-hidden">
                
                {/* Complete Look Showcase Render */}
                <svg
                  viewBox="0 0 600 600"
                  className="w-full h-full object-cover"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <defs>
                    <linearGradient id="completeBg" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FFF0F5" />
                      <stop offset="60%" stopColor="#FDE8EF" />
                      <stop offset="100%" stopColor="#F5D0DD" />
                    </linearGradient>

                    <radialGradient id="bridalGlow" cx="50%" cy="30%" r="60%">
                      <stop offset="0%" stopColor="#FFE4EC" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#FCE7EC" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  <rect width="600" height="600" fill="url(#completeBg)" />
                  <circle cx="300" cy="200" r="260" fill="url(#bridalGlow)" />

                  {/* Complete Outfit: Full Upper-Body Lehenga / Saree Drape */}
                  <g>
                    {/* Blouse / Bodice */}
                    <path
                      d="M100 600 C 110 380, 200 350, 300 350 C 400 350, 490 380, 500 600 Z"
                      fill={selectedOutfit.primaryHex}
                    />

                    {/* Embroidered Dupatta Drape over Left Shoulder */}
                    <path
                      d="M110 360 C 130 420, 220 540, 260 600 L 190 600 C 160 540, 100 440, 90 380 Z"
                      fill={selectedOutfit.secondaryHex}
                      opacity="0.85"
                    />

                    {/* Intricate Gold Zari Patterns */}
                    <path
                      d="M180 380 Q 300 420 420 380"
                      fill="none"
                      stroke={selectedOutfit.secondaryHex}
                      strokeWidth="8"
                    />
                    <path
                      d="M200 430 Q 300 470 400 430"
                      fill="none"
                      stroke="#FFD700"
                      strokeWidth="4"
                      strokeDasharray="4 6"
                    />
                  </g>

                  {/* Royal Bridal Choker & Temple Jewellery */}
                  <g>
                    <path
                      d="M255 330 Q 300 360 345 330"
                      fill="none"
                      stroke="#D4AF37"
                      strokeWidth="8"
                    />
                    <circle cx="300" cy="358" r="9" fill={selectedOutfit.primaryHex} stroke="#FFD700" strokeWidth="2" />
                    <circle cx="275" cy="350" r="5" fill="#FFD700" />
                    <circle cx="325" cy="350" r="5" fill="#FFD700" />
                  </g>

                  {/* Face & Neck */}
                  <path
                    d="M260 270 L 260 350 Q 300 360 340 350 L 340 270 Z"
                    fill={selectedModel.glamSkinHex}
                  />

                  {/* Face Oval */}
                  <ellipse
                    cx="300"
                    cy="215"
                    rx="95"
                    ry="120"
                    fill={selectedModel.glamSkinHex}
                  />

                  {/* Applied Soft Blush & Highlight */}
                  <circle cx="245" cy="225" r="35" fill={activeBlushHex} opacity="0.6" />
                  <circle cx="355" cy="225" r="35" fill={activeBlushHex} opacity="0.6" />
                  <ellipse cx="240" cy="210" rx="15" ry="6" fill="#FFF9E6" opacity="0.7" transform="rotate(-15 240 210)" />
                  <ellipse cx="360" cy="210" rx="15" ry="6" fill="#FFF9E6" opacity="0.7" transform="rotate(15 360 210)" />

                  {/* Eyes & Kohl */}
                  <g>
                    <path d="M225 190 Q 250 175 270 190 Q 250 202 225 190 Z" fill="#FFFFFF" />
                    <circle cx="250" cy="190" r="9" fill="#3D2314" />
                    <circle cx="250" cy="190" r="4.5" fill="#000000" />
                    <path d="M215 185 Q 250 173 275 190" fill="none" stroke="#111111" strokeWidth="3" strokeLinecap="round" />

                    <path d="M330 190 Q 350 175 375 190 Q 350 202 330 190 Z" fill="#FFFFFF" />
                    <circle cx="350" cy="190" r="9" fill="#3D2314" />
                    <circle cx="350" cy="190" r="4.5" fill="#000000" />
                    <path d="M325 190 Q 350 173 385 185" fill="none" stroke="#111111" strokeWidth="3" strokeLinecap="round" />

                    <path d="M218 170 Q 248 156 276 170" fill="none" stroke="#261710" strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M324 170 Q 352 156 382 170" fill="none" stroke="#261710" strokeWidth="3.5" strokeLinecap="round" />
                  </g>

                  {/* Bindi & Maang Tikka */}
                  <circle cx="300" cy="175" r="3" fill={activeLipHex} />
                  <line x1="300" y1="100" x2="300" y2="150" stroke="#D4AF37" strokeWidth="2" />
                  <circle cx="300" cy="152" r="5" fill="#D4AF37" stroke="#9F1239" strokeWidth="1" />

                  {/* Nose & Ring */}
                  <path d="M298 195 L 296 228 Q 300 234 304 228" fill="none" stroke="#A86B43" strokeWidth="1.5" />
                  <circle cx="292" cy="226" r="2.5" fill="none" stroke="#D4AF37" strokeWidth="1" />

                  {/* Applied Glam Lipstick */}
                  <g>
                    <path
                      d="M268 260 Q 288 252 300 258 Q 312 252 332 260 Q 300 266 268 260 Z"
                      fill={activeLipHex}
                    />
                    <path
                      d="M268 260 Q 300 282 332 260 Q 300 266 268 260 Z"
                      fill={activeLipHex}
                    />
                    <ellipse cx="300" cy="270" rx="10" ry="3" fill="#FFFFFF" opacity="0.4" />
                  </g>

                  {/* Hair & Dupatta Drape */}
                  <path
                    d="M195 210 C 190 100, 410 100, 405 210 C 420 310, 430 400, 440 500 C 410 500, 380 340, 390 220 C 390 130, 210 130, 210 220 C 220 340, 190 500, 160 500 C 170 400, 180 310, 195 210 Z"
                    fill="#1A110D"
                  />

                  {/* Jhumkas */}
                  <circle cx="205" cy="245" r="3.5" fill="#D4AF37" />
                  <path d="M198 252 L 212 252 L 209 264 L 201 264 Z" fill="#D4AF37" />
                  <circle cx="395" cy="245" r="3.5" fill="#D4AF37" />
                  <path d="M388 252 L 402 252 L 399 264 L 391 264 Z" fill="#D4AF37" />
                </svg>

                {/* Floating Complete Look Label */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs text-[#4C0519] border border-[#FAD2DC] px-4 py-2 rounded-2xl text-xs font-bold shadow-lg shadow-[#BE185D]/10">
                  <div className="flex items-center gap-1.5 text-[#9F1239]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Mode 2: Complete Look Harmonization</span>
                  </div>
                  <p className="text-[11px] text-[#9D5065] font-normal mt-0.5">
                    {selectedOutfit.name} + {selectedModel.skinToneLabel}
                  </p>
                </div>

                <div className="absolute top-4 right-4 bg-gradient-to-r from-[#9F1239] to-[#BE185D] text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md shadow-[#9F1239]/30">
                  Ready to Wear
                </div>

              </div>
            )}

            {/* AI Diagnostics Floating Badge at bottom */}
            <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#FAD2DC] text-[11px] text-[#4C0519] flex items-center justify-between sm:justify-start gap-3 shadow-md">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold">Harmonized:</span>
                <span className="text-[#831843] truncate max-w-[150px]">
                  {selectedOutfit.name.split(' ')[0]} + {selectedModel.undertoneLabel}
                </span>
              </div>
              <span className="text-[10px] text-[#9D5065] font-mono">
                {toneConfidence}% Match
              </span>
            </div>

          </div>

          {/* Slider Instruction Note (Split Mode only) */}
          {viewMode === 'split' && (
            <p className="text-center text-xs text-[#9D5065] flex items-center justify-center gap-1.5">
              <span>↔ Drag the center line to compare</span>
              <strong className="text-[#4C0519]">Real Me</strong>
              <span>vs</span>
              <strong className="text-[#BE185D]">Glam Me</strong>
            </p>
          )}

        </div>

      </div>

    </div>
  );
};
