'use client';

import { Library, Plus, ArrowRight, Search, List } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function LeftSidebar() {
  const router = useRouter();

  return (
    <div className="w-full h-full bg-zinc-900 rounded-lg flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 px-6 text-zinc-400">
        <button 
          onClick={() => router.push('/library')}
          className="flex items-center gap-4 hover:text-white transition-colors group"
        >
          <Library className="w-6 h-6 group-hover:scale-105 transition-transform" />
          <span className="font-bold text-base">Your Library</span>
        </button>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800 hover:text-white transition-colors">
            <Plus className="w-5 h-5" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800 hover:text-white transition-colors">
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors">
          Playlists
        </button>
        <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors">
          Artists
        </button>
        <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors">
          Albums
        </button>
      </div>

      {/* Sort & Search */}
      <div className="px-4 py-2 flex items-center justify-between mt-2">
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
          <Search className="w-4 h-4" />
        </button>
        <button className="flex items-center gap-2 text-zinc-400 hover:text-white hover:scale-105 transition-all text-sm font-medium">
          Recents <List className="w-4 h-4" />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
        {/* Placeholder Items */}
        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800/50 cursor-pointer transition-colors">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800 shrink-0">
            <Image src="https://ui-avatars.com/api/?name=.Feast&background=random" alt=".Feast" width={48} height={48} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate text-base">.Feast</p>
            <p className="text-zinc-400 text-sm truncate">Artist</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800/50 cursor-pointer transition-colors">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800 shrink-0">
            <Image src="https://ui-avatars.com/api/?name=Hindia&background=random" alt="Hindia" width={48} height={48} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate text-base">Hindia</p>
            <p className="text-zinc-400 text-sm truncate">Artist</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800/50 cursor-pointer transition-colors">
          <div className="w-12 h-12 rounded-md overflow-hidden bg-zinc-800 shrink-0">
            <Image src="https://ui-avatars.com/api/?name=Liked+Songs&background=1DB954&color=fff" alt="Liked Songs" width={48} height={48} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate text-base">Liked Songs</p>
            <p className="text-zinc-400 text-sm truncate">Playlist • 120 songs</p>
          </div>
        </div>
      </div>
    </div>
  );
}
