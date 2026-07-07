const fetch = global.fetch || require('node-fetch');
const spotifyUrlInfo = require('spotify-url-info')(fetch);

async function test() {
  try {
    const data = await spotifyUrlInfo.getData('https://open.spotify.com/playlist/4VnMdstSyo7gi1TMn52Laa');
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}
test();
