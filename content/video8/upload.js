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

async function uploadVideo(token) {
  return new Promise((resolve, reject) => {
    const videoData = fs.readFileSync('/root/.openclaw/workspace/content/video8/ransomware.mp4');
    
    const metadata = {
      snippet: {
        title: 'Ransomware Hit Your Network - Your First 60 Minutes (Incident Response)',
        description: `What do you do when ransomware locks your systems? As a CCIE Security engineer, here's the incident response playbook for your first critical hour.

0:00 The attack begins
0:15 Step 1: Isolate
0:30 Step 2: Preserve evidence
0:45 Step 3: Assess damage
1:00 Step 4: Communicate
1:15 Step 5: Contain

🔒 Subscribe for more security content
📅 Free consultation: https://calendly.com/chris-iorg

#Ransomware #IncidentResponse #CyberSecurity #CCIE #NetworkSecurity`,
        tags: ['ransomware', 'incident response', 'cyber security', 'ransomware attack', 'network security', 'CCIE', 'data breach'],
        categoryId: '28'
      },
      status: { privacyStatus: 'public', selfDeclaredMadeForKids: false }
    };

    const boundary = 'foo_bar_baz';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const body = Buffer.concat([
      Buffer.from(delimiter + 'Content-Type: application/json; charset=UTF-8\r\n\r\n' + JSON.stringify(metadata) + delimiter + 'Content-Type: video/mp4\r\n\r\n'),
      videoData,
      Buffer.from(closeDelimiter)
    ]);

    const req = https.request({
      hostname: 'www.googleapis.com',
      path: '/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
        'Content-Length': body.length
      }
    }, (res) => {
      let data = ''; res.on('data', c => data += c);
      res.on('end', () => {
        console.log('Response:', res.statusCode);
        if (res.statusCode === 200) {
          const result = JSON.parse(data);
          console.log('✅ VIDEO UPLOADED!');
          console.log('Video ID:', result.id);
          console.log('URL: https://youtube.com/watch?v=' + result.id);
        } else {
          console.log('Error:', data.substring(0, 500));
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
  console.log('🔥 Uploading Video 8: Ransomware Response...\n');
  const token = await refreshToken();
  await uploadVideo(token);
}

main();
