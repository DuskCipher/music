-- ====================================================================
-- DATABASE SCHEMA LENGKAP - APLIKASI MUSIK (MUSIKUZYY)
-- Salin semua isi file ini dan jalankan di SQL Editor Supabase.
-- URL: https://supabase.com/dashboard -> pilih project -> SQL Editor
-- ====================================================================

-- ============================================================
-- BAGIAN 1: TABEL PROFILES (Profil Pengguna)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name       text,
  avatar_url text,
  banner_url text,
  updated_at timestamp with time zone DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url, banner_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1),
      'Pengguna'
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'banner_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- BAGIAN 2: TABEL MUSIK
-- ============================================================

CREATE TABLE IF NOT EXISTS public.playlists (
  id         text PRIMARY KEY,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       text NOT NULL,
  img        text,
  tracks     jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.liked_songs (
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id   text NOT NULL,
  track_data jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (user_id, video_id)
);

CREATE TABLE IF NOT EXISTS public.play_history (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id   text NOT NULL,
  track_data jsonb NOT NULL,
  played_at  timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.subscribed_artists (
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  artist_id  text NOT NULL,
  name       text NOT NULL,
  thumbnails jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (user_id, artist_id)
);

CREATE TABLE IF NOT EXISTS public.saved_albums (
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  album_id   text NOT NULL,
  name       text NOT NULL,
  artist     text,
  thumbnails jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (user_id, album_id)
);

CREATE TABLE IF NOT EXISTS public.recent_searches (
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  query      text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (user_id, query)
);

-- ============================================================
-- BAGIAN 3: TABEL SOSIAL
-- ============================================================

CREATE TABLE IF NOT EXISTS public.follows (
  follower_id  uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at   timestamp with time zone DEFAULT now(),
  PRIMARY KEY (follower_id, following_id),
  CONSTRAINT no_self_follow CHECK (follower_id <> following_id)
);

-- ============================================================
-- BAGIAN 4: TABEL NOTIFIKASI
-- ============================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title      text NOT NULL,
  message    text,
  type       text,
  is_read    boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.global_notifications (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title      text NOT NULL,
  message    text,
  image_url  text,
  created_at timestamp with time zone DEFAULT now()
);

-- ============================================================
-- BAGIAN 5: TABEL PESAN / CHAT
-- ============================================================

CREATE TABLE IF NOT EXISTS public.chat_rooms (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name       text,
  is_group   boolean DEFAULT false,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.chat_members (
  room_id   uuid REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id   uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (room_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id    uuid REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  sender_id  uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text       text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- ============================================================
-- BAGIAN 6: INDEX
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_playlists_user_id         ON public.playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_liked_songs_user_id        ON public.liked_songs(user_id);
CREATE INDEX IF NOT EXISTS idx_play_history_user_id       ON public.play_history(user_id);
CREATE INDEX IF NOT EXISTS idx_play_history_played_at     ON public.play_history(played_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscribed_artists_user_id ON public.subscribed_artists(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_albums_user_id       ON public.saved_albums(user_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id        ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id       ON public.follows(following_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id      ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_members_user_id       ON public.chat_members(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_room_id           ON public.messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at        ON public.messages(created_at ASC);

-- ============================================================
-- BAGIAN 7: MENGAKTIFKAN ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.liked_songs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.play_history         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribed_artists   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_albums         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recent_searches      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_members         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages             ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- BAGIAN 8: POLICIES (Aturan Akses Data)
-- ============================================================

-- PROFILES
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Insert own profile" ON public.profiles;
CREATE POLICY "Insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- PLAYLISTS
DROP POLICY IF EXISTS "Public playlists are viewable by everyone" ON public.playlists;
CREATE POLICY "Public playlists are viewable by everyone"
  ON public.playlists FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can CRUD their own playlists" ON public.playlists;
CREATE POLICY "Users can CRUD their own playlists"
  ON public.playlists FOR ALL USING (auth.uid() = user_id);

-- LIKED SONGS
DROP POLICY IF EXISTS "Users can manage their own liked songs" ON public.liked_songs;
CREATE POLICY "Users can manage their own liked songs"
  ON public.liked_songs FOR ALL USING (auth.uid() = user_id);

-- PLAY HISTORY
DROP POLICY IF EXISTS "Users can manage their own play history" ON public.play_history;
CREATE POLICY "Users can manage their own play history"
  ON public.play_history FOR ALL USING (auth.uid() = user_id);

-- SUBSCRIBED ARTISTS
DROP POLICY IF EXISTS "Users can manage their own subscribed artists" ON public.subscribed_artists;
CREATE POLICY "Users can manage their own subscribed artists"
  ON public.subscribed_artists FOR ALL USING (auth.uid() = user_id);

-- SAVED ALBUMS
DROP POLICY IF EXISTS "Users can manage their own saved albums" ON public.saved_albums;
CREATE POLICY "Users can manage their own saved albums"
  ON public.saved_albums FOR ALL USING (auth.uid() = user_id);

-- RECENT SEARCHES
DROP POLICY IF EXISTS "Users can manage their own search history" ON public.recent_searches;
CREATE POLICY "Users can manage their own search history"
  ON public.recent_searches FOR ALL USING (auth.uid() = user_id);

-- FOLLOWS
DROP POLICY IF EXISTS "Follows are viewable by everyone" ON public.follows;
CREATE POLICY "Follows are viewable by everyone"
  ON public.follows FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage their own follows" ON public.follows;
CREATE POLICY "Users can manage their own follows"
  ON public.follows FOR ALL USING (auth.uid() = follower_id);

-- NOTIFICATIONS
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- GLOBAL NOTIFICATIONS
DROP POLICY IF EXISTS "Authenticated users can view global notifications" ON public.global_notifications;
CREATE POLICY "Authenticated users can view global notifications"
  ON public.global_notifications FOR SELECT USING (auth.role() = 'authenticated');

-- CHAT ROOMS
DROP POLICY IF EXISTS "Chat room members can view their rooms" ON public.chat_rooms;
CREATE POLICY "Chat room members can view their rooms"
  ON public.chat_rooms FOR SELECT
  USING (
    id IN (SELECT room_id FROM public.chat_members WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Authenticated users can create chat rooms" ON public.chat_rooms;
CREATE POLICY "Authenticated users can create chat rooms"
  ON public.chat_rooms FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- CHAT MEMBERS
DROP POLICY IF EXISTS "Members can view other members in same room" ON public.chat_members;
CREATE POLICY "Members can view other members in same room"
  ON public.chat_members FOR SELECT
  USING (
    room_id IN (SELECT room_id FROM public.chat_members WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Authenticated users can join chat rooms" ON public.chat_members;
CREATE POLICY "Authenticated users can join chat rooms"
  ON public.chat_members FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- MESSAGES
DROP POLICY IF EXISTS "Members can view messages in their rooms" ON public.messages;
CREATE POLICY "Members can view messages in their rooms"
  ON public.messages FOR SELECT
  USING (
    room_id IN (SELECT room_id FROM public.chat_members WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Members can send messages to their rooms" ON public.messages;
CREATE POLICY "Members can send messages to their rooms"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND room_id IN (SELECT room_id FROM public.chat_members WHERE user_id = auth.uid())
  );

-- ============================================================
-- BAGIAN 9: REALTIME (Wajib untuk chat real-time)
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- ============================================================
-- BAGIAN 10: BACKFILL - Sinkronisasi nama & avatar pengguna lama
-- ============================================================

INSERT INTO public.profiles (id, name, avatar_url, banner_url)
SELECT
  id,
  COALESCE(
    raw_user_meta_data->>'name',
    raw_user_meta_data->>'full_name',
    split_part(email, '@', 1),
    'Pengguna'
  ),
  raw_user_meta_data->>'avatar_url',
  raw_user_meta_data->>'banner_url'
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET
  name       = EXCLUDED.name,
  avatar_url = EXCLUDED.avatar_url,
  banner_url = EXCLUDED.banner_url
WHERE
  public.profiles.name IS NULL
  OR public.profiles.name = ''
  OR public.profiles.name = 'Pengguna';

-- ====================================================================
-- SELESAI! Database siap digunakan.
-- ====================================================================
