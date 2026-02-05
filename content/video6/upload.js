const https = require('https');
const fs = require('fs');
require('dotenv').config({ path: '/root/.openclaw/workspace/.env' });
const REFRESH_TOKEN = process.env.YOUTUBE_REFRESH_TOKEN;
const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const VIDEO_FILE = '/root/.openclaw/workspace/content/video6/video6.mp4';
const videoMetadata = {
  snippet: {
    title: 'Enterprise WiFi Security: 5 Mistakes That Get Companies Hacked',
    description: `📶 Enterprise WiFi Security: 5 Critical Mistakes

Your wireless network might be your weakest link. Here are the mistakes I see at almost every company.

⏱ TIMESTAMPS:
0:00 - Introduction
0:10 - Mistake #1: No Segmentation
0:36 - Mistake #2: Still Using WPA2
0:51 - Mistake #3: Weak Passwords
1:06 - Mistake #4: No Monitoring
1:18 - Mistake #5: Default Configs
1:31 - The Fix

🔒 WiFi Security Checklist:
1. Segment guest, corporate, and IoT networks
2. Upgrade to WPA3
3. Use 802.1X with certificates
4. Deploy wireless IDS
5. Change default configurations

📧 Free assessment: https://storvita.com
📅 Book a call: https://calendly.com/chris-iorg

#WiFiSecurity #WirelessSecurity #NetworkSecurity #CCIE #EnterpriseSecurity #Cybersecurity`,
    tags: ['WiFi security', 'wireless security', 'WPA3', 'enterprise WiFi', 'network security', 'CCIE', '802.1X', 'cybersecurity'],
    categoryId: '28'
  },
  status: { privacyStatus: 'public', selfDeclaredMadeForKids: false }
};
async function refreshToken() {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, refresh_token: REFRESH_TOKEN, grant_type: 'refresh_token' }).toString();
    const req = https.request({ hostname: 'oauth2.googleapis.com', path: '/token', method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(postData) } }, (res) => { let data = ''; res.on('data', c => data += c); res.on('end', () => resolve(JSON.parse(data).access_token)); });
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
    const req = https.request({ hostname: 'www.googleapis.com', path: '/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status', method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': `multipart/related; boundary=${boundary}`, 'Content-Length': body.length } }, (res) => { let data = ''; res.on('data', c => data += c); res.on('end', () => { const json = JSON.parse(data); if (json.id) { console.log('✅ VIDEO 6 UPLOADED! URL: https://youtube.com/watch?v=' + json.id); } else { console.log('Error:', data); } resolve(json); }); });
    req.on('error', reject); req.write(body); req.end();
  });
}
async function main() { const token = await refreshToken(); await upload(token); }
main();
