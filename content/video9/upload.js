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
    const videoData = fs.readFileSync('/root/.openclaw/workspace/content/video9/cloud_security.mp4');
    
    const metadata = {
      snippet: {
        title: 'Multi-Cloud Security: The Gaps No One Talks About (AWS, Azure, GCP)',
        description: `Your multi-cloud environment probably has security gaps you don't know about. Here are 5 critical issues I see when auditing AWS + Azure + GCP environments.

🔒 Subscribe for more security content
📅 Free consultation: https://calendly.com/chris-iorg

#CloudSecurity #AWS #Azure #GCP #MultiCloud #CyberSecurity #CCIE`,
        tags: ['cloud security', 'multi-cloud', 'AWS security', 'Azure security', 'GCP security', 'CCIE', 'cyber security'],
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
  const token = await refreshToken();
  await uploadVideo(token);
}

main();
