const https = require('https');
const fs = require('fs');

require('dotenv').config({ path: '/root/.openclaw/workspace/.env' });

const REFRESH_TOKEN = process.env.YOUTUBE_REFRESH_TOKEN;
const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;

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
            reject(new Error('No access token: ' + data));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function getChannelId(accessToken) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.googleapis.com',
      path: '/youtube/v3/channels?part=id,snippet,brandingSettings&mine=true',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.items && json.items.length > 0) {
            resolve(json.items[0]);
          } else {
            reject(new Error('No channel found: ' + data));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function updateChannelBranding(accessToken, channelId, currentData) {
  return new Promise((resolve, reject) => {
    const updateData = {
      id: channelId,
      brandingSettings: {
        channel: {
          title: 'Chris Iorg - CCIE Security',
          description: `Enterprise Network & Security Engineering

I'm Chris Iorg, a Cisco CCIE Security engineer helping organizations build secure, reliable network infrastructure.

🔒 What I cover:
• Network Security Best Practices
• Enterprise Architecture
• Cisco Solutions (SD-WAN, ISE, Firepower)
• Zero Trust & Micro-segmentation
• Disaster Recovery Planning

💼 15+ years in enterprise networking
📜 CCIE Security certified
🏢 Working with healthcare, finance, and tech companies

📧 Free 15-min assessment: https://storvita.com
📅 Book a call: https://calendly.com/chris-iorg

New videos every week on network security, infrastructure design, and IT leadership.`,
          keywords: 'CCIE Security, Cisco, Network Security, Enterprise Networking, SD-WAN, Zero Trust, Cybersecurity, IT Infrastructure, Network Engineering, Palo Alto, Firewall',
          defaultLanguage: 'en',
          country: 'US'
        },
        image: {
          bannerExternalUrl: ''
        }
      }
    };

    const body = JSON.stringify(updateData);

    const options = {
      hostname: 'www.googleapis.com',
      path: '/youtube/v3/channels?part=brandingSettings',
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('Update response status:', res.statusCode);
        resolve(data);
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function uploadBanner(accessToken, imagePath) {
  return new Promise((resolve, reject) => {
    const imageData = fs.readFileSync(imagePath);
    
    const options = {
      hostname: 'www.googleapis.com',
      path: '/upload/youtube/v3/channelBanners/insert',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'image/png',
        'Content-Length': imageData.length
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('Banner upload status:', res.statusCode);
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          resolve({ raw: data });
        }
      });
    });

    req.on('error', reject);
    req.write(imageData);
    req.end();
  });
}

async function setBannerImage(accessToken, channelId, bannerUrl) {
  return new Promise((resolve, reject) => {
    const updateData = {
      id: channelId,
      brandingSettings: {
        image: {
          bannerExternalUrl: bannerUrl
        }
      }
    };

    const body = JSON.stringify(updateData);

    const options = {
      hostname: 'www.googleapis.com',
      path: '/youtube/v3/channels?part=brandingSettings',
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('Set banner status:', res.statusCode);
        resolve(data);
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
    const accessToken = await refreshAccessToken();
    console.log('✅ Got access token');

    console.log('Getting channel info...');
    const channel = await getChannelId(accessToken);
    console.log('✅ Channel ID:', channel.id);
    console.log('   Current title:', channel.snippet.title);

    console.log('\nUpdating channel description & keywords...');
    const updateResult = await updateChannelBranding(accessToken, channel.id, channel);
    console.log('✅ Channel branding updated');

    console.log('\nUploading channel banner...');
    const bannerResult = await uploadBanner(accessToken, '/root/.openclaw/workspace/content/branding/channel_banner.png');
    console.log('Banner result:', JSON.stringify(bannerResult, null, 2));

    if (bannerResult.url) {
      console.log('\nSetting banner image...');
      const setResult = await setBannerImage(accessToken, channel.id, bannerResult.url);
      console.log('✅ Banner set!');
    }

    console.log('\n🎉 CHANNEL BRANDING UPDATED!');
    console.log('Visit: https://youtube.com/channel/' + channel.id);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
