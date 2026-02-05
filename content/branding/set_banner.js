const https = require('https');
const fs = require('fs');

require('dotenv').config({ path: '/root/.openclaw/workspace/.env' });

const REFRESH_TOKEN = process.env.YOUTUBE_REFRESH_TOKEN;
const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;

async function refreshAccessToken() {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: 'refresh_token'
    }).toString();

    const options = {
      hostname: 'oauth2.googleapis.com',
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const json = JSON.parse(data);
        resolve(json.access_token);
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function getChannel(accessToken) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.googleapis.com',
      path: '/youtube/v3/channels?part=id,snippet,brandingSettings&mine=true',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${accessToken}` }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const json = JSON.parse(data);
        resolve(json.items[0]);
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function setBanner(accessToken, channelId, bannerUrl) {
  return new Promise((resolve, reject) => {
    // Need to include the full brandingSettings with channel info
    const updateData = {
      id: channelId,
      brandingSettings: {
        channel: {
          title: 'Chris Iorg - CCIE Security',
          description: `Enterprise Network & Security Engineering

I'm Chris Iorg, a Cisco CCIE Security engineer helping organizations build secure, reliable network infrastructure.

🔒 What I cover:
• Network Security Best Practices
• Enterprise Architecture
• Cisco Solutions (SD-WAN, ISE, Firepower)
• Zero Trust & Micro-segmentation
• Disaster Recovery Planning

💼 15+ years in enterprise networking
📜 CCIE Security certified
🏢 Working with healthcare, finance, and tech companies

📧 Free 15-min assessment: https://storvita.com
📅 Book a call: https://calendly.com/chris-iorg

New videos every week on network security, infrastructure design, and IT leadership.`,
          keywords: 'CCIE Security, Cisco, Network Security, Enterprise Networking, SD-WAN, Zero Trust, Cybersecurity, IT Infrastructure',
          country: 'US'
        },
        image: {
          bannerExternalUrl: bannerUrl
        }
      }
    };

    const body = JSON.stringify(updateData);

    const options = {
      hostname: 'www.googleapis.com',
      path: '/youtube/v3/channels?part=brandingSettings',
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Response:', data);
        resolve(data);
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  const accessToken = await refreshAccessToken();
  console.log('Got token');
  
  const channel = await getChannel(accessToken);
  console.log('Channel:', channel.id);
  
  // Use the banner URL from previous upload
  const bannerUrl = 'https://yt3.googleusercontent.com/tTgdG71HOWuQulU9AyM1SY13ikKWY2FjQ5HteWIxSwhTUZMYsvMIunWj3V0wC_I5gAzl8dXYB5Y';
  
  console.log('Setting banner...');
  await setBanner(accessToken, channel.id, bannerUrl);
}

main();
