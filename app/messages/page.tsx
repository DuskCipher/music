'use client';

import { ArrowLeft, Edit, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function Messages() {
  const router = useRouter();

  const chats = [
    {
      id: 'group1',
      name: 'Ir, Rafifebrian',
      message: 'Rafifebrian bergabung ke obrolan',
      date: '10 Jun',
      isGroup: true,
      avatars: [
        '/api/placeholder/48/48?text=R&bg=a88bbd&textColor=ffffff',
        '/api/placeholder/48/48?text=Img&bg=333333&textColor=ffffff'
      ]
    },
    {
      id: 'rafifebrian',
      name: 'Rafifebrian',
      message: 'Mengirimkan',
      date: '10 Jun',
      isGroup: false,
      avatars: ['/api/placeholder/48/48?text=R&bg=a88bbd&textColor=ffffff']
    },
    {
      id: 'le-alive',
      name: 'le(alive)',
      message: 'Mengirimkan',
      date: '31 Mei',
      isGroup: false,
      avatars: ['/api/placeholder/48/48?text=L&bg=4a6b82&textColor=ffffff']
    }
  ];

  return (
    <div className="min-h-screen bg-[#121212] pb-32">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#121212] px-4 py-4 flex items-center justify-between">
        <button onClick={() => router.back()} className="text-white hover:opacity-70 transition">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white font-bold text-base">Pesan</h1>
        <button className="text-white hover:opacity-70 transition">
          <Edit className="w-6 h-6" />
        </button>
      </div>

      <div className="px-4 mt-2">
        {/* Create Group Action */}
        <div className="flex items-center gap-4 py-3 cursor-pointer hover:bg-white/5 transition rounded-lg">
          <div className="w-14 h-14 rounded-full bg-[#282828] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-white" />
          </div>
          <span className="text-white font-medium text-base">Buat grup</span>
        </div>

        {/* Chat List */}
        <div className="mt-2 space-y-1">
          {chats.map((chat) => (
            <Link href={`/messages/${chat.id}`} key={chat.id} className="flex items-center gap-4 py-3 cursor-pointer hover:bg-white/5 transition rounded-lg">
              <div className="relative w-14 h-14 shrink-0">
                {chat.isGroup ? (
                  <>
                    <div className="absolute top-0 left-0 w-10 h-10 rounded-full overflow-hidden border-2 border-[#121212] z-10">
                      <Image src={chat.avatars[0]} alt="Avatar 1" fill className="object-cover" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-10 h-10 rounded-full overflow-hidden border-2 border-[#121212] z-20 bg-zinc-800">
                      <Image src={chat.avatars[1]} alt="Avatar 2" fill className="object-cover" />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <Image src={chat.avatars[0]} alt={chat.name} fill className="object-cover" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium text-base truncate">{chat.name}</h3>
                <p className="text-zinc-400 text-sm truncate mt-0.5">
                  {chat.message} • {chat.date}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
