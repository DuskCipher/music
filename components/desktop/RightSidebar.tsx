'use client';

import { X, MoreHorizontal, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { usePlayerStore } from '@/lib/store';
import { getHighResImage } from '@/lib/utils';

export function RightSidebar() {
  const { currentTrack } = usePlayerStore();

  if (!currentTrack) {
    return (
      <div className="w-full h-full bg-zinc-900 rounded-lg flex items-center justify-center p-4">
        <p className="text-zinc-500 text-center">Putar lagu untuk melihat detailnya di sini</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-zinc-900 rounded-lg flex flex-col overflow-y-auto overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/90 backdrop-blur-md z-10">
        <h2 className="font-bold text-base truncate pr-4">{currentTrack.artist} Popular</h2>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image */}
      <div className="px-4 pb-4">
        <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-2xl mb-4 group">
          <Image 
            src={getHighResImage(currentTrack.thumbnail)} 
            alt={currentTrack.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Title and Artist */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-white leading-tight mb-1 hover:underline cursor-pointer line-clamp-2">
              {currentTrack.title}
            </h1>
            <p className="text-zinc-400 text-base hover:underline cursor-pointer truncate">
              {currentTrack.artist}
            </p>
          </div>
          <button className="text-zinc-400 hover:text-white hover:scale-105 transition-all mt-1">
            <PlusCircle className="w-6 h-6" />
          </button>
        </div>

        {/* About the artist card */}
        <div className="bg-zinc-800/50 rounded-xl overflow-hidden cursor-pointer group relative">
          <div className="relative w-full h-48">
            <Image 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentTrack.artist)}&background=random`}
              alt={currentTrack.artist}
              fill
              className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute top-4 left-4 font-bold text-white drop-shadow-md">
              About the artist
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <p className="font-bold text-lg text-white drop-shadow-md">{currentTrack.artist}</p>
              <p className="text-zinc-300 text-sm drop-shadow-md line-clamp-2 mt-1">
                Jelajahi lebih banyak musik dan album dari {currentTrack.artist}. Dengarkan lagu-lagu hits lainnya.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
