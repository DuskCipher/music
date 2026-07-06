'use client';

import { ChevronLeft, ChevronRight, Home, Search, Bell, Copy } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import Image from 'next/image';
import { useState } from 'react';

export function TopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="h-16 flex items-center justify-between px-4 bg-black w-full shrink-0">
      {/* Navigation (Left) */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-black/50 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={() => router.forward()}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-black/50 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Search & Home (Center) */}
      <div className="flex items-center gap-2 flex-1 max-w-xl mx-4">
        <button 
          onClick={() => router.push('/')}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 hover:scale-105 transition-all shrink-0"
        >
          <Home className="w-6 h-6 text-white" />
        </button>
        
        <form onSubmit={handleSearch} className="flex-1 relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Search className="w-5 h-5 text-zinc-400 group-focus-within:text-white transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="What do you want to play?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 bg-zinc-800 hover:bg-zinc-700/80 focus:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-full pl-12 pr-12 text-white placeholder:text-zinc-400 transition-all font-medium text-sm"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-l border-zinc-600 pl-3">
            <button type="button" className="text-zinc-400 hover:text-white transition-colors">
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Profile (Right) */}
      <div className="flex items-center gap-4 shrink-0">
        <button className="text-zinc-400 hover:text-white transition-colors relative hover:scale-110 active:scale-95 duration-200">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full border border-black"></span>
        </button>
        
        <button 
          onClick={() => router.push('/settings')}
          className="w-8 h-8 rounded-full overflow-hidden bg-zinc-800 border-4 border-black hover:scale-105 transition-transform"
        >
          {isAuthenticated && user?.avatarUrl ? (
            <Image src={user.avatarUrl} alt="Profile" width={32} height={32} className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-red-500 text-black font-bold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
