const https = require('https');
const fs = require('fs');
require('dotenv').config({ path: '/root/.openclaw/workspace/.env' });

const REFRESH_TOKEN = process.env.YOUTUBE_REFRESH_TOKEN;
const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;

const VIDEO_FILE = '/root/.openclaw/workspace/content/video3/video3.mp4';

const videoMetadata = {
  snippet: {
    title: 'SD-WAN vs MPLS in 2026: Which Should You Choose?',
    description: `🌐 SD-WAN vs MPLS: The Complete Comparison

I'm Chris Iorg, a CCIE Security engineer, and today I'm giving you the framework to decide between SD-WAN and MPLS for YOUR business.

⏱ TIMESTAMPS:
0:00 - Introduction
0:12 - What is MPLS?
0:31 - What is SD-WAN?
1:10 - When to Choose SD-WAN
1:36 - When to Choose MPLS
1:56 - My Recommendation

📊 Key Comparisons:
• MPLS: Private, predictable, $500-5K/site/month
• SD-WAN: Flexible, 30-50% cost savings, fast deployment
• Most mid-market companies → SD-WAN
• Ultra-sensitive applications → MPLS

🎯 When to Choose SD-WAN:
• SaaS applications (O365, Salesforce)
• Need fast deployment
• Cost-conscious
• Multiple connection types

🎯 When to Choose MPLS:
• Trading platforms, healthcare imaging
• Strict regulatory requirements  
• Absolute guaranteed uptime

📧 Free SD-WAN assessment: https://storvita.com
📅 Book a call: https://calendly.com/chris-iorg

#SDWAN #MPLS #NetworkArchitecture #EnterpriseNetworking #WAN #ITInfrastructure`,
    tags: ['SD-WAN', 'MPLS', 'enterprise networking', 'WAN', 'network architecture', 'Cisco', 'IT infrastructure', 'network engineering'],
    categoryId: '28'
  },
  status: { privacyStatus: 'public', selfDeclaredMadeForKids: false }
};

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

async function upload(token) {
  return new Promise((resolve, reject) => {
    const videoData = fs.readFileSync(VIDEO_FILE);
    const boundary = '----Boundary' + Math.random().toString(36).substring(2);
    const meta = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(videoMetadata)}\r\n`;
    const video = `--${boundary}\r\nContent-Type: video/mp4\r\n\r\n`;
    const end = `\r\n--${boundary}--`;
    const body = Buffer.concat([Buffer.from(meta + video), videoData, Buffer.from(end)]);
    
    const req = https.request({
      hostname: 'www.googleapis.com',
      path: '/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status',
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': `multipart/related; boundary=${boundary}`, 'Content-Length': body.length }
    }, (res) => {
      let data = ''; res.on('data', c => data += c);
      res.on('end', () => {
        const json = JSON.parse(data);
        if (json.id) {
          console.log('✅ VIDEO 3 UPLOADED!');
          console.log('ID:', json.id);
          console.log('URL: https://youtube.com/watch?v=' + json.id);
        } else {
          console.log('Error:', data);
        }
        resolve(json);
      });
    });
    req.on('error', reject); req.write(body); req.end();
  });
}

async function main() {
  console.log('Uploading Video 3...');
  const token = await refreshToken();
  await upload(token);
}
main();
