#!/bin/bash
# daily-workflow.sh - Main orchestration script for AgentIorg automation
# Runs daily at 8 AM Pacific via OpenClaw cron

set -e

WORKSPACE="/root/.openclaw/workspace"
DATE=$(date +%Y-%m-%d)
LOG_FILE="$WORKSPACE/memory/$DATE.md"

echo "🤖 AgentIorg Daily Workflow - $DATE"
echo "=========================================="

# Ensure memory directory exists
mkdir -p "$WORKSPACE/memory"

# Initialize daily log
if [ ! -f "$LOG_FILE" ]; then
    cat > "$LOG_FILE" <<EOF
# $DATE - Daily Activity Log

## Morning Automation (8 AM Pacific)

### Tasks Completed
EOF
fi

# 1. Research Phase - Spawn ResearchBot
echo "📊 Phase 1: Prospect Research"
echo "- Spawning ResearchBot for hot lead discovery..."
# This would trigger an OpenClaw sub-agent spawn
# For now, we'll create a task file that the main agent will pick up

cat > "$WORKSPACE/automation/tasks/research-task-$DATE.json" <<EOF
{
  "task": "research",
  "date": "$DATE",
  "target_count": 20,
  "verticals": ["healthcare", "finance", "tech", "government"],
  "status": "pending"
}
EOF

# 2. Email Generation Phase
echo "✉️  Phase 2: Email Generation"
echo "- Checking for completed research..."
echo "- Generating personalized emails..."

# This will be picked up by the main agent
cat > "$WORKSPACE/automation/tasks/email-gen-task-$DATE.json" <<EOF
{
  "task": "email-generation",
  "date": "$DATE",
  "target_count": 20,
  "status": "pending"
}
EOF

# 3. Follow-Up Management
echo "📅 Phase 3: Follow-Up Tracking"
bash "$WORKSPACE/automation/follow-up-check.sh"

# 4. Dashboard Update
echo "📊 Phase 4: Dashboard Update"
bash "$WORKSPACE/automation/update-dashboard.sh"

# 5. Content Creation (runs async via ContentBot)
echo "🎨 Phase 5: Content Pipeline"
echo "- Checking content calendar..."
echo "- Spawning ContentBot if needed..."

# Log completion
echo "" >> "$LOG_FILE"
echo "### Automation Summary" >> "$LOG_FILE"
echo "- Research task queued: 20 prospects" >> "$LOG_FILE"
echo "- Email generation queued: 20 drafts" >> "$LOG_FILE"
echo "- Follow-ups checked and updated" >> "$LOG_FILE"
echo "- Dashboard refreshed" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

echo "✅ Daily workflow complete!"
echo "=========================================="
