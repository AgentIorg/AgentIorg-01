const https = require('https');
const fs = require('fs');
require('dotenv').config({ path: '/root/.openclaw/workspace/.env' });

const REFRESH_TOKEN = process.env.YOUTUBE_REFRESH_TOKEN;
const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;

const VIDEO_FILE = '/root/.openclaw/workspace/content/video2/video2.mp4';

const videoMetadata = {
  snippet: {
    title: 'Is CCIE Still Worth It in 2026? (Honest Answer)',
    description: `🎓 Is CCIE Still Worth It in 2026?

I'm Chris Iorg, a CCIE Security engineer, and I'm giving you the honest answer about whether CCIE certification is still worth it in 2026.

⏱ TIMESTAMPS:
0:00 - Introduction
0:30 - Reason #1: It's Not About The Paper
0:56 - Reason #2: Networking Isn't Dead
1:16 - Reason #3: CCIEs Are Rare
1:31 - Reason #4: Opens Doors
1:51 - The Honest Truth

📜 Key Takeaways:
• CCIE signals problem-solving ability and discipline
• Less than 70,000 active CCIEs worldwide
• Cloud didn't kill networking - it runs ON networks
• Get experience first, then validate with the cert

📧 Free 15-min career consultation: https://storvita.com
📅 Book a call: https://calendly.com/chris-iorg

#CCIE #CiscoCertification #NetworkEngineer #ITCareer #Cybersecurity #NetworkSecurity`,
    tags: ['CCIE', 'Cisco certification', 'network engineer', 'IT career', 'CCIE worth it', 'networking career', 'cybersecurity', 'tech career'],
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
          console.log('✅ VIDEO 2 UPLOADED!');
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
  console.log('Uploading Video 2...');
  const token = await refreshToken();
  await upload(token);
}
main();
