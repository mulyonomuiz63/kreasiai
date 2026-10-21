import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { checkPlanAccess } from '../../utils/pricing';
import {
  Video,
  Sparkles,
  Play,
  Download,
  Copy,
  Layers,
  Clock,
  Lock,
  ArrowRight,
  Upload,
  Sliders,
  CheckCircle2,
  Film,
  Zap,
} from 'lucide-react';

export const VideoGeneratorView: React.FC = () => {
  const {
    currentUser,
    models,
    plans,
    startVideoGeneration,
    jobs,
    assets,
    getUserCreditBalance,
    setCheckoutModalPlan,
    showToast,
  } = useApp();

  const videoModels = models.filter((m) => m.type === 'video');
  const userPlan = currentUser?.currentPlanId || 'starter';

  const [mode, setMode] = useState<'text_to_video' | 'image_to_video'>('text_to_video');
  const [selectedModelId, setSelectedModelId] = useState<string>('kling-basic');
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('blurry, bad anatomy, distorted faces, low resolution, artifacts');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [resolution, setResolution] = useState('720p');
  const [durationSec, setDurationSec] = useState<number>(5);
  const [seed, setSeed] = useState<number>(42);
  const [referenceImageUrl, setReferenceImageUrl] = useState<string>('');
  const [activePreviewUrl, setActivePreviewUrl] = useState<string>(
    'https://assets.mixkit.co/videos/preview/mixkit-coffee-cup-being-filled-with-milk-41481-large.mp4'
  );
  const [activePreviewTitle, setActivePreviewTitle] = useState('Cinematic Coffee Pouring in Morning Light');

  const selectedModel = videoModels.find((m) => m.id === selectedModelId) || videoModels[0];

  // Dynamic available durations based on selected model
  const availableDurations = selectedModel.supportedDurations || [5, 8];

  // Make sure duration is valid when model changes
  const handleModelChange = (id: string) => {
    setSelectedModelId(id);
    const m = videoModels.find((mod) => mod.id === id);
    if (m && m.supportedDurations && !m.supportedDurations.includes(durationSec)) {
      setDurationSec(m.supportedDurations[0]);
    }
    if (m && m.supportedResolutions && !m.supportedResolutions.includes(resolution)) {
      setResolution(m.supportedResolutions[0]);
    }
  };

  // Check plan permission
  const hasAccess = checkPlanAccess(
    (currentUser?.currentPlanId || 'starter') as any,
    selectedModel.minPlan as any
  );

  // Credit calculation
  const durationMultiplier = durationSec > 10 ? 1.4 : durationSec > 5 ? 1.2 : 1.0;
  const estimatedCost = Math.round(selectedModel.creditCost * durationMultiplier);
  const balance = getUserCreditBalance();

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      showToast('Mohon masukkan deskripsi prompt video.', 'error');
      return;
    }
    if (!hasAccess) {
      showToast(
        `Model ${selectedModel.name} membutuhkan minimal ${selectedModel.minPlan.toUpperCase()}. Silakan upgrade paket.`,
        'error'
      );
      return;
    }

    const res = startVideoGeneration({
      modelId: selectedModel.id,
      prompt,
      negativePrompt,
      inputImageUrl: mode === 'image_to_video' ? referenceImageUrl : undefined,
      durationSec,
      aspectRatio,
      resolution,
    });

    if (res.success) {
      // Switch active preview to placeholder until ready
    }
  };

  const samplePrompts = [
    'Drone sweeping over misty volcanic tea plantation at sunrise in Java, cinematic 8k, golden light',
    'Cyberpunk street food vendor in Jakarta raining night with glowing holographic signs, 60fps',
    'Macro slow-motion shot of pouring molten dark chocolate over fresh strawberries, studio lighting',
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Video className="w-6 h-6 text-orange-500" />
            <span>AI Video Generator Studio</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Hasilkan video difusi temporal sinematik dari teks atau gambar referensi dengan GPU cluster.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Saldo Tersedia:</span>
          <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-extrabold text-xs">
            {balance.toLocaleString('id-ID')} Kredit
          </span>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form Panel (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-900 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setMode('text_to_video')}
              className={`py-2.5 rounded-xl transition-all ${
                mode === 'text_to_video'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Text-to-Video
            </button>
            <button
              type="button"
              onClick={() => setMode('image_to_video')}
              className={`py-2.5 rounded-xl transition-all ${
                mode === 'image_to_video'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Image-to-Video
            </button>
          </div>

          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Model Selector Cards */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Pilih Model Video AI:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {videoModels.map((m) => {
                  const mAccess = checkPlanAccess(
                    (currentUser?.currentPlanId || 'starter') as any,
                    m.minPlan as any
                  );
                  const isSelected = selectedModelId === m.id;

                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleModelChange(m.id)}
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
                        <span>Antrean: {m.queuePriority.split(' ')[0]}</span>
                        <span className="uppercase font-semibold text-slate-400">
                          Min. {m.minPlan}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lock Warning if user doesn't have access */}
            {!hasAccess && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Model ini eksklusif untuk paket <strong>{selectedModel.minPlan.toUpperCase()}</strong>.
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

            {/* Image Upload if Image-to-Video mode */}
            {mode === 'image_to_video' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Gambar Referensi Awal:
                </label>
                <div className="p-4 rounded-2xl border-2 border-dashed border-slate-700 hover:border-orange-500 bg-slate-900/40 text-center cursor-pointer transition-colors">
                  <Upload className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                  <div className="text-xs font-bold text-white">Unggah Gambar Awal (PNG/JPG)</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Maksimal 15 MB • Rasio disesuaikan</div>
                </div>
              </div>
            )}

            {/* Prompt Area */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Prompt Video (Teks Deskripsi):
                </label>
                <button
                  type="button"
                  onClick={() => setPrompt(samplePrompts[Math.floor(Math.random() * samplePrompts.length)])}
                  className="text-[11px] text-orange-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Contoh Prompt</span>
                </button>
              </div>
              <textarea
                rows={3}
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Deskripsikan video sinematik yang Anda inginkan secara detail..."
                className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 leading-relaxed"
              />
            </div>

            {/* Negative Prompt */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Negative Prompt (Elemen yang dihindari):
              </label>
              <input
                type="text"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* Dynamic Controls: Durasi, Rasio, Resolusi */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Dynamic Durasi */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-orange-400" />
                  <span>Durasi Video:</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {availableDurations.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDurationSec(d)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                        durationSec === d
                          ? 'border-orange-500 bg-orange-500 text-white'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {d}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Rasio Aspek */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Rasio Aspek:
                </label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  {selectedModel.supportedAspectRatios.map((r) => (
                    <option key={r} value={r}>
                      {r} {r === '16:9' ? '(Landscape TV)' : r === '9:16' ? '(Vertical Reels)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Resolusi */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Resolusi:
                </label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  {selectedModel.supportedResolutions.map((res) => (
                    <option key={res} value={res}>
                      {res}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Estimated Cost & Generate Button */}
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-400" />
                <span>Estimasi Biaya:</span>
                <strong className="text-orange-400 text-sm font-black">
                  {estimatedCost} Kredit
                </strong>
                <span className="text-[11px] text-slate-500">
                  (Sisa setelahnya: {balance - estimatedCost})
                </span>
              </div>

              <button
                type="submit"
                disabled={!hasAccess || balance < estimatedCost}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Video Sekarang</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Preview & Active Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Video Player Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden p-5 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-orange-500" />
                <span>Pemutar Video Preview</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                MP4 HD
              </span>
            </div>

            {/* Player Viewport */}
            <div className="relative aspect-video rounded-2xl bg-black overflow-hidden border border-slate-800 shadow-inner">
              <video
                src={activePreviewUrl}
                controls
                autoPlay
                loop
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <div className="text-sm font-bold text-white">{activePreviewTitle}</div>
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={activePreviewUrl}
                  download="kreasi-ai-studio-video.mp4"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Video MP4</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(prompt || activePreviewTitle);
                    showToast('Prompt disalin ke clipboard!', 'info');
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Prompt</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Generation Queue List */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span>Antrean Render GPU:</span>
              <span className="text-[11px] text-slate-500">
                {jobs.filter((j) => j.type === 'video').length} Pekerjaan
              </span>
            </div>

            {jobs.filter((j) => j.type === 'video').length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">
                Belum ada pekerjaan render yang sedang berlangsung.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto">
                {jobs
                  .filter((j) => j.type === 'video')
                  .map((job) => (
                    <div
                      key={job.id}
                      onClick={() => {
                        if (job.resultUrl) {
                          setActivePreviewUrl(job.resultUrl);
                          setActivePreviewTitle(job.prompt);
                        }
                      }}
                      className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white truncate max-w-[200px]">
                          {job.modelName}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            job.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-orange-500/20 text-orange-400'
                          }`}
                        >
                          {job.status === 'completed' ? 'Selesai' : `${job.progressPercent}%`}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500 transition-all duration-300"
                          style={{ width: `${job.progressPercent}%` }}
                        />
                      </div>

                      <div className="text-[11px] text-slate-400 truncate">
                        "{job.prompt}"
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
