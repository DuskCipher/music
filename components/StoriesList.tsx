'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/db';
import Image from 'next/image';
import { Plus, Play } from 'lucide-react';
import { useAuthStore, usePlayerStore } from '@/lib/store';

interface Story {
  id: string;
  user_id: string;
  track_data: any;
  caption: string;
  created_at: string;
  profiles: {
    name: string;
    avatar_url: string | null;
  };
}

export default function StoriesList() {
  const [stories, setStories] = useState<Story[]>([]);
  const { user } = useAuthStore();
  const { playTrack } = usePlayerStore();

  useEffect(() => {
    db.getStories().then(res => setStories(res));
  }, []);

  const handlePlayStory = (story: Story) => {
    if (story.track_data) {
      playTrack(story.track_data, [story.track_data]);
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-2 no-scrollbar px-1">
      {/* Add Story Button (Placeholder for UI) */}
      <div className="flex flex-col items-center gap-2 cursor-pointer shrink-0">
        <div className="relative w-16 h-16 rounded-full bg-[#1DB954] flex items-center justify-center shadow-lg border-[3px] border-black">
          <Plus className="w-8 h-8 text-black" />
        </div>
        <span className="text-xs text-white font-medium">Kisah Anda</span>
      </div>

      {stories.map(story => {
        const coverUrl = story.track_data.thumbnails?.[story.track_data.thumbnails.length - 1]?.url || '';
        return (
          <div key={story.id} className="flex flex-col items-center gap-2 cursor-pointer shrink-0 group relative" onClick={() => handlePlayStory(story)}>
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-[3px] border-[#1DB954] group-hover:scale-105 transition shadow-lg">
              {coverUrl ? (
                <Image src={coverUrl} alt="Story" fill className="object-cover" unoptimized />
              ) : (
                <div className="w-full h-full bg-zinc-800" />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <Play className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="absolute top-10 right-0 w-6 h-6 rounded-full overflow-hidden border-2 border-black bg-zinc-800 z-10">
              {story.profiles?.avatar_url ? (
                <Image src={story.profiles.avatar_url} alt={story.profiles.name} fill className="object-cover" />
              ) : (
                <span className="flex items-center justify-center text-[10px] text-white font-bold h-full">
                  {story.profiles?.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <span className="text-xs text-white/80 font-medium truncate w-16 text-center">{story.profiles?.name.split(' ')[0]}</span>
          </div>
        );
      })}
    </div>
  );
}
