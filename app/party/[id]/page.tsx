'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore, usePartyStore } from '@/lib/store';
import { Headphones, Users, Share2, Copy, LogOut, Crown } from 'lucide-react';
import Image from 'next/image';

export default function PartyPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.id as string;
  
  const { user } = useAuthStore();
  const { roomId: currentRoomId, isHost, members, setParty, leaveParty } = usePartyStore();
  
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/party/' + roomId);
    }
  }, [user, router, roomId]);

  const handleJoin = () => {
    setParty(roomId, false);
  };

  const handleLeave = () => {
    leaveParty();
    router.push('/');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) return null;

  return (
    <div className="flex-1 overflow-y-auto pb-32">
      <div className="p-8 max-w-4xl mx-auto mt-10">
        <div className="bg-zinc-900/50 p-8 rounded-3xl border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Listen Together</h1>
                <p className="text-zinc-400 mt-1">Dengarkan musik secara sinkron bersama teman</p>
              </div>
            </div>
            
            {currentRoomId === roomId ? (
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleCopyLink}
                  className="flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium border bg-zinc-800/50 border-white/10 hover:bg-zinc-800 text-white transition-colors"
                >
                  {copied ? 'Tersalin!' : <><Share2 className="w-4 h-4 mr-2" /> Bagikan Link</>}
                </button>
                <button 
                  onClick={handleLeave}
                  className="flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Keluar
                </button>
              </div>
            ) : (
              <button 
                onClick={handleJoin}
                className="flex items-center justify-center bg-green-500 hover:bg-green-400 text-black font-semibold px-8 py-4 rounded-full transition-colors text-lg"
              >
                Gabung Sesi
              </button>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
              <Users className="w-5 h-5 text-green-400" />
              <span>Anggota ({members.length})</span>
            </div>

            {currentRoomId === roomId ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center gap-4 bg-zinc-800/40 p-4 rounded-2xl border border-white/5">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={member.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{member.name}</p>
                      {member.isHost ? (
                        <p className="text-green-400 text-xs flex items-center gap-1 mt-0.5">
                          <Crown className="w-3 h-3" /> Host
                        </p>
                      ) : (
                        <p className="text-zinc-500 text-xs mt-0.5">Pendengar</p>
                      )}
                    </div>
                  </div>
                ))}
                
                {members.length === 0 && (
                  <div className="col-span-full py-8 text-center text-zinc-500 bg-zinc-900/50 rounded-2xl border border-white/5 border-dashed">
                    Menunggu teman bergabung...
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 bg-zinc-900/50 rounded-3xl border border-white/5 border-dashed">
                <Users className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">Anda belum bergabung</h3>
                <p className="text-zinc-400 max-w-sm mx-auto">
                  Klik tombol "Gabung Sesi" di atas untuk mulai mendengarkan musik bersama teman-teman di ruangan ini.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
