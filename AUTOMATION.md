# AUTOMATION.md - How Full Automation Works

## Overview

This system runs **fully autonomously** with minimal human intervention. The only manual step is copying emails from `EMAILS_READY_TO_SEND.md` and pasting them into Outlook (corporate policy constraint).

Everything else runs on autopilot.

## Daily Workflow (8 AM Pacific)

### 1. Research Phase (ResearchBot)
**Duration**: ~15 minutes
**Agent**: ResearchBot (sub-agent)

**Tasks**:
- Scan tech news for trigger events (breaches, expansions, funding)
- Identify 20 hot prospects based on triggers + verticals
- Research company pain points and infrastructure
- Find decision-maker contacts via LinkedIn/company sites
- Score leads (1-100) based on fit and timing

**Output**:
- `prospects/HOT_LEADS_[DATE].md` - Top 20 companies with research
- `automation/tasks/research-complete-[DATE].json` - Status flag

### 2. Contact Discovery
**Duration**: ~10 minutes
**Agent**: Main (AgentIorg)

**Tasks**:
- For each company from research, find decision-maker contacts
- Use LinkedIn, company websites, press releases
- Verify email formats (most use first.last@domain.com)
- Build contact list with names, titles, emails

**Output**:
- Updated `prospects/contacts_master.md`
- Email addresses ready for personalization

### 3. Email Generation
**Duration**: ~15 minutes
**Agent**: Main (AgentIorg)

**Tasks**:
- For each contact, draft personalized email
- Reference company-specific research and triggers
- Apply CCIE Security credential and NWN capabilities
- Use consultative tone, not pushy sales
- Generate subject line (3 options, pick best)

**Output**:
- `prospects/EMAILS_READY_TO_SEND.md` - 20 copy-paste ready emails

### 4. Follow-Up Management
**Duration**: ~5 minutes
**Agent**: Main (AgentIorg)

**Tasks**:
- Check emails sent 7 days ago (first follow-up due)
- Check emails sent 14 days ago (second follow-up due)
- Draft follow-up emails for non-responders
- Mark any responses received

**Output**:
- Updated `prospects/FOLLOWUP_EMAILS.md`
- Follow-up emails added to `EMAILS_READY_TO_SEND.md`

### 5. Dashboard Update
**Duration**: ~2 minutes
**Agent**: Main (AgentIorg)

**Tasks**:
- Count total emails sent this week
- Calculate response rate
- Update pipeline metrics
- Refresh COMMAND_CENTER.md

**Output**:
- Updated `COMMAND_CENTER.md` with fresh stats

### 6. Content Pipeline (Async)
**Duration**: ~30 minutes (runs in background)
**Agent**: ContentBot (sub-agent)

**Tasks** (weekly):
- Write YouTube script (technical + marketing angle)
- Create lead magnet (checklist, guide, assessment)
- Draft LinkedIn posts (3 per week)

**Output**:
- `content/youtube_script_[NN].md`
- `lead-magnets/[asset_name].md`
- `content/linkedin_posts_[DATE].md`

## Human Touchpoints

### Daily (5 minutes)
1. Open `prospects/EMAILS_READY_TO_SEND.md`
2. Copy each email (subject + body)
3. Paste into Outlook, send
4. Mark sent in tracking (optional - agent will assume sent)

### Weekly (15 minutes)
1. Review `COMMAND_CENTER.md` for metrics
2. Check for responses in inbox
3. Notify agent of any responses ("Company X responded")
4. Adjust targets if needed ("Focus more on healthcare")

### Monthly (30 minutes)
1. Review overall pipeline performance
2. Book meetings from warm responses
3. Update strategy based on what's working
4. Publish YouTube content (record script or hire Fiverr talent)

## Sub-Agent Orchestration

### ResearchBot
**When spawned**: Daily at 8 AM Pacific
**Task**: Find 20 hot prospects with trigger events
**Model**: claude-sonnet-4-5
**Thinking**: low (cost optimization)
**Cleanup**: Keep session for review
**Delivers**: Notification to main session when complete

Example spawn:
```javascript
sessions_spawn({
  task: "Find 20 hot prospects in Seattle/PNW. Focus on companies with recent security breaches, datacenter expansions, or new CIO/CISO hires. Research each company's infrastructure, pain points, and decision-makers. Score 1-100 based on fit and urgency. Output to prospects/HOT_LEADS_[TODAY].md",
  agentId: "research",
  label: "ResearchBot-[TODAY]",
  model: "anthropic/claude-sonnet-4-5",
  thinking: "low",
  cleanup: "keep"
})
```

### ContentBot
**When spawned**: Weekly (Mondays)
**Task**: Create content assets for lead generation
**Model**: claude-sonnet-4-5
**Thinking**: low
**Cleanup**: Keep for review
**Delivers**: Notification when asset is complete

Example spawn:
```javascript
sessions_spawn({
  task: "Write a YouTube script (8-10 min) on '5 Network Security Mistakes Enterprises Make'. Technical but accessible. Include Chris's CCIE Security perspective. Save to content/youtube_script_[NN].md",
  agentId: "content",
  label: "ContentBot-YT-Script",
  model: "anthropic/claude-sonnet-4-5",
  thinking: "low",
  cleanup: "keep"
})
```

### DevBot
**When spawned**: As needed (for tool building)
**Task**: Build web apps, calculators, landing pages
**Model**: claude-sonnet-4-5
**Thinking**: medium (more complex coding)
**Cleanup**: Keep for review
**Delivers**: Notification when tool is deployed

Example spawn:
```javascript
sessions_spawn({
  task: "Build a Network Assessment Calculator (React + Netlify). User inputs: # of sites, # of users, current vendors. Output: ROI estimate, recommendations, lead capture form. Deploy to storvita.com/tools/network-assessment",
  agentId: "dev",
  label: "DevBot-Assessment-Tool",
  model: "anthropic/claude-sonnet-4-5",
  thinking: "medium",
  cleanup: "keep"
})
```

## Cron Job Configuration

### Daily Automation
```json
{
  "name": "Daily Sales Automation",
  "schedule": {
    "kind": "cron",
    "expr": "0 8 * * *",
    "tz": "America/Los_Angeles"
  },
  "payload": {
    "kind": "agentTurn",
    "message": "Run the daily sales automation workflow. 1) Spawn ResearchBot to find 20 hot prospects. 2) Once research is complete, generate personalized emails. 3) Check for follow-ups due. 4) Update COMMAND_CENTER dashboard. 5) Report summary."
  },
  "sessionTarget": "isolated"
}
```

### Weekly Content Creation
```json
{
  "name": "Weekly Content Pipeline",
  "schedule": {
    "kind": "cron",
    "expr": "0 8 * * 1",
    "tz": "America/Los_Angeles"
  },
  "payload": {
    "kind": "agentTurn",
    "message": "Spawn ContentBot to create this week's content: 1 YouTube script, 1 lead magnet, and 3 LinkedIn posts. Deliver notification when complete."
  },
  "sessionTarget": "isolated"
}
```

## Data Flow

```
[ResearchBot] → HOT_LEADS.md → [Main Agent] → EMAILS_READY_TO_SEND.md → [Human] → Outlook → [Prospects]
                                                                                              ↓
                                                                                         [Responses]
                                                                                              ↓
                                                                                    [Follow-Up Pipeline]
                                                                                              ↓
                                                                                    [Meetings Booked]
                                                                                              ↓
                                                                                        [Revenue!]
```

## File Structure & Responsibilities

### `/prospects/`
- **MASTER_TARGET_LIST.md**: All companies (60+) organized by vertical
- **HOT_LEADS_[DATE].md**: Today's researched prospects (20)
- **EMAILS_READY_TO_SEND.md**: Copy-paste ready emails
- **FOLLOWUP_EMAILS.md**: Prospects needing follow-up
- **contacts_master.md**: All contacts (names, titles, emails) [NOT IN GIT]

### `/content/`
- **youtube_script_[NN].md**: Published scripts
- **linkedin_posts_[DATE].md**: Social media drafts
- **lead-magnets/**: Downloadable assets (checklists, guides)

### `/memory/`
- **YYYY-MM-DD.md**: Daily activity logs
- **MEMORY.md**: Long-term curated memory [PRIVATE, NOT IN GIT]

### `/automation/`
- **daily-workflow.sh**: Main orchestration script
- **follow-up-check.sh**: Check for due follow-ups
- **update-dashboard.sh**: Refresh COMMAND_CENTER
- **tasks/**: Task queue files (JSON)

### `/config/`
- **workflow-config.json**: Automation settings
- **email-templates.json**: Templates and personalization rules
- **targets.json**: Verticals, triggers, geography, company size

## Error Handling

### If Research Fails
- Main agent falls back to MASTER_TARGET_LIST
- Manually pick 20 companies from different verticals
- Continue with email generation

### If Email Generation Fails
- Log error to memory/[DATE].md
- Notify human via Telegram
- Skip to follow-up management

### If Follow-Up Check Fails
- Non-critical, skip and continue
- Human can manually check FOLLOWUP_EMAILS.md

### If Dashboard Update Fails
- Non-critical, skip
- Dashboard will update next day

## Monitoring & Alerts

### Daily Summary (Telegram)
Sent every day at 8:30 AM Pacific (after workflow completes):
```
🤖 Daily Summary - Feb 4, 2026

✅ Research: 20 hot prospects found
✅ Emails: 20 drafts ready to send
✅ Follow-ups: 3 due today
📊 This week: 17 sent, 1 response (5.9%)

Action needed: Copy emails from EMAILS_READY_TO_SEND.md
```

### Hot Lead Alert (Immediate)
Sent whenever ResearchBot finds a critical-urgency lead:
```
🔥 HOT LEAD ALERT

Company: OpenAI
Trigger: Leased 583K sq ft in Bellevue (8 hours ago)
Urgency: CRITICAL (datacenter buildout)
Chris's Advantage: Has cabling crew available
Action: Email draft ready in EMAILS_READY_TO_SEND.md
```

### Response Alert (Immediate)
Sent when a prospect replies:
```
📧 RESPONSE RECEIVED

From: Viggo Forde, Snohomish County CIO
Subject: Re: Network infrastructure at Snohomish County
Sentiment: POSITIVE (interested in staff aug discussion)
Action: Follow up with Fred Hartmann by Feb 6
```

## Performance Optimization

### Token Cost Management
- Use "low" thinking for routine tasks (research, email generation)
- Use "medium" thinking for complex builds (DevBot)
- Batch operations where possible (20 emails in one turn, not 20 turns)

### Rate Limit Handling
- Brave Search API: 1 req/sec (free tier)
- Solution: Batch searches or upgrade to paid tier

### Parallelization
- ResearchBot runs async (spawned, not blocking)
- ContentBot runs async (weekly, not daily)
- Main agent continues while sub-agents work

## Scaling Plan

### Month 1: 100 emails/week
- 20 emails/day × 5 days
- Current capacity: Fully automated

### Month 2: 200 emails/week
- 40 emails/day × 5 days
- Spawn 2x ResearchBots in parallel
- Split verticals (Bot 1: Healthcare/Finance, Bot 2: Tech/Gov)

### Month 3: 500 emails/week
- 100 emails/day × 5 days
- Hire human SDR to copy-paste (remove bottleneck)
- Scale research to 100 prospects/day

### Month 6: 1000 emails/week
- 200 emails/day × 5 days
- Full sales team (Chris + 2 AEs)
- AgentIorg manages all pipeline, humans just close

## Success Metrics

### Automation Health
- **Uptime**: % of days automation runs successfully (Target: 95%+)
- **Task Completion**: % of daily tasks completed (Target: 100%)
- **Error Rate**: % of tasks that fail (Target: <5%)

### Sales Performance
- **Emails Sent**: 100/week (Month 1), 200/week (Month 2), 500/week (Month 3)
- **Response Rate**: 5%+ (industry avg: 1-5%)
- **Meeting Rate**: 2+/week
- **Close Rate**: TBD (tracking after first meetings)

### Content Performance
- **YouTube Views**: 1K+ per video (Month 3)
- **Lead Magnet Downloads**: 50+ per month
- **Website Traffic**: 1K+ visitors/month

## Troubleshooting

### "Automation didn't run today"
1. Check cron job status: `openclaw cron list`
2. Check daily log: `memory/[TODAY].md`
3. Manually trigger: Run `bash automation/daily-workflow.sh`

### "No emails were generated"
1. Check if research completed: `prospects/HOT_LEADS_[TODAY].md` exists?
2. Check error logs: `memory/[TODAY].md`
3. Fallback: Use MASTER_TARGET_LIST manually

### "Sub-agent not responding"
1. Check active sessions: `openclaw sessions list`
2. Check sub-agent status: `openclaw sessions history [session_key]`
3. Re-spawn if needed

## Future Enhancements

### Phase 2 (Month 2-3)
- [ ] CRM integration (Salesforce/HubSpot sync)
- [ ] Automated response parsing (Gmail API)
- [ ] Lead scoring ML model
- [ ] A/B testing for email templates

### Phase 3 (Month 4-6)
- [ ] Full email automation (dedicated sending server)
- [ ] Chatbot for lead qualification
- [ ] Calendar integration (auto-book meetings)
- [ ] Revenue attribution tracking

### Phase 4 (Month 6+)
- [ ] Multi-agent sales team (10+ sub-agents)
- [ ] Predictive analytics (which companies will convert)
- [ ] Autonomous meeting prep (research + deck generation)
- [ ] Post-sale customer success automation

---

**Last Updated**: 2026-02-04
**Status**: ✅ Fully Operational
**Next Review**: Monthly
