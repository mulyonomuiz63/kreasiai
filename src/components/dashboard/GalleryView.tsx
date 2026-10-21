import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import {
  FolderArchive,
  Video,
  Image as ImageIcon,
  Heart,
  Download,
  Trash2,
  Copy,
  ExternalLink,
  Play,
} from 'lucide-react';

export const GalleryView: React.FC = () => {
  const { assets, toggleFavoriteAsset, deleteAsset, setActiveNav, showToast } = useApp();

  const [filter, setFilter] = useState<'all' | 'video' | 'image' | 'favorite'>('all');
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);

  const filtered = assets.filter((a) => {
    if (filter === 'video') return a.type === 'video';
    if (filter === 'image') return a.type === 'image';
    if (filter === 'favorite') return a.favorite;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <FolderArchive className="w-6 h-6 text-orange-500" />
            <span>Galeri Karya Saya</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Kumpulan seluruh video sinematik dan gambar 8K yang telah berhasil Anda buat.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              filter === 'all' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Semua ({assets.length})
          </button>
          <button
            onClick={() => setFilter('video')}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              filter === 'video' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Video ({assets.filter((a) => a.type === 'video').length})
          </button>
          <button
            onClick={() => setFilter('image')}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              filter === 'image' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Gambar ({assets.filter((a) => a.type === 'image').length})
          </button>
          <button
            onClick={() => setFilter('favorite')}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              filter === 'favorite' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Favorit ({assets.filter((a) => a.favorite).length})
          </button>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center text-slate-500 space-y-3 bg-slate-950 rounded-3xl border border-slate-800">
          <FolderArchive className="w-12 h-12 text-slate-700 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">Belum ada aset dalam kategori ini</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Mulailah membuat video atau gambar AI untuk mengisi galeri cloud Anda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((asset) => (
            <div
              key={asset.id}
              className="group bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div
                onClick={() => setSelectedAsset(asset)}
                className="relative aspect-video bg-black cursor-pointer overflow-hidden"
              >
                <img
                  src={asset.thumbnailUrl}
                  alt={asset.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-sm text-white">
                  {asset.type}
                </span>

                {asset.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-orange-500/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavoriteAsset(asset.id);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:text-rose-500 transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${asset.favorite ? 'text-rose-500 fill-rose-500' : ''}`}
                  />
                </button>
              </div>

              <div className="p-4 space-y-2">
                <div className="text-xs font-bold text-white line-clamp-1">{asset.title}</div>
                <div className="text-[11px] text-slate-400 line-clamp-2">"{asset.prompt}"</div>

                <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500">
                  <span>{asset.modelName}</span>
                  <span className="font-semibold text-orange-400">{asset.resolution}</span>
                </div>

                <div className="pt-2 flex items-center gap-1.5">
                  <a
                    href={asset.mediaUrl}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Unduh</span>
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(asset.prompt);
                      showToast('Prompt disalin!', 'info');
                    }}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="Salin Prompt"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteAsset(asset.id)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Hapus Aset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-4 p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm sm:text-base">{selectedAsset.title}</h3>
              <button
                onClick={() => setSelectedAsset(null)}
                className="text-slate-400 hover:text-white text-xs font-semibold"
              >
                Tutup ✕
              </button>
            </div>

            <div className="aspect-video rounded-2xl bg-black overflow-hidden flex items-center justify-center">
              {selectedAsset.type === 'video' ? (
                <video src={selectedAsset.mediaUrl} controls autoPlay loop className="w-full h-full object-cover" />
              ) : (
                <img src={selectedAsset.mediaUrl} alt={selectedAsset.title} className="w-full h-full object-contain" />
              )}
            </div>

            <div className="p-3 bg-slate-900 rounded-xl text-xs space-y-1 text-slate-300">
              <div className="text-slate-400 font-semibold">Prompt:</div>
              <div>"{selectedAsset.prompt}"</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
