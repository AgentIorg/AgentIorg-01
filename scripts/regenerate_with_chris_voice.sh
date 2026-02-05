#!/bin/bash
# Regenerate all videos with Chris's voice clone

VOICE_ID="p5IxvitSK8YqPrQEgDUC"
API_KEY="sk_1f51709f0153c8941d25ea9ef42298bcbe06db4086bb45b4"

for i in {2..25}; do
  VIDEO_DIR="/root/.openclaw/workspace/content/video$i"
  
  if [ -f "$VIDEO_DIR/narration.txt" ]; then
    echo "Processing video $i..."
    
    # Generate audio with Chris's voice
    curl -s -X POST "https://api.elevenlabs.io/v1/text-to-speech/$VOICE_ID" \
      -H "xi-api-key: $API_KEY" \
      -H "Content-Type: application/json" \
      -d "{
        \"text\": \"$(cat $VIDEO_DIR/narration.txt | tr '\n' ' ' | sed 's/"/\\"/g')\",
        \"model_id\": \"eleven_monolingual_v1\",
        \"voice_settings\": {\"stability\": 0.5, \"similarity_boost\": 0.8}
      }" --output "$VIDEO_DIR/chris_audio.mp3"
    
    echo "Audio $i done"
    sleep 2  # Rate limiting
  fi
done

echo "All audio generated!"
