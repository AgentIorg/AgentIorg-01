const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '/root/.openclaw/workspace/.env' });

const ACCESS_TOKEN = process.env.YOUTUBE_ACCESS_TOKEN;
const REFRESH_TOKEN = process.env.YOUTUBE_REFRESH_TOKEN;
const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;

const VIDEO_FILE = '/root/.openclaw/workspace/content/video1/video1_raw.mp4';

const videoMetadata = {
  snippet: {
    title: '5 Network Security Mistakes That Cost Companies Millions',
    description: `🔒 5 Network Security Mistakes That Cost Companies Millions

I'm Chris Iorg, a Cisco CCIE Security engineer working with enterprise organizations. In this video, I break down the most expensive network security mistakes I see—and how to fix them.

⏱ TIMESTAMPS:
0:00 - Intro
0:09 - Mistake #1: Flat Networks
0:26 - Mistake #2: Set It and Forget It
0:41 - Mistake #3: Insider Threats
0:56 - Mistake #4: Weak Wireless
1:11 - Mistake #5: No DR Plan
1:29 - Free Assessment Offer

📥 FREE 15-Minute Network Assessment - No sales pitch, just honest advice from a CCIE Security engineer.
🔗 https://storvita.com
📅 Book a call: https://calendly.com/chris-iorg

#NetworkSecurity #CiscoSecurity #Cybersecurity #ITInfrastructure #CCIE #NetworkEngineer #InfoSec`,
    tags: ['network security', 'cybersecurity', 'CCIE', 'Cisco', 'IT infrastructure', 'network mistakes', 'security audit', 'enterprise security', 'network engineer'],
    categoryId: '28' // Science & Technology
  },
  status: {
    privacyStatus: 'public',
    selfDeclaredMadeForKids: false
  }
};

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
        try {
          const json = JSON.parse(data);
          if (json.access_token) {
            resolve(json.access_token);
          } else {
            reject(new Error('No access token in response: ' + data));
          }
        } catch (e) {
          reject(new Error('Failed to parse token response: ' + data));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function uploadVideo(accessToken) {
  return new Promise((resolve, reject) => {
    const videoData = fs.readFileSync(VIDEO_FILE);
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    
    // Build multipart body
    const metadataPart = 
      `--${boundary}\r\n` +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(videoMetadata) + '\r\n';
    
    const videoPart = 
      `--${boundary}\r\n` +
      'Content-Type: video/mp4\r\n\r\n';
    
    const endBoundary = `\r\n--${boundary}--`;
    
    const bodyStart = Buffer.from(metadataPart + videoPart, 'utf8');
    const bodyEnd = Buffer.from(endBoundary, 'utf8');
    const body = Buffer.concat([bodyStart, videoData, bodyEnd]);

    const options = {
      hostname: 'www.googleapis.com',
      path: '/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
        'Content-Length': body.length
      }
    };

    console.log('Uploading video...');
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('Response status:', res.statusCode);
        try {
          const json = JSON.parse(data);
          if (json.id) {
            resolve(json);
          } else {
            reject(new Error('Upload failed: ' + data));
          }
        } catch (e) {
          reject(new Error('Failed to parse response: ' + data));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  try {
    console.log('Refreshing access token...');
    const newAccessToken = await refreshAccessToken();
    console.log('Got new access token!');
    
    console.log('Starting upload...');
    const result = await uploadVideo(newAccessToken);
    
    console.log('\n✅ VIDEO UPLOADED SUCCESSFULLY!');
    console.log('Video ID:', result.id);
    console.log('URL: https://youtube.com/watch?v=' + result.id);
    console.log('Title:', result.snippet.title);
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
