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
    const videoData = fs.readFileSync('/root/.openclaw/workspace/content/video10/documentation.mp4');
    
    const metadata = {
      snippet: {
        title: 'Network Documentation That Actually Works (5 Solutions)',
        description: `Your network documentation is probably out of date. Here's how to fix it with automation, version control, and smart tooling.

🔒 Subscribe for more content
📅 Free consultation: https://calendly.com/chris-iorg

#NetworkEngineering #Documentation #NetDevOps #CCIE #InfrastructureAsCode`,
        tags: ['network documentation', 'netbox', 'infrastructure as code', 'CCIE', 'network engineering', 'DevOps'],
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
        if (res.statusCode === 200) {
          const result = JSON.parse(data);
          console.log('✅ https://youtube.com/watch?v=' + result.id);
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
  const token = await refreshToken();
  await uploadVideo(token);
}

main();
