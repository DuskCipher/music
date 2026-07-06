'use client';

import { usePlayerStore, useAuthStore } from '@/lib/store';
import { db } from '@/lib/db';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Share2, Heart, PlusCircle, ListPlus, ListVideo, Disc, 
  User, Users, XCircle, Timer, Radio, FileText, QrCode, Check
} from 'lucide-react';
import Image from 'next/image';
import { getHighResImage } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ListenTogetherModal, ExcludeSongModal, SongCreditsModal, QRCodeModal } from './TrackMenuModals';

export function TrackMenu() {
  const { activeMenuTrack, setActiveMenuTrack, addToQueue, setTrackToAdd, setExpanded } = usePlayerStore();
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();

  // Toast state
  const [toast, setToast] = useState<string | null>(null);

  // Modal states
  const [showListenTogether, setShowListenTogether] = useState(false);
  const [showExclude, setShowExclude] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  const [persistedTrack, setPersistedTrack] = useState<any>(null);

  useEffect(() => {
    if (activeMenuTrack) {
      db.isLiked(activeMenuTrack.videoId).then(setIsLiked);
      setPersistedTrack(activeMenuTrack);
    }
  }, [activeMenuTrack]);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const closeMenu = () => setActiveMenuTrack(null);

  const currentTrack = activeMenuTrack || persistedTrack;

  const artistName = currentTrack 
    ? (Array.isArray(currentTrack.artist) 
      ? currentTrack.artist.map((a: any) => a.name).join(', ') 
      : currentTrack.artist?.name || 'Unknown Artist')
    : 'Unknown Artist';

  const thumbnailUrl = currentTrack ? getHighResImage(currentTrack.thumbnails?.[currentTrack.thumbnails.length - 1]?.url, 200) : '';

  const trackInfo = currentTrack ? {
    name: currentTrack.name,
    artist: artistName,
    videoId: currentTrack.videoId,
    thumbnailUrl,
  } : { name: '', artist: '', videoId: '', thumbnailUrl: '' };

  const showToast = (msg: string) => {
    setToast(msg);
  };

  const handleShare = () => {
    if (!currentTrack) return;
    navigator.clipboard.writeText(`${window.location.origin}/track/${currentTrack.videoId}`);
    showToast('Link lagu berhasil disalin!');
    closeMenu();
  };

  const handleLike = async () => {
    if (!currentTrack) return;
    if (isLiked) {
      await db.removeLikedSong(currentTrack.videoId);
      setIsLiked(false);
    } else {
      await db.addLikedSong(currentTrack);
      setIsLiked(true);
    }
  };

  const handleAddToQueue = () => {
    if (!currentTrack) return;
    addToQueue(currentTrack);
    showToast('Lagu ditambahkan ke antrean');
    closeMenu();
  };

  const handleOpenQueue = () => {
    window.dispatchEvent(new Event('open-queue'));
    closeMenu();
  };

  const handleOpenAlbum = () => {
    if (!currentTrack) return;
    const track = currentTrack as any;
    const albumId = track.album?.albumId || track.album?.id;
    if (albumId) {
      router.push(`/album/${albumId}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(currentTrack.name + ' album')}`);
    }
    setExpanded(false);
    closeMenu();
  };

  const handleOpenArtist = () => {
    if (!currentTrack) return;
    const artistId = Array.isArray(currentTrack.artist) 
      ? currentTrack.artist[0]?.artistId 
      : currentTrack.artist?.artistId;
      
    if (artistId) {
      router.push(`/artist/${artistId}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(artistName)}`);
    }
    setExpanded(false);
    closeMenu();
  };

  const handleListenTogether = () => {
    const isPremium = useAuthStore.getState().user?.isPremium;
    if (!isPremium) {
      showToast('Fitur ini khusus Premium. Anda dialihkan...');
      router.push('/premium');
      closeMenu();
    } else {
      setShowListenTogether(true);
      closeMenu();
    }
  };

  const handleExclude = () => {
    setShowExclude(true);
    closeMenu();
  };

  const handleSleepTimer = () => {
    window.dispatchEvent(new Event('open-sleep-timer'));
    closeMenu();
  };

  const handleRadio = () => {
    if (currentTrack) {
      usePlayerStore.getState().playTrack(currentTrack, undefined, 'similar');
      showToast(`Memulai Radio Lagu: ${currentTrack.name}`);
    }
    closeMenu();
  };

  const handleCredits = () => {
    setShowCredits(true);
    closeMenu();
  };

  const handleQRCode = () => {
    setShowQRCode(true);
    closeMenu();
  };

  const MenuItem = ({ icon: Icon, label, onClick, rightText }: any) => (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between py-4 px-4 hover:bg-white/5 transition-colors text-left"
    >
      <div className="flex items-center gap-4">
        <Icon className="w-6 h-6 text-white/80" strokeWidth={1.5} />
        <span className="text-white font-medium text-[15px]">{label}</span>
      </div>
      {rightText && (
        <span className="text-green-400 font-bold text-xs">{rightText}</span>
      )}
    </button>
  );

  return (
    <>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="fixed top-12 left-4 right-4 z-[1002] max-w-sm mx-auto"
          >
            <div className="bg-[#2A2A2A] border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-3 shadow-2xl">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-white text-sm font-medium flex-1">{toast}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <ListenTogetherModal isOpen={showListenTogether} onClose={() => setShowListenTogether(false)} track={trackInfo} />
      <ExcludeSongModal isOpen={showExclude} onClose={() => setShowExclude(false)} track={trackInfo} />
      <SongCreditsModal isOpen={showCredits} onClose={() => setShowCredits(false)} track={trackInfo} />
      <QRCodeModal isOpen={showQRCode} onClose={() => setShowQRCode(false)} track={trackInfo} />

      {/* Track Menu Bottom Sheet */}
      <AnimatePresence>
        {activeMenuTrack && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-black/60 z-[999] backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-[#1C1C1E] rounded-t-3xl z-[999] overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="flex items-center gap-4 p-4 border-b border-white/10 sticky top-0 bg-[#1C1C1E] z-10">
                <div className="w-14 h-14 relative rounded-md overflow-hidden shrink-0 shadow-md">
                  <Image src={thumbnailUrl} alt={activeMenuTrack.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-lg truncate">{activeMenuTrack.name}</h3>
                  <p className="text-white/60 text-sm truncate">{artistName}</p>
                </div>
                <button onClick={closeMenu} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-6 h-6 text-white/60" />
                </button>
              </div>

              {/* Scrollable Options */}
              <div className="flex-1 overflow-y-auto pb-8">
                <MenuItem icon={Share2} label="Bagikan" onClick={handleShare} />
                <MenuItem 
                  icon={Heart} 
                  label={isLiked ? "Hapus dari Lagu yang Disukai" : "Tambahkan ke Lagu yang Disukai"} 
                  onClick={handleLike} 
                />
                <MenuItem icon={PlusCircle} label="Tambahkan ke playlist" onClick={() => {
                  setTrackToAdd(activeMenuTrack);
                  closeMenu();
                }} />
                <MenuItem icon={ListPlus} label="Tambahkan ke Antrean" onClick={handleAddToQueue} />
                <MenuItem icon={ListVideo} label="Buka Antrean" onClick={handleOpenQueue} />
                <MenuItem icon={Disc} label="Buka album" onClick={handleOpenAlbum} />
                <MenuItem icon={User} label="Buka artis" onClick={handleOpenArtist} />
                <MenuItem icon={Users} label="Mulai Dengar Bareng" rightText="Premium" onClick={handleListenTogether} />
                <MenuItem icon={XCircle} label="Kecualikan lagu dari profil seleramu" onClick={handleExclude} />
                <MenuItem icon={Timer} label="Pengatur waktu tidur" onClick={handleSleepTimer} />
                <MenuItem icon={Radio} label="Buka radio lagu" onClick={handleRadio} />
                <MenuItem icon={FileText} label="Lihat kredit lagu" onClick={handleCredits} />
                <MenuItem icon={QrCode} label="Tampilkan Kode Music Kita semua" onClick={handleQRCode} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
