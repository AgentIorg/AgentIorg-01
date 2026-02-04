# AgentIorg-01 🤖 Full Sales Automation System

**Autonomous B2B sales engine for NWN - from research to revenue**

## What This Is

A complete, autonomous sales operation powered by OpenClaw AI agents. This system:
- Finds 20+ qualified prospects daily
- Researches companies and decision-makers
- Drafts personalized outreach emails
- Tracks responses and schedules follow-ups
- Creates content for lead generation
- Builds tools to capture leads
- **Runs 24/7 with minimal human intervention**

## Architecture

```
AgentIorg (Main Controller)
├── ResearchBot (Prospect Discovery)
├── ContentBot (Lead Magnets & YouTube)
├── DevBot (Tool Building)
└── Automation Scripts (Orchestration)
```

## Features

### ✅ Automated Prospect Pipeline
- Daily discovery of 20+ qualified companies
- Automated contact research (LinkedIn, company websites)
- Email format detection
- Lead scoring and prioritization

### ✅ Email Generation & Tracking
- Personalized email drafting based on company research
- Follow-up scheduling (7-day cadence)
- Response tracking and categorization
- Ready-to-send format (copy-paste to corporate email)

### ✅ Multi-Agent Orchestration
- **ResearchBot**: Scans news, funding announcements, industry events
- **ContentBot**: Creates YouTube scripts, lead magnets, LinkedIn posts
- **DevBot**: Builds calculators, assessments, landing pages

### ✅ Revenue Streams
1. **NWN Sales** (primary): 100 emails/week target
2. **YouTube Content**: Ad revenue from technical content
3. **Lead Gen Tools**: Network assessment calculators
4. **Consulting**: Advisory services for enterprise IT

## Quick Start

### Prerequisites
- OpenClaw installed and configured
- Telegram channel (for notifications)
- GitHub access (for version control)

### Setup
```bash
# Clone this repo
git clone https://github.com/AgentIorg/AgentIorg-01.git
cd AgentIorg-01

# Install dependencies (if any)
npm install

# Configure your environment
cp .env.example .env
# Edit .env with your settings

# Start the automation
./scripts/daily-automation.sh
```

## Directory Structure

```
AgentIorg-01/
├── README.md                    # This file
├── COMMAND_CENTER.md            # Live operations dashboard
├── automation/                  # Automation scripts
│   ├── daily-workflow.js        # Main orchestration
│   ├── prospect-pipeline.js     # Research automation
│   ├── email-generator.js       # Email drafting
│   └── follow-up-scheduler.js   # Follow-up tracking
├── config/                      # Configuration files
│   ├── targets.json             # Target companies/verticals
│   ├── email-templates.json     # Email templates
│   └── workflow-config.json     # Automation settings
├── prospects/                   # Prospect data
│   ├── MASTER_TARGET_LIST.md    # 60+ companies
│   ├── contacts_master.md       # Contact database
│   └── EMAILS_READY_TO_SEND.md  # Today's batch
├── content/                     # Content assets
│   ├── youtube_script_01.md     # Published scripts
│   └── lead-magnets/            # Downloadable resources
├── memory/                      # Daily logs
│   └── YYYY-MM-DD.md            # Activity tracking
└── scripts/                     # Utility scripts
    ├── deploy.sh                # Deployment
    └── backup.sh                # Data backup
```

## Workflows

### Daily Automation (8 AM Pacific)
1. **Research Phase** (ResearchBot)
   - Scan tech news for triggers (breaches, expansions, hiring)
   - Identify 20 hot prospects
   - Research contacts via LinkedIn/company sites
   
2. **Email Generation** (Main Agent)
   - Draft personalized emails for each prospect
   - Generate subject lines
   - Format for copy-paste delivery
   
3. **Follow-Up Management**
   - Check for responses from previous days
   - Schedule follow-ups (7-day cadence)
   - Update COMMAND_CENTER dashboard
   
4. **Content Creation** (ContentBot)
   - Write YouTube scripts (weekly)
   - Create lead magnets (checklists, guides)
   - Draft LinkedIn posts

### Weekly Automation (Monday 8 AM)
1. Review previous week's metrics
2. Adjust targeting based on response rates
3. Generate weekly report
4. Plan content calendar

## Configuration

### Target Criteria
- **Geography**: Seattle/PNW priority, nationwide expansion
- **Verticals**: Healthcare, Finance, Tech, Government, Manufacturing
- **Company Size**: 500+ employees preferred
- **Decision Makers**: CIOs, CISOs, IT Directors, Network Engineers

### Email Strategy
- **Tone**: Consultative, not salesy
- **Differentiation**: CCIE Security credential
- **Call-to-Action**: "Keep me in your back pocket"
- **Follow-Up**: 7-day cadence, max 2 follow-ups

### Response Targets
- **Send Rate**: 20 emails/day (100/week)
- **Response Rate**: 5%+ (industry avg: 1-5%)
- **Meeting Rate**: 2+ meetings/week
- **Close Rate**: TBD (tracking starts after meetings)

## Integration with Corporate Systems

### Email Delivery
⚠️ **Cannot automate email sending** due to corporate policy.
- System generates ready-to-send emails in `EMAILS_READY_TO_SEND.md`
- Human (Chris) copies and pastes to Outlook
- This constraint is by design (compliance)

### CRM Integration
- Currently using flat files (markdown)
- Future: Sync with Salesforce/HubSpot if needed

## Sub-Agent Roles

### ResearchBot
**Purpose**: Find hot leads and gather intelligence
- Monitors news feeds for triggers (breaches, expansions, funding)
- Researches company infrastructure and pain points
- Identifies decision-maker contacts
- Scores leads based on fit and timing

### ContentBot
**Purpose**: Create assets for lead generation
- Writes YouTube scripts (technical + marketing)
- Develops lead magnets (checklists, assessments)
- Drafts social media content
- Generates blog posts for thought leadership

### DevBot
**Purpose**: Build tools and automations
- Creates web-based calculators (ROI, security assessment)
- Builds landing pages for lead capture
- Develops integrations and webhooks
- Maintains this automation platform

## Metrics & KPIs

### Primary Metrics
- **Emails Sent**: 100/week target
- **Response Rate**: 5%+ target
- **Meetings Booked**: 2+/week target
- **Pipeline Value**: TBD (tracking revenue)

### Secondary Metrics
- **Content Published**: 1 YouTube video/week
- **Lead Magnet Downloads**: TBD (tracking starts at launch)
- **Website Traffic**: TBD (site not live yet)

### Current Performance
- **Emails Sent**: 17 (Week 1)
- **Response Rate**: 5.9% (1/17)
- **Meetings Booked**: 0 (early stage)

## Security & Privacy

### Data Handling
- Client names anonymized in public-facing content ("Large Healthcare Provider" not "MultiCare")
- Email addresses stored locally, not in public repo
- No credentials or API keys in version control

### Access Control
- Main agent (AgentIorg) has full access
- Sub-agents have role-specific access only
- Human oversight on all external communications

## Maintenance

### Daily Tasks (Automated)
- Prospect research
- Email drafting
- Follow-up scheduling
- Dashboard updates

### Weekly Tasks (Automated)
- Performance review
- Target list refresh
- Content planning

### Manual Tasks (Human Required)
- Email sending (copy-paste to Outlook)
- Response tracking (mark in system)
- Meeting scheduling
- Closing deals

## Roadmap

### Week 1 ✅
- [x] Build automation framework
- [x] Establish prospect pipeline
- [x] Send first 20 emails
- [x] Create Command Center dashboard

### Week 2 (In Progress)
- [ ] Launch YouTube channel
- [ ] Publish first video
- [ ] Build Network Assessment Calculator
- [ ] Hit 100 emails sent milestone

### Week 3-4 (Planned)
- [ ] Launch lead capture landing page
- [ ] Set up automated lead nurture sequence
- [ ] Book first 2 meetings
- [ ] Expand to 200 emails/week

### Month 2+ (Future)
- [ ] Scale to 500 emails/week
- [ ] Launch consulting services
- [ ] Build MRR with lead gen tools
- [ ] Hire human sales support

## Support & Contact

- **Human Operator**: Chris Iorg (CCIE Security, NWN)
- **Main Agent**: AgentIorg (Telegram: @AgentIorg)
- **GitHub**: https://github.com/AgentIorg/AgentIorg-01
- **Issues**: Use GitHub Issues for bugs/features

## License

Proprietary - Not for public distribution.
This is a custom sales automation system for NWN business development.

---

**Built with [OpenClaw](https://openclaw.ai) - The autonomous AI agent framework**
