import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { AIAgent } from '../../types';
import {
  Bot,
  Sparkles,
  Clapperboard,
  Megaphone,
  ImagePlus,
  Film,
  Sliders,
  CheckCircle2,
  Clock,
  ArrowRight,
  Zap,
  Play,
  RotateCcw,
} from 'lucide-react';

export const AgentStudioView: React.FC = () => {
  const {
    agents,
    agentExecutions,
    runAgent,
    getUserCreditBalance,
    currentUser,
    setActiveNav,
    showToast,
  } = useApp();

  const [selectedAgentId, setSelectedAgentId] = useState<string>('agent-content-creator');
  const [topicInput, setTopicInput] = useState('Peluncuran brand fashion lokal bernuansa batik modern');
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];
  const balance = getUserCreditBalance();
  const latestExecution = agentExecutions.find((e) => e.agentId === selectedAgent.id);

  const handleExecute = async () => {
    if (!topicInput.trim()) {
      showToast('Mohon masukkan topik atau instruksi kampanye.', 'error');
      return;
    }
    await runAgent(selectedAgent.id, topicInput);
  };

  const getAgentIcon = (name: string) => {
    switch (name) {
      case 'Clapperboard':
        return Clapperboard;
      case 'Megaphone':
        return Megaphone;
      case 'ImagePlus':
        return ImagePlus;
      case 'Film':
        return Film;
      default:
        return Sliders;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Bot className="w-6 h-6 text-orange-500" />
            <span>AI Agent & Workflow Automasi</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Jalankan agen cerdas untuk memproduksi ide, storyboard per scene, naskah video, dan aset visual otomatis.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Saldo:</span>
          <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-extrabold text-xs">
            {balance.toLocaleString('id-ID')} Kredit
          </span>
        </div>
      </div>

      {/* Agents Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {agents.map((ag) => {
          const IconComp = getAgentIcon(ag.iconName);
          const isSelected = selectedAgentId === ag.id;

          return (
            <div
              key={ag.id}
              onClick={() => {
                setSelectedAgentId(ag.id);
                setTopicInput(ag.defaultPrompt);
              }}
              className={`p-5 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-orange-500/10 border-orange-500 ring-2 ring-orange-500/20'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-orange-400 uppercase">
                    {ag.costPerRun} kr
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{ag.name}</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
                  {ag.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <span>{ag.badge}</span>
                <span className="text-orange-400 font-bold uppercase">Pilih →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Execution Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Config Panel (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="text-xs text-orange-400 font-bold uppercase tracking-wider">
                Agent Aktif:
              </div>
              <div className="text-lg font-extrabold text-white">{selectedAgent.name}</div>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300">
              Biaya: {selectedAgent.costPerRun} Kredit
            </span>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Instruksi / Topik Kampanye:
            </label>
            <textarea
              rows={4}
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="Jelaskan produk, tujuan promosi, atau alur yang Anda inginkan..."
              className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 leading-relaxed"
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2 text-slate-400">
            <div className="font-bold text-slate-300">Format Output Terstruktur:</div>
            <div>{selectedAgent.outputFormat}</div>
          </div>

          <button
            onClick={handleExecute}
            disabled={balance < selectedAgent.costPerRun}
            className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Jalankan Workflow Agent ({selectedAgent.costPerRun} Kredit)</span>
          </button>
        </div>

        {/* Right Live Runner / Results (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="font-bold text-sm text-white">Status Eksekusi Workflow:</div>
            {latestExecution && (
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  latestExecution.status === 'completed'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-orange-500/20 text-orange-400 animate-pulse'
                }`}
              >
                {latestExecution.status === 'completed' ? 'Selesai' : 'Sedang Berjalan'}
              </span>
            )}
          </div>

          {/* Stepper Display */}
          {latestExecution ? (
            <div className="space-y-4">
              <div className="space-y-3">
                {latestExecution.steps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                          step.status === 'completed'
                            ? 'bg-emerald-500 text-white'
                            : step.status === 'running'
                            ? 'bg-orange-500 text-white animate-pulse'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {step.status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          step.stepNumber
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-white">{step.title}</div>
                        {step.outputSnippet && (
                          <div className="text-[11px] text-orange-300 font-mono mt-0.5">
                            {step.outputSnippet}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">
                      {step.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Complete Result Output Card */}
              {latestExecution.resultData && (
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-orange-500/30 space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-orange-400 uppercase tracking-wider">
                      Hasil Akhir Workflow:
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(latestExecution.resultData, null, 2));
                        showToast('Seluruh naskah & prompt disalin!', 'info');
                      }}
                      className="text-[11px] text-slate-400 hover:text-white"
                    >
                      Salin Semua
                    </button>
                  </div>

                  <div>
                    <div className="text-slate-400 font-semibold mb-1">Sudut Pandang (Angle):</div>
                    <div className="text-white font-medium">{latestExecution.resultData.angle}</div>
                  </div>

                  <div>
                    <div className="text-slate-400 font-semibold mb-1">Pilihan Hook Viral:</div>
                    <ul className="list-disc list-inside space-y-1 text-slate-200">
                      {latestExecution.resultData.hook?.map((h: string, idx: number) => (
                        <li key={idx}>{h}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-slate-400 font-semibold mb-1">Naskah Video Scene-by-Scene:</div>
                    <pre className="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-300 whitespace-pre-line leading-relaxed">
                      {latestExecution.resultData.script}
                    </pre>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setActiveNav('video');
                        showToast('Prompt video dikirim ke generator!', 'success');
                      }}
                      className="px-3 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>Render Video Naskah Ini</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveNav('image');
                        showToast('Prompt visual dikirim ke image studio!', 'success');
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors flex items-center gap-1.5"
                    >
                      <ImagePlus className="w-3.5 h-3.5 text-orange-400" />
                      <span>Render Visual Keyframe</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-16 text-center text-xs text-slate-500 space-y-2">
              <Bot className="w-10 h-10 text-slate-700 mx-auto" />
              <div>Pilih agent di atas, masukkan topik, dan klik "Jalankan Workflow Agent".</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
