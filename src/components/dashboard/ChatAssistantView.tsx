import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import {
  MessageSquare,
  Sparkles,
  Send,
  Plus,
  Trash2,
  Copy,
  Video,
  Image as ImageIcon,
  Zap,
  Bot,
} from 'lucide-react';

export const ChatAssistantView: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    createNewChat,
    deleteConversation,
    sendMessage,
    getUserCreditBalance,
    setActiveNav,
    showToast,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const activeConv = conversations.find((c) => c.id === activeConversationId) || conversations[0];
  const balance = getUserCreditBalance();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const text = inputMessage;
    setInputMessage('');
    setIsSending(true);
    await sendMessage(text);
    setIsSending(false);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    showToast('Teks disalin ke clipboard!', 'info');
  };

  return (
    <div className="h-[calc(100vh-8rem)] max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
      {/* Sidebar: Conversations list (w-72) */}
      <div className="w-full md:w-72 bg-slate-950 border border-slate-800 rounded-3xl p-4 flex flex-col shrink-0">
        <button
          onClick={createNewChat}
          className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 mb-4"
        >
          <Plus className="w-4 h-4" />
          <span>Percakapan Baru</span>
        </button>

        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-2 mb-2">
          Riwayat Chat:
        </div>

        <div className="flex-1 space-y-1.5 overflow-y-auto">
          {conversations.map((c) => {
            const isActive = c.id === activeConversationId;
            return (
              <div
                key={c.id}
                onClick={() => setActiveConversationId(c.id)}
                className={`group p-2.5 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{c.title}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(c.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 transition-opacity"
                  title="Hapus"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-orange-400" />
            <span>1 Kredit / chat</span>
          </div>
          <span className="font-bold text-orange-400">{balance} Sisa</span>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-slate-950 border border-slate-800 rounded-3xl flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                {activeConv?.title || 'Percakapan Asisten AI'}
              </div>
              <div className="text-[11px] text-slate-400">
                Model: Gemini 2.5 Flash • Spesialis Kreatif & Prompt Engineer
              </div>
            </div>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {(!activeConv || activeConv.messages.length === 0) && (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Mulai Diskusi Kreatif</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Tanyakan ide naskah video, storyboard per scene, atau minta AI meracik formula prompt visual sinematik.
              </p>
            </div>
          )}

          {activeConv?.messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-white shrink-0 mt-1">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-orange-500 text-white rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none space-y-3'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.content}</div>

                  {!isUser && (
                    <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleCopy(msg.content)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Salin Jawaban</span>
                      </button>

                      {/* Instant Action buttons: Generate Video / Image directly from AI chat */}
                      {msg.suggestedPrompt && (
                        <>
                          <button
                            onClick={() => {
                              setActiveNav('video');
                              showToast('Prompt video dikirimkan ke Video Generator!', 'success');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 text-xs font-bold flex items-center gap-1 transition-colors border border-orange-500/30"
                          >
                            <Video className="w-3 h-3" />
                            <span>Jadikan Prompt Video</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveNav('image');
                              showToast('Prompt gambar dikirimkan ke Image Generator!', 'success');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1 transition-colors border border-amber-500/30"
                          >
                            <ImageIcon className="w-3 h-3" />
                            <span>Jadikan Prompt Gambar</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ketik ide atau minta AI menyusun prompt video sinematik..."
              className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
            />
            <button
              type="submit"
              disabled={isSending || !inputMessage.trim()}
              className="absolute right-2 p-2 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
