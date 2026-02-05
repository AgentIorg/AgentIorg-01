const https = require('https');
const fs = require('fs');
require('dotenv').config({ path: '/root/.openclaw/workspace/.env' });

const REFRESH_TOKEN = process.env.YOUTUBE_REFRESH_TOKEN;
const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;

const videos = [
  { id: 'kzS1fOe35Qs', thumb: 'thumb_video1.png', title: '5 Network Security Mistakes' },
  { id: 'EZ5EhURjry8', thumb: 'thumb_video2.png', title: 'Is CCIE Worth It' },
  { id: 'TYzP4Ejcj5c', thumb: 'thumb_video3.png', title: 'SD-WAN vs MPLS' },
  { id: 'OTA6N1rKLJ0', thumb: 'thumb_video4.png', title: 'Zero Trust' },
  { id: 'O_Eh9te1KEc', thumb: 'thumb_video5.png', title: 'Network Audit Outdated' },
  { id: 'G1EjyFX_aS8', thumb: 'thumb_video6.png', title: 'WiFi Security' }
];

async function refreshToken() {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams({
      client_id: CLIENT_ID, client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN, grant_type: 'refresh_token'
    }).toString();
    const req = https.request({
      hostname: 'oauth2.googleapis.com', path: '/token', method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(postData) }
    }, (res) => {
      let data = ''; res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data).access_token));
    });
    req.on('error', reject); req.write(postData); req.end();
  });
}

async function uploadThumbnail(token, videoId, thumbPath) {
  return new Promise((resolve, reject) => {
    const imageData = fs.readFileSync(`/root/.openclaw/workspace/content/branding/${thumbPath}`);
    
    const req = https.request({
      hostname: 'www.googleapis.com',
      path: `/upload/youtube/v3/thumbnails/set?videoId=${videoId}`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'image/png',
        'Content-Length': imageData.length
      }
    }, (res) => {
      let data = ''; res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ Thumbnail uploaded for ${videoId}`);
        } else {
          console.log(`❌ Failed for ${videoId}: ${res.statusCode} - ${data.substring(0,100)}`);
        }
        resolve(data);
      });
    });
    req.on('error', reject);
    req.write(imageData);
    req.end();
  });
}

async function main() {
  console.log('Getting access token...');
  const token = await refreshToken();
  
  for (const video of videos) {
    console.log(`Uploading thumbnail for: ${video.title}`);
    await uploadThumbnail(token, video.id, video.thumb);
    await new Promise(r => setTimeout(r, 1000)); // Rate limit
  }
  
  console.log('\n🎨 ALL THUMBNAILS UPLOADED!');
}

main();
