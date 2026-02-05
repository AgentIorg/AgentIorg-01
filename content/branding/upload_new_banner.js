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

async function getChannel(token) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'www.googleapis.com',
      path: '/youtube/v3/channels?part=id&mine=true',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    }, (res) => {
      let data = ''; res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data).items[0]));
    });
    req.on('error', reject); req.end();
  });
}

async function uploadBanner(token) {
  return new Promise((resolve, reject) => {
    const imageData = fs.readFileSync('/root/.openclaw/workspace/content/branding/banner_clean.png');
    const req = https.request({
      hostname: 'www.googleapis.com',
      path: '/upload/youtube/v3/channelBanners/insert',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'image/png',
        'Content-Length': imageData.length
      }
    }, (res) => {
      let data = ''; res.on('data', c => data += c);
      res.on('end', () => {
        console.log('Banner upload status:', res.statusCode);
        const json = JSON.parse(data);
        resolve(json);
      });
    });
    req.on('error', reject); req.write(imageData); req.end();
  });
}

async function setBanner(token, channelId, bannerUrl) {
  return new Promise((resolve, reject) => {
    const updateData = {
      id: channelId,
      brandingSettings: {
        channel: {
          title: 'Chris Iorg | CCIE Security',
          description: `Enterprise Network & Security Engineering

I'm Chris Iorg, a Cisco CCIE Security engineer helping organizations build secure, reliable network infrastructure.

🔒 What I Cover:
• Network Security Best Practices
• Enterprise Architecture & Design  
• Cisco Solutions (SD-WAN, ISE, Firepower)
• Zero Trust & Micro-segmentation
• Disaster Recovery Planning
• CCIE Career Advice

💼 15+ years in enterprise networking
📜 CCIE Security certified
🏢 Working with healthcare, finance, and tech companies

📧 Free 15-min assessment: https://storvita.com
📅 Book a call: https://calendly.com/chris-iorg

New videos weekly!`,
          keywords: 'CCIE Security Cisco Network Security Enterprise Networking SD-WAN Zero Trust Cybersecurity IT Infrastructure',
          country: 'US'
        },
        image: {
          bannerExternalUrl: bannerUrl
        }
      }
    };
    const body = JSON.stringify(updateData);
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
        console.log('Set banner status:', res.statusCode);
        resolve(data);
      });
    });
    req.on('error', reject); req.write(body); req.end();
  });
}

async function main() {
  console.log('Getting token...');
  const token = await refreshToken();
  
  console.log('Getting channel...');
  const channel = await getChannel(token);
  console.log('Channel ID:', channel.id);
  
  console.log('Uploading new clean banner...');
  const bannerResult = await uploadBanner(token);
  
  if (bannerResult.url) {
    console.log('Banner URL:', bannerResult.url);
    console.log('Setting banner on channel...');
    await setBanner(token, channel.id, bannerResult.url);
    console.log('\n✅ NEW CLEAN BANNER SET!');
  } else {
    console.log('Banner result:', JSON.stringify(bannerResult));
  }
}

main();
