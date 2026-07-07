'use client';

import { X } from 'lucide-react';
import Image from 'next/image';

interface StickerPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSticker: (url: string) => void;
}

// Koleksi stiker eksklusif
const STICKERS = [
  "https://media.tenor.com/lA_UaF-9FfEAAAAi/peach-cat.gif",
  "https://media.tenor.com/yCkaVzY5QpQAAAAi/peach-cat.gif",
  "https://media.tenor.com/Z4wH4K362WkAAAAi/peach-cat.gif",
  "https://media.tenor.com/hI2m12yXkM8AAAAi/peach-cat.gif",
  "https://media.tenor.com/5l0Cj2f05OQAAAAi/mochi-peach.gif",
  "https://media.tenor.com/f0uJ1Pj01jAAAAAi/peach-cat-love.gif",
  "https://media.tenor.com/J_wS0b5xKnsAAAAi/peach-cat-hug.gif",
  "https://media.tenor.com/N6sYl2W-iR8AAAAi/peach-cat-crying.gif",
  "https://media.tenor.com/oW6U5H4T-UoAAAAi/peach-cat.gif",
  "https://media.tenor.com/K1Y3n6ZJ3w8AAAAi/peach-cat.gif",
  "https://media.tenor.com/Y36eF_1h0dIAAAAi/peach-cat.gif",
  "https://media.tenor.com/s6n5O29B-aYAAAAi/peach-cat-angry.gif",
];

export default function StickerPicker({ isOpen, onClose, onSelectSticker }: StickerPickerProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-16 left-0 right-0 z-30 flex justify-center px-4 animate-in slide-in-from-bottom-2 duration-200">
      <div className="bg-[#181818] w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[300px]">
        <div className="p-3 border-b border-white/10 flex items-center justify-between bg-[#2a2a2a]">
          <h3 className="text-white font-bold text-sm">Pilih Stiker</h3>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white transition rounded-full hover:bg-white/10">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-3 overflow-y-auto">
          <div className="grid grid-cols-4 gap-2">
            {STICKERS.map((url, index) => (
              <button
                key={index}
                onClick={() => onSelectSticker(url)}
                className="relative aspect-square hover:bg-white/10 rounded-xl transition overflow-hidden group"
              >
                <div className="w-full h-full p-1 relative">
                  <Image src={url} alt={`Sticker ${index}`} fill className="object-contain p-1 group-hover:scale-110 transition-transform" unoptimized />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
