'use client';

import Image from 'next/image';
import { usePlayerStore } from '@/lib/store';
import { getHighResImage } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { db } from '@/lib/db';
import { BadgeCheck, PanelRightClose, MoreHorizontal } from 'lucide-react';
import { QueueList } from '../QueueList';

export function RightSidebar() {
  const { currentTrack, toggleRightSidebar, rightSidebarMode } = usePlayerStore();

  const [artistDetails, setArtistDetails] = useState<any>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const artistName = currentTrack ? (Array.isArray(currentTrack.artist) ? currentTrack.artist.map(a => a.name).join(', ') : currentTrack.artist?.name || 'Unknown Artist') : '';
  const artistId = currentTrack ? (Array.isArray(currentTrack.artist) ? currentTrack.artist[0]?.artistId : currentTrack.artist?.artistId) : undefined;

  useEffect(() => {
    const fetchArtist = async () => {
      if (!artistId) return;
      try {
        const res = await fetch(`/api/artist?id=${artistId}`);
        if (res.ok) {
          const data = await res.json();
          setArtistDetails(data);
          const subscribed = await db.isSubscribed(artistId);
          setIsSubscribed(subscribed);
        }
      } catch (err) {
        console.error('Failed to fetch artist details for sidebar:', err);
      }
    };
    
    setArtistDetails(null);
    fetchArtist();
  }, [artistId]);

  const handleSubscribe = async () => {
    if (!artistDetails || !artistId) return;
    
    if (isSubscribed) {
      await db.removeSubscribedArtist(artistId);
      setIsSubscribed(false);
    } else {
      await db.addSubscribedArtist({
        artistId: artistId,
        name: artistDetails.name,
        thumbnails: artistDetails.thumbnails || [],
        subscribedAt: Date.now()
      });
      setIsSubscribed(true);
    }
  };

  if (!currentTrack) {
    return (
      <div className="w-full h-full bg-zinc-900 rounded-lg flex items-center justify-center p-4">
        <p className="text-zinc-500 text-center">Putar lagu untuk melihat detailnya di sini</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-zinc-900 rounded-lg flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/90 backdrop-blur-md z-10">
        <h2 className="font-bold text-base truncate pr-4 text-white hover:underline cursor-pointer">
          {currentTrack.name}
        </h2>
        <div className="flex items-center gap-3 text-zinc-400">
          <button className="hover:text-white transition">
            <MoreHorizontal className="w-5 h-5" />
          </button>
          <button 
            onClick={toggleRightSidebar}
            className="hover:text-white transition bg-zinc-800 p-1.5 rounded-full hover:bg-zinc-700 hover:scale-105"
            title="Tutup sidebar"
          >
            <PanelRightClose className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {rightSidebarMode === 'queue' ? (
          <div className="p-4 pt-0">
            <h2 className="text-xl font-bold text-white mb-4">Antrean</h2>
            <QueueList />
          </div>
        ) : (
          <div className="p-4 pt-0 flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-2xl mb-4 group">
              <Image 
                src={getHighResImage(currentTrack.thumbnails?.[currentTrack.thumbnails.length - 1]?.url)} 
                alt={currentTrack.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Title and Artist */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-white leading-tight mb-1 hover:underline cursor-pointer line-clamp-2">
                  {currentTrack.name}
                </h1>
                <p className="text-zinc-400 text-base hover:underline cursor-pointer truncate">
                  {artistName}
                </p>
              </div>
            </div>

            {/* About the artist card */}
            {artistDetails && (
              <div className="bg-zinc-800/50 rounded-xl overflow-hidden mb-4">
                {/* Artist Cover Image */}
                <div className="relative w-full h-48 cursor-pointer group">
                  <Image 
                    src={getHighResImage(artistDetails.thumbnails?.[artistDetails.thumbnails.length - 1]?.url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(artistName)}&background=random`}
                    alt={artistName}
                    fill
                    className="object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
                </div>

                {/* Artist Info Content */}
                <div className="p-4 -mt-16 relative z-10">
                  <div className="flex items-center gap-1 text-white font-bold text-lg mb-1">
                    {artistDetails.name}
                    <BadgeCheck className="w-5 h-5 text-blue-400 fill-white" />
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-zinc-400 text-sm">
                      {artistDetails.subscribers || "Mendengarkan"}
                    </p>
                    <button 
                      onClick={handleSubscribe}
                      className={`px-4 py-1.5 rounded-full border text-sm font-medium transition ${
                        isSubscribed 
                          ? 'bg-transparent text-white border-white/50 hover:border-white' 
                          : 'bg-white text-black border-white hover:bg-zinc-200 hover:scale-105'
                      }`}
                    >
                      {isSubscribed ? 'Following' : 'Follow'}
                    </button>
                  </div>
                  
                  <div className="relative mt-4 group/desc cursor-pointer" onClick={() => setIsDescExpanded(!isDescExpanded)}>
                    <p className={`text-zinc-300 text-sm ${isDescExpanded ? '' : 'line-clamp-3'}`}>
                      {artistDetails.description || `Dengarkan karya-karya terbaik dari ${artistDetails.name} di platform ini. Jelajahi berbagai lagu populer, album terbaru, single, dan video musik yang telah dirilis.`}
                    </p>
                    {!isDescExpanded && (
                      <span className="text-white font-bold text-xs mt-1 hover:underline">Lihat semuanya</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Credits Section */}
            <div className="bg-zinc-800/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">Credits</h3>
                <span className="text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer transition-colors">Show all</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{artistName}</p>
                  <p className="text-sm text-zinc-400">Main Artist</p>
                </div>
                {artistDetails && (
                  <button 
                    onClick={handleSubscribe}
                    className={`px-4 py-1.5 rounded-full border text-sm font-medium transition ${
                      isSubscribed 
                        ? 'bg-transparent text-white border-white/50 hover:border-white' 
                        : 'bg-white text-black border-white hover:bg-zinc-200 hover:scale-105'
                    }`}
                  >
                    {isSubscribed ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
