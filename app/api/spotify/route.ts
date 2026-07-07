import { NextResponse } from 'next/server';

async function getSpotifyToken() {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!client_id || !client_secret) {
    throw new Error('Spotify API keys are missing in environment variables (.env.local).');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store', // we might want to cache this token later, but let's keep it simple for now
  });

  if (!response.ok) {
    throw new Error(`Failed to get Spotify token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing Spotify URL parameter' }, { status: 400 });
  }

  // Extract playlist ID from URL
  // Example URL: https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M?si=123
  const playlistMatch = url.match(/playlist\/([a-zA-Z0-9]+)/);
  if (!playlistMatch || !playlistMatch[1]) {
    return NextResponse.json({ error: 'Invalid Spotify playlist URL' }, { status: 400 });
  }

  const playlistId = playlistMatch[1];

  try {
    const token = await getSpotifyToken();

    // Fetch playlist details
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch Spotify playlist: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();

    // Format the tracks to a simpler structure
    const tracks = data.tracks.items
      .filter((item: any) => item.track && item.track.id) // Filter out local or invalid tracks
      .map((item: any) => ({
        title: item.track.name,
        artist: item.track.artists.map((a: any) => a.name).join(', '),
        album: item.track.album.name,
        duration: item.track.duration_ms,
        coverUrl: item.track.album.images.length > 0 ? item.track.album.images[0].url : '',
      }));

    return NextResponse.json({
      id: data.id,
      name: data.name,
      description: data.description,
      owner: data.owner.display_name,
      coverUrl: data.images.length > 0 ? data.images[0].url : '',
      tracks,
    });
  } catch (error: any) {
    console.error('Spotify API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
