# Lead Magnet Metrics Tracking Template

## How to Use This

1. Copy each table into Google Sheets or Excel
2. Update weekly with actual numbers
3. Use formulas to calculate conversion rates automatically
4. Review trends monthly to optimize strategy

---

## Weekly Lead Generation Metrics

| Week Starting | Landing Page Visitors | Downloads | Conversion Rate | LinkedIn Traffic | Google Traffic | Referral Traffic | Direct Traffic |
|---------------|----------------------|-----------|-----------------|------------------|----------------|------------------|----------------|
| 2026-02-10    |                      |           | =(C2/B2)*100    |                  |                |                  |                |
| 2026-02-17    |                      |           | =(C3/B3)*100    |                  |                |                  |                |
| 2026-02-24    |                      |           | =(C4/B4)*100    |                  |                |                  |                |
| 2026-03-03    |                      |           | =(C5/B5)*100    |                  |                |                  |                |
| 2026-03-10    |                      |           | =(C6/B6)*100    |                  |                |                  |                |
| **Totals**    | =SUM(B2:B6)          | =SUM(C2:C6) | =(C7/B7)*100    | =SUM(D2:D6)      | =SUM(E2:E6)    | =SUM(F2:F6)      | =SUM(G2:G6)    |

**Target Conversion Rate:** 25-40%  
**Action if below 20%:** Review landing page copy, reduce form fields, add social proof

---

## Email Sequence Performance

| Email # | Subject Line | Sent | Delivered | Opened | Open Rate | Clicked | Click Rate | Unsubscribed |
|---------|-------------|------|-----------|--------|-----------|---------|------------|--------------|
| 1 - Delivery | Your Network Security Checklist is ready [PDF inside] |  |  |  | =(E2/D2)*100 |  | =(G2/D2)*100 |  |
| 2 - Value (Day 3) | The 3 most overlooked items on that checklist |  |  |  | =(E3/D3)*100 |  | =(G3/D3)*100 |  |
| 3 - Social Proof (Day 6) | How [Company] used this checklist to pass their audit |  |  |  | =(E4/D4)*100 |  | =(G4/D4)*100 |  |
| 4 - Offer (Day 9) | Free security assessment for [Company]? |  |  |  | =(E5/D5)*100 |  | =(G5/D5)*100 |  |
| 5 - Re-engage (Day 16) | Still on your radar? |  |  |  | =(E6/D6)*100 |  | =(G6/D6)*100 |  |
| **Averages** |  | =SUM(C2:C6) | =SUM(D2:D6) | =SUM(E2:E6) | =AVERAGE(F2:F6) | =SUM(G2:G6) | =AVERAGE(H2:H6) | =SUM(I2:I6) |

**Target Open Rate:** >40%  
**Target Click Rate:** >10%  
**Target Unsubscribe Rate:** <2%

**Action if open rates low:** Test different subject lines, send time optimization  
**Action if click rates low:** Improve CTA clarity, add more value in email body

---

## Lead Quality Breakdown

| Week | Total Leads | Enterprise (1000+) | Mid-Market (201-1000) | SMB (51-200) | Small (1-50) | Unknown |
|------|-------------|-------------------|--------------------|------------|----------|---------|
| Week 1 |  |  |  |  |  |  |
| Week 2 |  |  |  |  |  |  |
| Week 3 |  |  |  |  |  |  |
| Week 4 |  |  |  |  |  |  |
| **Total** | =SUM(B2:B5) | =SUM(C2:C5) | =SUM(D2:D5) | =SUM(E2:E5) | =SUM(F2:F5) | =SUM(G2:G5) |

**% Enterprise:** =(C6/B6)*100  
**% Mid-Market:** =(D6/B6)*100  
**% SMB:** =(E6/B6)*100

**Ideal lead profile:** Mid-market to enterprise companies (201+ employees)

---

## Job Title Segmentation

| Job Title Category | Count | % of Total | High Priority | Notes |
|-------------------|-------|------------|---------------|-------|
| C-Level (CISO, CTO, CIO) |  | =(B2/B11)*100 | ✅ | Decision makers - highest value |
| Director Level (IT Director, Security Director) |  | =(B3/B11)*100 | ✅ | Strong influence on decisions |
| Manager (IT Manager, Network Manager) |  | =(B4/B11)*100 | 🟡 | Some budget authority |
| Engineer (Network Engineer, Security Engineer) |  | =(B5/B11)*100 | 🟡 | Technical implementers, may influence |
| Analyst (Security Analyst, Systems Analyst) |  | =(B6/B11)*100 | ⬜ | Lower priority, less budget authority |
| Administrator (Sysadmin, Network Admin) |  | =(B7/B11)*100 | ⬜ | Executors, rarely buyers |
| Consultant/Contractor |  | =(B8/B11)*100 | 🟡 | May refer clients |
| Student/Academic |  | =(B9/B11)*100 | ⬜ | Low priority for sales |
| Other/Unknown |  | =(B10/B11)*100 | ⬜ | Needs qualification |
| **Total Leads** | =SUM(B2:B10) | 100% |  |  |

**Focus outreach on:** C-Level and Director categories (top 2 rows)

---

## Consultation Funnel

| Week | Total Leads | Engaged (>2 email opens) | Consultation Requests | Consultations Held | Proposals Sent | Deals Closed | Revenue |
|------|-------------|-------------------------|---------------------|-------------------|---------------|-------------|---------|
| Week 1 |  |  |  |  |  |  | $       |
| Week 2 |  |  |  |  |  |  | $       |
| Week 3 |  |  |  |  |  |  | $       |
| Week 4 |  |  |  |  |  |  | $       |
| **Total** | =SUM(B2:B5) | =SUM(C2:C5) | =SUM(D2:D5) | =SUM(E2:E5) | =SUM(F2:F5) | =SUM(G2:G5) | =SUM(H2:H5) |

**Conversion Rates:**
- Lead → Engaged: =(C6/B6)*100  **Target: >40%**
- Engaged → Consultation Request: =(D6/C6)*100  **Target: 10-15%**
- Request → Held: =(E6/D6)*100  **Target: >80%**
- Held → Proposal: =(F6/E6)*100  **Target: 30-50%**
- Proposal → Closed: =(G6/F6)*100  **Target: 25-40%**

**Overall Lead → Customer:** =(G6/B6)*100

---

## Content Performance

| Content Piece | Type | Date Published | Views | Clicks to Landing Page | CTR | Leads Generated | Cost per Lead |
|---------------|------|---------------|-------|----------------------|-----|-----------------|---------------|
| LinkedIn Launch Post | Social | | | | =(E2/D2)*100 | | =(H2/G2) |
| "3 Overlooked Items" Post | Social | | | | =(E3/D3)*100 | | =(H3/G3) |
| Blog: Complete Checklist Guide | Blog | | | | =(E4/D4)*100 | | =(H4/G4) |
| Twitter Thread | Social | | | | =(E5/D5)*100 | | =(H5/G5) |
| YouTube: Checklist Walkthrough | Video | | | | =(E6/D6)*100 | | =(H6/G6) |
| Reddit: r/networking | Community | | | | =(E7/D7)*100 | | =(H7/G7) |
| LinkedIn Paid Ad Campaign | Paid | | | | =(E8/D8)*100 | | =(H8/G8) |
| **Totals/Averages** | | | =SUM(D2:D8) | =SUM(E2:E8) | =AVERAGE(F2:F8) | =SUM(G2:G8) | =H9/G9 |

**Best performing content:** (Sort by "Leads Generated" to identify)  
**Most cost-effective:** (Sort by "Cost per Lead" lowest to highest)

**Action:** Double down on best performing content types

---

## Social Media Growth

| Week Ending | LinkedIn Followers | LinkedIn Post Impressions | LinkedIn Engagement Rate | YouTube Subscribers | YouTube Views | Twitter Followers |
|-------------|-------------------|-------------------------|------------------------|-------------------|--------------|------------------|
| 2026-02-10  |                   |                         | =(C2/B2)*100           |                   |              |                  |
| 2026-02-17  |                   |                         | =(C3/B3)*100           |                   |              |                  |
| 2026-02-24  |                   |                         | =(C4/B4)*100           |                   |              |                  |
| 2026-03-03  |                   |                         | =(C5/B5)*100           |                   |              |                  |
| **Growth**  | =B5-B2            | =C5-C2                  |                        | =E5-E2            | =F5-F2       | =G5-G2           |

**LinkedIn Engagement Rate Target:** >2% (excellent: >4%)  
**Monthly goals:** +100 LinkedIn followers, +50 YouTube subscribers

---

## ROI Calculation

| Metric | Value | Formula/Notes |
|--------|-------|---------------|
| **COSTS** | | |
| Time invested (hours) |  | Your time + any contractor time |
| Hourly rate | $ | Your billing rate or opportunity cost |
| Total time cost | $ | =B2*B3 |
| Software/tools | $ | ConvertKit, Canva, hosting, etc. |
| Paid advertising | $ | LinkedIn/Google ads spend |
| Design/content creation | $ | Any outsourced work |
| **Total Cost** | **$** | **=SUM(B4:B7)** |
| | | |
| **RESULTS** | | |
| Total leads generated |  | From lead gen metrics |
| Consultations held |  | From consultation funnel |
| Proposals sent |  | From consultation funnel |
| Deals closed |  | From consultation funnel |
| Revenue generated | $ | Total from closed deals |
| | | |
| **METRICS** | | |
| Cost per lead | $ | =B8/B10 |
| Cost per consultation | $ | =B8/B11 |
| Cost per deal | $ | =B8/B13 |
| ROI | % | =((B14-B8)/B8)*100 |
| Payback period | days | (Track time from launch to break-even) |

**Target ROI:** >300% (3x return on investment)  
**Acceptable cost per lead:** $10-50 (varies by industry and deal size)

---

## A/B Testing Log

| Test # | Element Tested | Variant A | Variant B | Winner | Improvement | Date | Notes |
|--------|---------------|-----------|-----------|--------|-------------|------|-------|
| 1 | Landing page headline | "Download Your Free Network Security Checklist" | "Get Your Free Network Security Checklist" | | | | |
| 2 | CTA button text | "Send Me The Checklist" | "Download Now" | | | | |
| 3 | Email subject (Email 1) | "Your Network Security Checklist [PDF Inside]" | "[FirstName], your checklist is ready" | | | | |
| 4 | Form fields | Name+Email+Company | Email only | | | | |
| 5 | Landing page image | Checklist preview | Generic security image | | | | |

**Testing discipline:**
- Change ONE element at a time
- Run test until statistical significance (100+ visitors minimum)
- Document winner and implement
- Move to next test

---

## Monthly Summary Dashboard

### Month 1 Summary

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Total leads | 100-200 | | |
| Landing page conversion rate | 25-40% | | |
| Email open rate (avg) | >40% | | |
| Consultations booked | 5-10 | | |
| Proposals sent | 2-4 | | |
| Deals closed | 1-2 | | |
| Revenue | $20,000-50,000 | $ | |
| ROI | >300% | % | |
| LinkedIn followers gained | +100 | | |
| Best performing content | TBD | | |

**Status key:**
- ✅ At or above target
- 🟡 Close to target (within 20%)
- ❌ Below target (needs attention)

---

### Key Insights (Month 1)

**What worked well:**
1. 
2. 
3. 

**What didn't work:**
1. 
2. 
3. 

**Changes for Month 2:**
1. 
2. 
3. 

---

## Lead Scoring Model

Use this to prioritize follow-up:

| Lead Name | Company | Job Title | Company Size | Downloads | Email Opens | Email Clicks | LinkedIn Activity | Score | Priority |
|-----------|---------|-----------|--------------|-----------|-------------|--------------|------------------|-------|----------|
| Example Lead | Example Corp | IT Director | 500 | 1 | 4 | 2 | High | 85 | 🔥 Hot |

**Scoring system:**
- Job Title: C-Level (25 pts), Director (20 pts), Manager (15 pts), Engineer (10 pts), Other (5 pts)
- Company Size: 1000+ (20 pts), 201-1000 (15 pts), 51-200 (10 pts), <50 (5 pts)
- Email Opens: 4+ (20 pts), 2-3 (10 pts), 1 (5 pts), 0 (0 pts)
- Email Clicks: 2+ (15 pts), 1 (10 pts), 0 (0 pts)
- LinkedIn Activity: High (10 pts), Medium (5 pts), None (0 pts)

**Total possible:** 100 points

**Priority tiers:**
- 🔥 Hot (75-100 pts): Immediate personal outreach
- 🟡 Warm (50-74 pts): Targeted email sequence
- ⬜ Cold (25-49 pts): Standard nurture
- ❄️ Unqualified (<25 pts): Archive or basic newsletter only

---

## Quick Reference: Key Benchmarks

| Metric | Good | Great | Excellent |
|--------|------|-------|-----------|
| Landing page conversion | 25% | 35% | 45%+ |
| Email open rate | 35% | 45% | 55%+ |
| Email click rate | 8% | 12% | 15%+ |
| Unsubscribe rate | <3% | <2% | <1% |
| Lead → Consultation | 8% | 12% | 15%+ |
| Consultation → Proposal | 30% | 40% | 50%+ |
| Proposal → Close | 25% | 35% | 45%+ |
| Overall Lead → Customer | 0.5% | 1.5% | 3%+ |
| Cost per lead | <$50 | <$30 | <$15 |
| ROI | 300% | 500% | 800%+ |

Use these to evaluate performance and set improvement targets.

---

## Notes & Action Items

### Week 1:
- [ ] 
- [ ] 
- [ ] 

### Week 2:
- [ ] 
- [ ] 
- [ ] 

### Week 3:
- [ ] 
- [ ] 
- [ ] 

### Week 4:
- [ ] 
- [ ] 
- [ ] 

---

**Remember:** What gets measured gets managed. Update these metrics weekly, review monthly, and optimize continuously.

Data-driven decisions beat gut feelings every time. 📊
