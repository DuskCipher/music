import { createClient } from '@/lib/supabase/client';
import { Track } from './store';

export interface SavedAlbum {
  albumId: string;
  name: string;
  artist: string;
  thumbnails: { url: string; width: number; height: number }[];
  savedAt: number;
}

export interface SubscribedArtist {
  artistId: string;
  name: string;
  thumbnails: { url: string; width: number; height: number }[];
  subscribedAt: number;
}

export interface RecentSearch {
  query: string;
  timestamp: number;
}

export interface PlayHistory {
  id: string;
  user_id: string;
  video_id: string;
  track_data: Track;
  played_at: string;
}

import { useAuthStore } from './store';

const supabase = createClient();

async function getUserId() {
  // Use Zustand store for instant synchronous lookup instead of slow Supabase getSession
  return useAuthStore.getState().user?.id || null;
}

export const db = {
  // PLAYLISTS
  async getPlaylists() {
    const userId = await getUserId();
    if (!userId) return [];
    const { data, error } = await supabase.from('playlists').select('*').eq('user_id', userId);
    if (error) {
      console.error(error);
      return [];
    }
    return data || [];
  },
  async addPlaylist(playlist: { id: string; name: string; img: string; tracks: Track[] }) {
    const userId = await getUserId();
    if (!userId) return;
    
    // Check if updating or inserting
    const { data: existing } = await supabase.from('playlists').select('id').eq('id', playlist.id).eq('user_id', userId).maybeSingle();
    
    let error;
    if (existing) {
      const res = await supabase.from('playlists').update({ name: playlist.name, img: playlist.img, tracks: playlist.tracks }).eq('id', playlist.id).eq('user_id', userId);
      error = res.error;
    } else {
      const res = await supabase.from('playlists').insert([{ ...playlist, user_id: userId }]);
      error = res.error;
    }
    
    if (error) console.error(error);
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('playlistsUpdated'));
  },
  async getPlaylist(id: string) {
    const userId = await getUserId();
    if (!userId) return null;
    const { data, error } = await supabase.from('playlists').select('*').eq('id', id).eq('user_id', userId).maybeSingle();
    if (error) return null;
    return data;
  },
  async deletePlaylist(id: string) {
    const userId = await getUserId();
    if (!userId) return;
    const { error } = await supabase.from('playlists').delete().eq('id', id).eq('user_id', userId);
    if (error) console.error(error);
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('playlistsUpdated'));
  },
  
  // LIKED SONGS
  // PLAY HISTORY
  async addToHistory(track: Track) {
    const userId = await getUserId();
    if (!userId) return;

    // Remove existing entry for this track to avoid duplicates (moves to top)
    await supabase.from('play_history').delete().eq('user_id', userId).eq('video_id', track.videoId);

    const { error } = await supabase.from('play_history').insert({
      user_id: userId,
      video_id: track.videoId,
      track_data: track,
    });

    if (error) console.error('Failed to add to play_history:', error);
  },

  async getHistory(): Promise<{ track: Track; playedAt: number }[]> {
    const userId = await getUserId();
    if (!userId) return [];

    const { data, error } = await supabase
      .from('play_history')
      .select('*')
      .eq('user_id', userId)
      .order('played_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Failed to fetch play_history:', error);
      return [];
    }

    // Deduplicate in case there are already duplicates in the database
    const uniqueTracks = new Map();
    for (const d of data) {
      if (!uniqueTracks.has(d.video_id)) {
        uniqueTracks.set(d.video_id, {
          track: d.track_data as Track,
          playedAt: new Date(d.played_at).getTime()
        });
      }
    }

    return Array.from(uniqueTracks.values()).slice(0, 50);
  },

  // FOLLOW SYSTEM
  async followUser(followingId: string) {
    const followerId = await getUserId();
    if (!followerId || followerId === followingId) return { error: 'Invalid action' };

    const { error } = await supabase.from('follows').insert({
      follower_id: followerId,
      following_id: followingId
    });
    return { error };
  },

  async unfollowUser(followingId: string) {
    const followerId = await getUserId();
    if (!followerId) return { error: 'Not logged in' };

    const { error } = await supabase.from('follows')
      .delete()
      .match({ follower_id: followerId, following_id: followingId });
    return { error };
  },

  async checkIsFollowing(followingId: string) {
    const followerId = await getUserId();
    if (!followerId) return false;

    const { data } = await supabase.from('follows')
      .select('follower_id')
      .match({ follower_id: followerId, following_id: followingId })
      .maybeSingle();

    return !!data;
  },

  async getLikedSongs() {
    const userId = await getUserId();
    if (!userId) return [];
    const { data, error } = await supabase.from('liked_songs').select('track_data').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) {
      console.error(error);
      return [];
    }
    return data.map(d => d.track_data);
  },
  async addLikedSong(track: Track) {
    const userId = await getUserId();
    if (!userId) return;
    const { error } = await supabase.from('liked_songs').upsert({ user_id: userId, video_id: track.videoId, track_data: track }, { onConflict: 'user_id,video_id' });
    if (error) console.error(error);
  },
  async removeLikedSong(videoId: string) {
    const userId = await getUserId();
    if (!userId) return;
    const { error } = await supabase.from('liked_songs').delete().eq('video_id', videoId).eq('user_id', userId);
    if (error) console.error(error);
  },
  async isLiked(videoId: string) {
    const userId = await getUserId();
    if (!userId) return false;
    const { data, error } = await supabase.from('liked_songs').select('video_id').eq('video_id', videoId).eq('user_id', userId).maybeSingle();
    if (error || !data) return false;
    return true;
  },

  // SUBSCRIBED ARTISTS
  async getSubscribedArtists() {
    const userId = await getUserId();
    if (!userId) return [];
    const { data, error } = await supabase.from('subscribed_artists').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) return [];
    return data;
  },
  async addSubscribedArtist(artist: SubscribedArtist) {
    const userId = await getUserId();
    if (!userId) return;
    const { error } = await supabase.from('subscribed_artists').upsert({ user_id: userId, artist_id: artist.artistId, name: artist.name, thumbnails: artist.thumbnails }, { onConflict: 'user_id,artist_id' });
    if (error) console.error(error);
  },
  async removeSubscribedArtist(artistId: string) {
    const userId = await getUserId();
    if (!userId) return;
    const { error } = await supabase.from('subscribed_artists').delete().eq('artist_id', artistId).eq('user_id', userId);
    if (error) console.error(error);
  },
  async isSubscribed(artistId: string) {
    const userId = await getUserId();
    if (!userId) return false;
    const { data, error } = await supabase.from('subscribed_artists').select('artist_id').eq('artist_id', artistId).eq('user_id', userId).maybeSingle();
    return !!data;
  },

  // SAVED ALBUMS
  async getSavedAlbums() {
    const userId = await getUserId();
    if (!userId) return [];
    const { data, error } = await supabase.from('saved_albums').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) return [];
    return data;
  },
  async addSavedAlbum(album: SavedAlbum) {
    const userId = await getUserId();
    if (!userId) return;
    const { error } = await supabase.from('saved_albums').upsert({ user_id: userId, album_id: album.albumId, name: album.name, artist: album.artist, thumbnails: album.thumbnails }, { onConflict: 'user_id,album_id' });
    if (error) console.error(error);
  },
  async removeSavedAlbum(albumId: string) {
    const userId = await getUserId();
    if (!userId) return;
    const { error } = await supabase.from('saved_albums').delete().eq('album_id', albumId).eq('user_id', userId);
    if (error) console.error(error);
  },
  async isAlbumSaved(albumId: string) {
    const userId = await getUserId();
    if (!userId) return false;
    const { data, error } = await supabase.from('saved_albums').select('album_id').eq('album_id', albumId).eq('user_id', userId).maybeSingle();
    return !!data;
  },

  // NOTIFICATIONS
  async getNotifications() {
    const userId = await getUserId();
    if (!userId) return [];
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) return [];
      return data || [];
    } catch {
      return [];
    }
  },

  // RECENT SEARCHES
  async getRecentSearches() {
    const userId = await getUserId();
    if (!userId) return [];
    const { data, error } = await supabase.from('recent_searches').select('query, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(20);
    if (error) return [];
    return data?.map(d => ({ query: d.query, timestamp: new Date(d.created_at).getTime() })) || [];
  },
  async addRecentSearch(query: string) {
    const userId = await getUserId();
    if (!userId) return;
    
    // Insert new search
    const { error } = await supabase.from('recent_searches').upsert({ user_id: userId, query }, { onConflict: 'user_id,query' });
    if (error) console.error(error);

    // Enforce limit of 20 by deleting oldest if count > 20
    const { data } = await supabase.from('recent_searches').select('id').eq('user_id', userId).order('created_at', { ascending: false });
    if (data && data.length > 20) {
      const idsToDelete = data.slice(20).map(d => d.id);
      await supabase.from('recent_searches').delete().in('id', idsToDelete);
    }
  },
  async removeRecentSearch(query: string) {
    const userId = await getUserId();
    if (!userId) return;
    const { error } = await supabase.from('recent_searches').delete().eq('query', query).eq('user_id', userId);
    if (error) console.error(error);
  },
  async clearRecentSearches() {
    const userId = await getUserId();
    if (!userId) return;
    const { error } = await supabase.from('recent_searches').delete().eq('user_id', userId);
    if (error) console.error(error);
  },

  // CLEAR ALL DATA
  async clearAllData() {
    const userId = await getUserId();
    if (!userId) return;
    await Promise.all([
      supabase.from('playlists').delete().eq('user_id', userId),
      supabase.from('liked_songs').delete().eq('user_id', userId),
      supabase.from('subscribed_artists').delete().eq('user_id', userId),
      supabase.from('saved_albums').delete().eq('user_id', userId),
      supabase.from('recent_searches').delete().eq('user_id', userId)
    ]);
  }
};
