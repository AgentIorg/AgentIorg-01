const https = require('https');
const fs = require('fs');
require('dotenv').config({ path: '/root/.openclaw/workspace/.env' });
const REFRESH_TOKEN = process.env.YOUTUBE_REFRESH_TOKEN;
const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;

async function refreshToken() {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams({client_id: CLIENT_ID, client_secret: CLIENT_SECRET, refresh_token: REFRESH_TOKEN, grant_type: 'refresh_token'}).toString();
    const req = https.request({hostname: 'oauth2.googleapis.com', path: '/token', method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(postData)}}, (res) => {
      let data = ''; res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data).access_token));
    });
    req.on('error', reject); req.write(postData); req.end();
  });
}

async function uploadVideo(token) {
  return new Promise((resolve, reject) => {
    const videoData = fs.readFileSync('/root/.openclaw/workspace/content/video11/vpn_dying.mp4');
    const metadata = {
      snippet: {
        title: 'VPNs Are Dying: Why Enterprises Are Moving to Zero Trust (ZTNA)',
        description: `Traditional VPNs are being replaced by Zero Trust Network Access. Here's why - and what it means for enterprise security.

🔒 Subscribe for more security content
📅 Free consultation: https://calendly.com/chris-iorg

#ZeroTrust #ZTNA #VPN #CyberSecurity #CCIE #NetworkSecurity`,
        tags: ['zero trust', 'ZTNA', 'VPN', 'network security', 'CCIE', 'Zscaler', 'enterprise security'],
        categoryId: '28'
      },
      status: { privacyStatus: 'public', selfDeclaredMadeForKids: false }
    };
    const boundary = 'foo_bar_baz';
    const body = Buffer.concat([
      Buffer.from(`\r\n--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n--${boundary}\r\nContent-Type: video/mp4\r\n\r\n`),
      videoData,
      Buffer.from(`\r\n--${boundary}--`)
    ]);
    const req = https.request({
      hostname: 'www.googleapis.com', path: '/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status', method: 'POST',
      headers: {'Authorization': `Bearer ${token}`, 'Content-Type': `multipart/related; boundary=${boundary}`, 'Content-Length': body.length}
    }, (res) => {
      let data = ''; res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode === 200) { console.log('✅ https://youtube.com/watch?v=' + JSON.parse(data).id); }
        else { console.log('Error:', data.substring(0, 300)); }
        resolve(data);
      });
    });
    req.on('error', reject); req.write(body); req.end();
  });
}

async function main() { const token = await refreshToken(); await uploadVideo(token); }
main();
