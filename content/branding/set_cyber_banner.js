const https = require('https');
const fs = require('fs');
require('dotenv').config({ path: '/root/.openclaw/workspace/.env' });

const REFRESH_TOKEN = process.env.YOUTUBE_REFRESH_TOKEN;
const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const CHANNEL_ID = 'UCMPaX1fVL8WGlemx2sWzrjQ';

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

async function getChannel(token) {
  return new Promise((resolve, reject) => {
    https.get({
      hostname: 'www.googleapis.com',
      path: `/youtube/v3/channels?part=brandingSettings&id=${CHANNEL_ID}`,
      headers: { 'Authorization': `Bearer ${token}` }
    }, (res) => {
      let data = ''; res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
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
        if (res.statusCode === 200) {
          resolve(JSON.parse(data).url);
        } else {
          console.log('Upload error:', data);
          resolve(null);
        }
      });
    });
    req.on('error', reject);
    req.write(imageData);
    req.end();
  });
}

async function updateChannel(token, brandingSettings, bannerUrl) {
  return new Promise((resolve, reject) => {
    brandingSettings.image = brandingSettings.image || {};
    brandingSettings.image.bannerExternalUrl = bannerUrl;
    
    const body = JSON.stringify({
      id: CHANNEL_ID,
      brandingSettings: brandingSettings
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
        console.log('Update response:', res.statusCode);
        if (res.statusCode === 200) {
          console.log('✅ BANNER APPLIED!');
        } else {
          console.log('Error:', data);
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
  console.log('🔐 Setting Cyber Banner...\n');
  
  const token = await refreshToken();
  
  // Get current channel settings
  const channel = await getChannel(token);
  const brandingSettings = channel.items[0].brandingSettings;
  console.log('Got current settings');
  
  // Upload banner
  console.log('Uploading banner...');
  const bannerUrl = await uploadBanner(token);
  console.log('Banner URL:', bannerUrl);
  
  if (bannerUrl) {
    // Update channel with new banner
    console.log('Applying to channel...');
    await updateChannel(token, brandingSettings, bannerUrl);
  }
}

main();
