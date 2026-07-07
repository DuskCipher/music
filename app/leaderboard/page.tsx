'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/db';
import { Trophy, Medal, Crown } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface LeaderboardEntry {
  user_id: string;
  name: string;
  avatar_url: string | null;
  total_plays: number;
}

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    db.getLeaderboard().then(data => {
      setLeaders(data);
      setLoading(false);
    });
  }, []);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-300" />;
    if (index === 2) return <Medal className="w-6 h-6 text-amber-700" />;
    return <span className="text-zinc-500 font-bold w-6 text-center">{index + 1}</span>;
  };

  return (
    <div className="p-6 pb-32 max-w-2xl mx-auto min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center shadow-lg">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">Top Pendengar</h1>
          <p className="text-zinc-400 text-sm">Peringkat berdasarkan total lagu diputar minggu ini</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-16 bg-white/5 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {leaders.map((leader, idx) => (
            <div 
              key={leader.user_id}
              onClick={() => router.push(`/user/${leader.user_id}`)}
              className="bg-[#181818] border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/5 transition cursor-pointer group"
            >
              <div className="flex items-center justify-center shrink-0 w-8">
                {getRankIcon(idx)}
              </div>
              
              <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800 shrink-0 relative">
                {leader.avatar_url ? (
                  <Image src={leader.avatar_url} alt={leader.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-zinc-500 text-lg">
                    {leader.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-lg truncate group-hover:text-[#1DB954] transition">{leader.name}</h3>
              </div>

              <div className="text-right">
                <p className="text-2xl font-black text-white">{leader.total_plays}</p>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Putaran</p>
              </div>
            </div>
          ))}
          {leaders.length === 0 && (
            <div className="text-center py-20 text-zinc-500">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Belum ada data untuk minggu ini.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
