#!/bin/bash
# update-dashboard.sh - Refresh COMMAND_CENTER.md with latest stats

WORKSPACE="/root/.openclaw/workspace"
DASHBOARD="$WORKSPACE/COMMAND_CENTER.md"
DATE=$(date +%Y-%m-%d)
TIME=$(date +%H:%M)

echo "Updating Command Center dashboard..."

# This is a placeholder - the actual dashboard update
# will be done by the main OpenClaw agent with access to
# all the tracking data

# For now, just update the timestamp
if [ -f "$DASHBOARD" ]; then
    # Update the "Last Updated" line at the bottom
    sed -i "s/\*\*Last Updated:\*\*.*/\*\*Last Updated:\*\* $DATE $TIME UTC/" "$DASHBOARD"
    echo "✅ Dashboard timestamp updated: $DATE $TIME UTC"
else
    echo "⚠️  Dashboard not found at $DASHBOARD"
fi
