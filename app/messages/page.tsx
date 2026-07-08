'use client';

import { MessageCircle } from 'lucide-react';

export default function MessagesEmptyState() {
  return (
    <div className="h-full w-full hidden md:flex flex-col items-center justify-center text-center">
      <MessageCircle className="w-16 h-16 text-zinc-600 mb-4" />
      <h2 className="text-white text-xl font-bold mb-2">Pesan Anda</h2>
      <p className="text-zinc-400 text-sm">Pilih obrolan dari daftar untuk mulai mengirim pesan.</p>
    </div>
  );
}
