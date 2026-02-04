#!/bin/bash
# deploy.sh - Deploy automation updates and restart services

set -e

WORKSPACE="/root/.openclaw/workspace"

echo "🚀 Deploying AgentIorg automation updates..."

# Pull latest from GitHub
cd "$WORKSPACE"
git pull origin master

# Make scripts executable
chmod +x automation/*.sh
chmod +x scripts/*.sh

# Create required directories
mkdir -p automation/tasks
mkdir -p memory
mkdir -p prospects
mkdir -p content
mkdir -p lead-magnets

# Restart OpenClaw cron jobs (if needed)
echo "✅ Automation deployed successfully!"
echo ""
echo "Next steps:"
echo "1. Verify cron job is running: openclaw cron list"
echo "2. Check COMMAND_CENTER.md for status"
echo "3. Monitor memory/YYYY-MM-DD.md for daily logs"
