const https = require('https');
const fs = require('fs');
require('dotenv').config({ path: '/root/.openclaw/workspace/.env' });
const REFRESH_TOKEN = process.env.YOUTUBE_REFRESH_TOKEN;
const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const VIDEO_FILE = '/root/.openclaw/workspace/content/video5/video5.mp4';
const videoMetadata = {
  snippet: {
    title: 'Your Network Audit is Outdated: 7 Things to Check in 2026',
    description: `🔍 Is Your Network Audit Outdated? 7 Critical Things to Check

Most network audits miss critical vulnerabilities. Here's what modern security assessments should cover.

⏱ TIMESTAMPS:
0:00 - The Problem
0:18 - #1 Cloud Configuration
0:31 - #2 API Security
0:41 - #3 Identity & Access
0:51 - #4 Lateral Movement
1:01 - #5 Supply Chain
1:11 - #6 Backup Testing
1:23 - #7 Incident Response

📋 Modern Audit Checklist:
1. Cloud misconfigurations (S3, security groups)
2. API exposure and security
3. Identity and access review
4. Lateral movement paths
5. Supply chain vendor access
6. Backup restore testing (42% fail!)
7. Incident response readiness

📧 Free assessment: https://storvita.com
📅 Book a call: https://calendly.com/chris-iorg

#NetworkSecurity #SecurityAudit #Cybersecurity #CCIE #ITSecurity`,
    tags: ['network audit', 'security audit', 'cybersecurity', 'network security', 'CCIE', 'IT security', 'cloud security', 'compliance'],
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
    const req = https.request({ hostname: 'www.googleapis.com', path: '/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status', method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': `multipart/related; boundary=${boundary}`, 'Content-Length': body.length } }, (res) => { let data = ''; res.on('data', c => data += c); res.on('end', () => { const json = JSON.parse(data); if (json.id) { console.log('✅ VIDEO 5 UPLOADED! URL: https://youtube.com/watch?v=' + json.id); } else { console.log('Error:', data); } resolve(json); }); });
    req.on('error', reject); req.write(body); req.end();
  });
}
async function main() { const token = await refreshToken(); await upload(token); }
main();
