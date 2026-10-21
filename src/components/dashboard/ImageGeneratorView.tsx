import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { checkPlanAccess } from '../../utils/pricing';
import {
  Image as ImageIcon,
  Sparkles,
  Download,
  Copy,
  Video,
  Lock,
  Zap,
  ArrowRight,
  Maximize2,
  RefreshCw,
} from 'lucide-react';

export const ImageGeneratorView: React.FC = () => {
  const {
    currentUser,
    models,
    plans,
    startImageGeneration,
    assets,
    getUserCreditBalance,
    setActiveNav,
    setCheckoutModalPlan,
    showToast,
  } = useApp();

  const imageModels = models.filter((m) => m.type === 'image');
  const [selectedModelId, setSelectedModelId] = useState<string>('flux-schnell');
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('blurry, deformed, oversaturated, watermark, bad anatomy');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [resolution, setResolution] = useState('1024x1024');
  const [selectedPreviewImg, setSelectedPreviewImg] = useState<string>(
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80'
  );

  const selectedModel = imageModels.find((m) => m.id === selectedModelId) || imageModels[0];
  const balance = getUserCreditBalance();

  const hasAccess = checkPlanAccess(
    (currentUser?.currentPlanId || 'starter') as any,
    selectedModel.minPlan as any
  );

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      showToast('Mohon masukkan deskripsi gambar.', 'error');
      return;
    }
    if (!hasAccess) {
      showToast(`Model ini membutuhkan minimal paket ${selectedModel.minPlan.toUpperCase()}`, 'error');
      return;
    }

    const res = startImageGeneration({
      modelId: selectedModel.id,
      prompt,
      negativePrompt,
      aspectRatio,
      resolution,
    });

    if (res.success) {
      // Handled in store
    }
  };

  const samplePrompts = [
    'Traditional Indonesian Wayang Kulit shadow puppet glowing with neon holographic fibers, 8k photorealism, volumetric fog',
    'Modern glass villa perched on Bali cliffs at sunset with infinity pool reflecting warm orange clouds, architectural digest photo',
    'Futuristic electric sports car cruising through Jakarta SCBD financial district at twilight, hyperrealistic reflections',
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-orange-500" />
            <span>AI Image Generator Studio</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Hasilkan karya visual fotorealistik hingga 2048px dengan Flux.1, SDXL, dan Midjourney v6 Style.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Saldo Kredit:</span>
          <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-extrabold text-xs">
            {balance.toLocaleString('id-ID')} Kredit
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6">
          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Model Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Pilih Model Gambar AI:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {imageModels.map((m) => {
                  const mAccess = checkPlanAccess(
                    (currentUser?.currentPlanId || 'starter') as any,
                    m.minPlan as any
                  );
                  const isSelected = selectedModelId === m.id;

                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedModelId(m.id)}
                      className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-orange-500/10 ring-1 ring-orange-500/30'
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-bold text-xs text-white flex items-center gap-1.5">
                          <span>{m.name}</span>
                          {!mAccess && <Lock className="w-3.5 h-3.5 text-amber-500" />}
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-orange-400 shrink-0">
                          {m.creditCost} kr
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                        {m.description}
                      </div>
                      <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/80 pt-2">
                        <span>Render: Instant</span>
                        <span className="uppercase font-semibold text-slate-400">
                          Min. {m.minPlan}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lock notification if higher plan needed */}
            {!hasAccess && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Model ini memerlukan paket <strong>{selectedModel.minPlan.toUpperCase()}</strong>.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCheckoutModalPlan(plans.find((p) => p.id === selectedModel.minPlan) || plans[1])}
                  className="px-3 py-1.5 rounded-xl bg-orange-500 text-white font-bold text-xs hover:bg-orange-600 shrink-0"
                >
                  Upgrade Sekarang
                </button>
              </div>
            )}

            {/* Prompt input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Prompt Gambar (Deskripsi Visual):
                </label>
                <button
                  type="button"
                  onClick={() => setPrompt(samplePrompts[Math.floor(Math.random() * samplePrompts.length)])}
                  className="text-[11px] text-orange-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Inspirasi Prompt</span>
                </button>
              </div>
              <textarea
                rows={3}
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Jelaskan objek, pencahayaan, gaya visual, dan suasana gambar secara detail..."
                className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 leading-relaxed"
              />
            </div>

            {/* Negative Prompt */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Negative Prompt:
              </label>
              <input
                type="text"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* Aspect Ratio & Resolution */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Rasio Aspek:
                </label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  {selectedModel.supportedAspectRatios.map((r) => (
                    <option key={r} value={r}>
                      {r} {r === '1:1' ? '(Square Feed)' : r === '16:9' ? '(Landscape)' : r === '9:16' ? '(Story)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Ukuran Resolusi:
                </label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  {selectedModel.supportedResolutions.map((res) => (
                    <option key={res} value={res}>
                      {res} HD
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-400" />
                <span>Biaya Generasi:</span>
                <strong className="text-orange-400 text-sm font-black">
                  {selectedModel.creditCost} Kredit
                </strong>
              </div>

              <button
                type="submit"
                disabled={!hasAccess || balance < selectedModel.creditCost}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Gambar</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Preview Showcase (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span>Preview Gambar Hasil</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-400">
                8K Photoreal
              </span>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 aspect-square group">
              <img
                src={selectedPreviewImg}
                alt="AI Generated"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Quick Actions for Generated Image */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={selectedPreviewImg}
                download="kreasi-ai-studio-image.jpg"
                target="_blank"
                rel="noreferrer"
                className="py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh PNG</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setActiveNav('video');
                  showToast('Mode Image-to-Video diaktifkan dengan gambar ini!', 'success');
                }}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Video className="w-3.5 h-3.5 text-orange-400" />
                <span>Jadikan Video</span>
              </button>
            </div>
          </div>

          {/* Gallery Thumbnails to click and switch preview */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-3">
            <div className="text-xs font-bold text-slate-300">
              Pilihan dari Galeri Gambar:
            </div>
            <div className="grid grid-cols-3 gap-2">
              {assets
                .filter((a) => a.type === 'image')
                .map((a) => (
                  <div
                    key={a.id}
                    onClick={() => {
                      setSelectedPreviewImg(a.mediaUrl);
                      setPrompt(a.prompt);
                    }}
                    className="relative aspect-square rounded-xl overflow-hidden cursor-pointer border border-slate-800 hover:border-orange-500 transition-colors"
                  >
                    <img src={a.thumbnailUrl} alt={a.title} className="w-full h-full object-cover" />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
