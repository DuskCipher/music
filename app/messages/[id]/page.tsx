'use client';

import { ArrowLeft, ChevronRight, Plus, Smile, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

export default function ChatRoom({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [messages, setMessages] = useState([
    { id: 1, text: 'anjaayy', sender: 'me', time: '10 Jun' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // In a real app, you would fetch user details based on params.id
  const user = {
    name: params.id === 'group1' ? 'Ir, Rafifebrian' : params.id === 'le-alive' ? 'le(alive)' : 'Rafifebrian',
    avatar: params.id === 'le-alive' 
      ? '/api/placeholder/120/120?text=L&bg=4a6b82&textColor=ffffff'
      : '/api/placeholder/120/120?text=R&bg=a88bbd&textColor=ffffff'
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setMessages([...messages, { id: Date.now(), text: newMessage, sender: 'me', time: 'Sekarang' }]);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col pb-36">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#121212] px-4 py-4 flex items-center justify-between border-b border-white/5 shadow-sm">
        <button onClick={() => router.back()} className="text-white hover:opacity-70 transition p-1 -ml-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
            <Image src={user.avatar} alt={user.name} width={32} height={32} className="object-cover" />
          </div>
          <h1 className="text-white font-bold text-base">{user.name}</h1>
          <ChevronRight className="w-5 h-5 text-zinc-400" />
        </div>
        <div className="w-6" /> {/* Spacer for centering */}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* Security Banner */}
        <div className="text-center mb-8 px-4">
          <p className="text-zinc-400 text-xs leading-relaxed">
            Agar obrolanmu tetap aman, kami mungkin akan meninjau pesan tertentu jika pesan tersebut dilaporkan atau melanggar persyaratan dan kebijakan kami. Untuk mempelajari selengkapnya, baca <span className="text-white cursor-pointer hover:underline">Aturan Platform</span> dan <span className="text-white cursor-pointer hover:underline">Persyaratan Penggunaan</span> kami.
          </p>
        </div>

        {/* Profile Info Centered */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
            <Image src={user.avatar} alt={user.name} width={96} height={96} className="object-cover" />
          </div>
          <h2 className="text-white text-2xl font-bold mb-4">{user.name}</h2>
          <button className="px-6 py-1.5 rounded-full border border-zinc-500 text-white text-sm font-semibold hover:border-white transition">
            Buka profil
          </button>
        </div>

        {/* Date Separator */}
        <div className="flex items-center justify-center mb-6">
          <span className="text-zinc-400 text-xs">10 Juni</span>
        </div>

        {/* Start of chat separator */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] flex-1 bg-zinc-800"></div>
          <span className="text-zinc-400 text-xs">Mulai obrolanmu dengan {user.name}</span>
          <div className="h-[1px] flex-1 bg-zinc-800"></div>
        </div>

        {/* Messages */}
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                msg.sender === 'me' ? 'bg-white/10 text-white rounded-br-sm' : 'bg-[#282828] text-white rounded-bl-sm'
              }`}>
                <p className="text-[15px]">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-[#121212] p-4 pb-safe pb-24 md:pb-24 pt-2 border-t border-white/5">
        <form onSubmit={handleSend} className="max-w-lg mx-auto flex items-center gap-3">
          <div className="flex-1 bg-[#2a2a2a] rounded-full flex items-center px-4 py-1.5 focus-within:ring-1 focus-within:ring-white transition">
            <input 
              type="text" 
              placeholder="Tulis pesan..." 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 bg-transparent text-white text-[15px] placeholder:text-zinc-400 outline-none py-2"
            />
            <button type="button" className="text-zinc-400 hover:text-white transition p-2 -mr-2">
              <Plus className="w-6 h-6" />
            </button>
            <button type="button" className="text-zinc-400 hover:text-white transition p-2 -mr-1">
              <Smile className="w-6 h-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
