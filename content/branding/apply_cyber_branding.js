const https = require('https');
const fs = require('fs');
require('dotenv').config({ path: '/root/.openclaw/workspace/.env' });

const REFRESH_TOKEN = process.env.YOUTUBE_REFRESH_TOKEN;
const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;

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

async function uploadBanner(token) {
  return new Promise((resolve, reject) => {
    const imageData = fs.readFileSync('/root/.openclaw/workspace/content/branding/youtube_cyber_banner.jpg');
    
    const req = https.request({
      hostname: 'www.googleapis.com',
      path: '/upload/youtube/v3/channelBanners/insert',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'image/jpeg',
        'Content-Length': imageData.length
      }
    }, (res) => {
      let data = ''; res.on('data', c => data += c);
      res.on('end', () => {
        console.log('Banner upload response:', res.statusCode);
        if (res.statusCode === 200) {
          const result = JSON.parse(data);
          console.log('Banner URL:', result.url);
          resolve(result.url);
        } else {
          console.log('Error:', data.substring(0, 200));
          resolve(null);
        }
      });
    });
    req.on('error', reject);
    req.write(imageData);
    req.end();
  });
}

async function setBanner(token, bannerUrl) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      id: 'UCMPaX1fVL8WGlemx2sWzrjQ',
      brandingSettings: {
        image: {
          bannerExternalUrl: bannerUrl
        }
      }
    });
    
    const req = https.request({
      hostname: 'www.googleapis.com',
      path: '/youtube/v3/channels?part=brandingSettings',
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let data = ''; res.on('data', c => data += c);
      res.on('end', () => {
        console.log('Set banner response:', res.statusCode);
        if (res.statusCode === 200) {
          console.log('✅ Banner applied to channel!');
        } else {
          console.log('Error:', data.substring(0, 300));
        }
        resolve(data);
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log('🔐 Applying Cyber Branding to YouTube...\n');
  
  const token = await refreshToken();
  console.log('Got access token');
  
  // Upload banner
  console.log('\nUploading cyber banner...');
  const bannerUrl = await uploadBanner(token);
  
  if (bannerUrl) {
    console.log('\nApplying banner to channel...');
    await setBanner(token, bannerUrl);
  }
  
  console.log('\n🔐 CYBER BRANDING COMPLETE!');
}

main();
