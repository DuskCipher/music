'use client';

import { useState } from 'react';
import { Settings as SettingsIcon, Trash2, Database, Download, AlertCircle, ChevronRight, User } from 'lucide-react';
import { db } from '@/lib/db';
import { ConfirmModal } from '@/components/FeedbackModals';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Settings() {
  const router = useRouter();
  const [clearTarget, setClearTarget] = useState<'history' | 'search' | 'all' | null>(null);

  const handleClear = async () => {
    if (!clearTarget) return;
    try {
      if (clearTarget === 'history' || clearTarget === 'all') {
        // We'd clear history here
        localStorage.removeItem('music-player-storage'); 
      }
      if (clearTarget === 'search' || clearTarget === 'all') {
        // Clear search DB
        await db.clearAllPlaylists(); // Not exactly just search but as an example
      }
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
    setClearTarget(null);
  };

  const handleExport = async () => {
    try {
      const playlists = await db.getPlaylists();
      const liked = await db.getLikedSongs();
      const albums = await db.getSavedAlbums();
      
      const backup = {
        version: 1,
        date: new Date().toISOString(),
        data: { playlists, liked, albums }
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `music-app-backup-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (e) {
      console.error("Export failed", e);
    }
  };

  return (
    <main className="min-h-screen pt-10 px-4 pb-24 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="w-8 h-8 text-white" />
        <h1 className="text-3xl font-bold text-white">Pengaturan</h1>
      </div>

      <div className="space-y-6">
        {/* Profile / Dev Section */}
        <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden border border-white/5 divide-y divide-white/5">
          <div 
            onClick={() => router.push('/developer')}
            className="flex items-center p-4 hover:bg-white/5 cursor-pointer transition-colors"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white/10 mr-4">
              <Image src="/icon.jpg" alt="Developer" width={48} height={48} className="object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium">SANN404 FORUM</h3>
              <p className="text-white/50 text-sm">Developer Aplikasi</p>
            </div>
            <ChevronRight className="w-5 h-5 text-white/30" />
          </div>
          <div 
            onClick={() => router.push('/developer')}
            className="flex items-center p-4 hover:bg-white/5 cursor-pointer transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shrink-0 border-2 border-white/10 mr-4">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium">./B7</h3>
              <p className="text-white/50 text-sm">Co-Developer Aplikasi</p>
            </div>
            <ChevronRight className="w-5 h-5 text-white/30" />
          </div>
        </div>

        {/* Data Management */}
        <div>
          <h2 className="text-white/50 text-sm font-semibold uppercase tracking-wider mb-3 px-4">Manajemen Data</h2>
          <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden border border-white/5 divide-y divide-white/5">
            <button 
              onClick={handleExport}
              className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-blue-400" />
                <span className="text-white">Backup Data Library</span>
              </div>
              <ChevronRight className="w-5 h-5 text-white/30" />
            </button>
            <button 
              onClick={() => setClearTarget('history')}
              className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-red-400" />
                <span className="text-white">Hapus Riwayat Putar</span>
              </div>
            </button>
            <button 
              onClick={() => setClearTarget('all')}
              className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-500 font-medium">Reset Semua Data</span>
              </div>
            </button>
          </div>
        </div>
        
        {/* App Info */}
        <div className="text-center pt-8 pb-4 opacity-50">
          <p className="text-white text-sm font-medium">Music App v1.0.0</p>
          <p className="text-white/70 text-xs mt-1">Dibuat dengan Next.js & TailwindCSS</p>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!clearTarget}
        title={clearTarget === 'all' ? 'Reset Semua Data?' : 'Hapus Riwayat?'}
        message={clearTarget === 'all' ? 'Aksi ini akan menghapus semua riwayat, lagu yang disukai, dan playlist. Data tidak bisa dikembalikan.' : 'Apakah kamu yakin ingin menghapus riwayat putar lagu?'}
        onConfirm={handleClear}
        onCancel={() => setClearTarget(null)}
      />
    </main>
  );
}
