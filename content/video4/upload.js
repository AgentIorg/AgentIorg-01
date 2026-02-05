const https = require('https');
const fs = require('fs');
require('dotenv').config({ path: '/root/.openclaw/workspace/.env' });

const REFRESH_TOKEN = process.env.YOUTUBE_REFRESH_TOKEN;
const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;

const VIDEO_FILE = '/root/.openclaw/workspace/content/video4/video4.mp4';

const videoMetadata = {
  snippet: {
    title: 'Zero Trust in 2026: What It Actually Means (And How to Start)',
    description: `🔐 Zero Trust Explained: The Complete Guide

I'm Chris Iorg, a CCIE Security engineer, and today I'm breaking down Zero Trust in plain English - what it is, what it isn't, and how to actually implement it.

⏱ TIMESTAMPS:
0:00 - Introduction
0:15 - Myth #1: Zero Trust is a Product
0:30 - Myth #2: Trust No One?
0:45 - Myth #3: Only for Enterprises
1:00 - What Zero Trust Actually Is
1:15 - Why the Old Model is Broken
1:50 - Real-World Breach Example
2:10 - Core Principles
2:50 - How to Start Implementing
3:30 - Call to Action

🔒 Zero Trust Core Principles:
1. Verify Explicitly - Always authenticate based on all data
2. Least Privilege Access - Minimum access needed
3. Assume Breach - Design as if attackers are inside

📋 Implementation Steps:
1. Inventory your assets
2. Implement strong identity (MFA everywhere)
3. Segment your network
4. Monitor everything
5. Start small, then expand

📧 Free Zero Trust assessment: https://storvita.com
📅 Book a call: https://calendly.com/chris-iorg

#ZeroTrust #Cybersecurity #NetworkSecurity #EnterpriseSecurity #CCIE #InfoSec #SecurityArchitecture`,
    tags: ['Zero Trust', 'cybersecurity', 'network security', 'enterprise security', 'CCIE', 'security architecture', 'microsegmentation', 'MFA', 'identity security'],
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
          console.log('✅ VIDEO 4 UPLOADED!');
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
  console.log('Uploading Video 4...');
  const token = await refreshToken();
  await upload(token);
}
main();
