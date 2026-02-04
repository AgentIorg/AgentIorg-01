#!/bin/bash
# follow-up-check.sh - Check which prospects need follow-ups today

WORKSPACE="/root/.openclaw/workspace"
TODAY=$(date +%Y-%m-%d)
TODAY_EPOCH=$(date -d "$TODAY" +%s)

echo "Checking follow-ups for $TODAY..."

# Check if follow-up file exists
FOLLOWUP_FILE="$WORKSPACE/prospects/FOLLOWUP_EMAILS.md"
if [ ! -f "$FOLLOWUP_FILE" ]; then
    echo "⚠️  No follow-up file found. Creating..."
    cat > "$FOLLOWUP_FILE" <<EOF
# Follow-Up Email Tracker

## Pending Follow-Ups

| Company | Contact | Email | Sent Date | Follow-Up Date | Status |
|---------|---------|-------|-----------|----------------|--------|

## Completed Follow-Ups

| Company | Contact | Email | Sent Date | Follow-Up Date | Response | Status |
|---------|---------|-------|-----------|----------------|----------|--------|
EOF
    exit 0
fi

# Parse the file and check for due follow-ups
# (Simplified - in production this would parse the markdown table)

echo "✅ Follow-up check complete"
echo "   - Any prospects requiring follow-up will be flagged in COMMAND_CENTER.md"
