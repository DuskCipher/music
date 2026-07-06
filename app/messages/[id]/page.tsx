'use client';

import { ArrowLeft, ChevronRight, Plus, Smile, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useRef, useEffect, use } from 'react';
import { db } from '@/lib/db';
import { useAuthStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';

interface Message {
  id: string;
  text: string;
  sender_id: string;
  created_at: string;
}

interface OtherUser {
  id: string;
  name: string;
  avatar_url: string | null;
}

function formatTime(isoDate: string) {
  return new Date(isoDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatRoom({ params }: { params: Promise<{ id: string }> }) {
  const { id: roomId } = use(params);
  const router = useRouter();
  const { user } = useAuthStore();
  const supabase = createClient();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages & other user info
  useEffect(() => {
    if (!roomId || !user) return;

    // Load existing messages
    loadMessages();
    loadOtherUser();

    // Subscribe real-time
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages(prev => {
            // Hindari duplikasi
            if (prev.find(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadMessages() {
    const data = await db.getMessages(roomId);
    setMessages(data as Message[]);
  }

  async function loadOtherUser() {
    const memberIds = await db.getRoomMembers(roomId);
    if (!memberIds.length) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, name, avatar_url')
      .eq('id', memberIds[0])
      .maybeSingle();

    if (profile) {
      setOtherUser({ id: profile.id, name: profile.name || 'Pengguna', avatar_url: profile.avatar_url });
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const text = newMessage.trim();
    setNewMessage('');

    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const tempMsg: Message = {
      id: tempId,
      text,
      sender_id: user?.id || '',
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempMsg]);

    const sent = await db.sendMessage(roomId, text);

    // Ganti temp msg dengan yang real (kalau real-time tidak memicunya)
    if (sent) {
      setMessages(prev => prev.map(m => m.id === tempId ? sent as Message : m));
    }

    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e as unknown as React.FormEvent);
    }
  };

  const displayName = otherUser?.name || 'Obrolan';
  const displayAvatar = otherUser?.avatar_url;

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#121212]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-white/5">
        <button onClick={() => router.back()} className="text-white hover:opacity-70 transition p-1 -ml-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => otherUser && router.push(`/user/${otherUser.id}`)}
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-zinc-700">
            {displayAvatar ? (
              <Image src={displayAvatar} alt={displayName} width={32} height={32} className="object-cover w-full h-full" />
            ) : (
              <span className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                {displayName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <h1 className="text-white font-bold text-base">{displayName}</h1>
          <ChevronRight className="w-4 h-4 text-zinc-400" />
        </button>
        <div className="w-8" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-[140px]">
        {/* Security Banner */}
        <div className="text-center mb-8 px-2">
          <p className="text-zinc-500 text-xs leading-relaxed">
            Agar obrolanmu tetap aman, kami mungkin akan meninjau pesan tertentu jika dilaporkan.
          </p>
        </div>

        {/* Other User Profile */}
        {otherUser && (
          <div className="flex flex-col items-center mb-10">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-zinc-700 flex items-center justify-center">
              {displayAvatar ? (
                <Image src={displayAvatar} alt={displayName} width={96} height={96} className="object-cover" />
              ) : (
                <span className="text-white font-bold text-3xl">{displayName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <h2 className="text-white text-2xl font-bold mb-4">{displayName}</h2>
            <button
              onClick={() => otherUser && router.push(`/user/${otherUser.id}`)}
              className="px-6 py-1.5 rounded-full border border-zinc-500 text-white text-sm font-semibold hover:border-white transition"
            >
              Buka profil
            </button>
          </div>
        )}

        {/* Start Separator */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] flex-1 bg-zinc-800" />
          <span className="text-zinc-500 text-xs">Mulai obrolan dengan {displayName}</span>
          <div className="h-[1px] flex-1 bg-zinc-800" />
        </div>

        {/* Message Bubbles */}
        <div className="space-y-2">
          {messages.map((msg, i) => {
            const isMe = msg.sender_id === user?.id;
            const prevMsg = messages[i - 1];
            const showTime = !prevMsg || formatTime(msg.created_at) !== formatTime(prevMsg.created_at);

            return (
              <div key={msg.id}>
                {showTime && i > 0 && (
                  <div className="text-center my-3">
                    <span className="text-zinc-600 text-[10px]">{formatTime(msg.created_at)}</span>
                  </div>
                )}
                <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    isMe
                      ? 'bg-[#1DB954] text-black rounded-br-sm'
                      : 'bg-[#282828] text-white rounded-bl-sm'
                  }`}>
                    <p className="text-[15px] leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-[#121212]/95 backdrop-blur-md px-4 pt-3 pb-28 border-t border-white/5 md:pb-6">
        <form onSubmit={handleSend} className="max-w-2xl mx-auto flex items-center gap-2">
          <div className="flex-1 bg-[#2a2a2a] rounded-full flex items-center px-4 py-1 focus-within:ring-1 focus-within:ring-[#1DB954]/50 transition">
            <input
              type="text"
              placeholder="Tulis pesan..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-white text-[15px] placeholder:text-zinc-500 outline-none py-2"
            />
            <button type="button" className="text-zinc-500 hover:text-white transition p-2">
              <Plus className="w-5 h-5" />
            </button>
            <button type="button" className="text-zinc-500 hover:text-white transition p-2">
              <Smile className="w-5 h-5" />
            </button>
          </div>
          {newMessage.trim() && (
            <button
              type="submit"
              disabled={sending}
              className="w-10 h-10 rounded-full bg-[#1DB954] flex items-center justify-center text-black hover:scale-105 transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
