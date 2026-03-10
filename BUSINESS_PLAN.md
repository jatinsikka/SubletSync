# SubletSync — Business Plan

> "Subletting is broken. We fixed it."
> Last updated: March 2026

---

## What It Is

SubletSync is a **verified sublease marketplace** for students and young professionals across the US. It connects people who need to sublet their apartment with people who need a short-term place to live — safely, legally, and without Venmo-and-pray.

SubletSync is a **platform/marketplace**, not a party to any sublease agreement. The same legal model used by Airbnb, Craigslist, and Facebook Marketplace. We connect people. We do not own, rent, or guarantee any property.

---

## The Problem We Solve

Every summer, millions of students and young professionals need short-term housing. The current options are:

- **Facebook groups**: Zero verification. Scams everywhere.
- **Craigslist**: No trust signals. Dangerous for deposits.
- **GroupMe/Discord**: Chaos. No legal protection.
- **Zillow/Apartments.com**: Built for year-long leases. Not subleases.

None of these were built for subleasing. SubletSync is.

---

## Target Market

**Primary**: College students at 500+ US universities subletting for summer internships, study abroad return, or semester gaps.

**Secondary**: Recent grads, young professionals, and interns who need short-term housing in college towns.

**Market size**: ~4 million college students sublet or seek a sublet each year in the US. Average sublet value: $900–1,800/month.

---

## How The Money Works

### Revenue Streams

| Stream | Mechanic | Price | Margin |
|---|---|---|---|
| **Platform fee** | 5% charged to subletter on each escrow transaction | Per deal | ~2% after Stripe's ~3% |
| **Featured listing** | Boosted placement in search results for 30 days | $9.99 | ~100% |
| **Premium membership** | Unlimited listings, priority search, instant match alerts | $7.99/mo | ~100% |
| **ID Verified badge** | One-time government ID check via Stripe Identity | $3.00 | $1.50 (Stripe takes $1.50) |

### Revenue Projection

| Monthly transactions | Avg deposit | Platform fee (5%) | Your cut (~2%) |
|---|---|---|---|
| 50 | $1,000 | $2,500 | ~$1,000 |
| 200 | $1,000 | $10,000 | ~$4,000 |
| 500 | $1,100 | $27,500 | ~$11,000 |

Premium + featured listings stack on top of this.

---

## How Escrow Works (Stripe Connect)

**The critical rule**: You never touch user money. Ever. That requires a money transmitter license (expensive, state-by-state). Instead, Stripe holds it.

### Flow
1. Subletter finds a listing and agrees to terms
2. Subletter pays first month's deposit through SubletSync (powered by Stripe Connect)
3. Stripe holds the funds in a payment hold — not in your account
4. On confirmed move-in date, Stripe releases funds to the lister's connected Stripe account
5. SubletSync's 5% platform fee is automatically deducted before release
6. If the listing falls through (lister's fault), Stripe automatically refunds the subletter

### Why This Works Legally
- Stripe is a licensed money transmitter in all 50 states
- Stripe is PCI-DSS Level 1 compliant (highest security standard)
- SubletSync never holds, touches, or has access to user funds
- Stripe's Terms of Service govern the payment relationship — not ours

### Cost Structure
- Stripe charges: 2.9% + $0.30 per transaction
- SubletSync charges users: 5% platform fee
- Net margin: ~2% per transaction (approximately)

---

## Verification System (Tiered Trust)

We don't restrict to .edu only — that cuts out recent grads, professionals, and international students. Instead, we use a **tiered trust score system**. More verification = higher trust score = more platform access.

### Trust Tiers

| Tier | Badge | How to get it | Platform access |
|---|---|---|---|
| **Guest** | None | Email signup | Browse listings only |
| **Member** | Gray check | Phone SMS verification | Browse + message listers |
| **Student Verified** | Blue 🎓 | .edu email confirmed | Post listings + full access |
| **Pro Verified** | Orange 💼 | LinkedIn OAuth OR corporate email domain | Same as Student + "Pro" badge |
| **ID Verified** | Gold ✅ | Stripe Identity government ID check ($3 fee) | Highest trust score, featured in search |

### How Each Verification Works

**Phone verification** (free tier)
- Twilio SMS sends a 6-digit OTP
- ~$0.0075/SMS cost — absorbed by platform at this stage
- Standard across every major app (Uber, Venmo, etc.)

**.edu email** (free)
- Supabase confirms the email domain ends in `.edu`
- Auto-detects university name from domain
- Instantly grants Student Verified badge

**LinkedIn OAuth** (free)
- User clicks "Connect LinkedIn"
- OAuth confirms real name, real employer/school, real profile
- SubletSync never stores LinkedIn credentials
- Grants Pro Verified badge

**Corporate email detection** (free)
- Any non-.edu non-Gmail/Yahoo/Hotmail domain (e.g., `@google.com`, `@deloitte.com`) is flagged as professional
- Auto-grants Pro Verified badge
- Zero cost — just a domain check

**Government ID — Stripe Identity** ($3 to user, $1.50 to Stripe)
- Stripe handles capture, verification, and storage of the ID
- SubletSync never sees, stores, or processes the ID document
- Stripe's liability, not ours
- User pays $3 one-time fee to unlock "ID Verified" gold badge

### Why This Beats .edu Only
- Recent grads can verify via LinkedIn
- International students can verify via phone + LinkedIn
- Professionals verify via work email or LinkedIn
- Scammers don't bother with multiple verification hoops
- Legitimate users will — that's the filter

---

## Legal Protection Strategy

### The Platform Model (Section 230 CDA)
SubletSync is a **marketplace**, not a landlord, sublease party, or guarantor. Section 230 of the Communications Decency Act protects platforms from liability for user-generated content and user actions. This is the same protection used by:
- Airbnb
- Craigslist
- Facebook Marketplace
- Zillow

**What this means**: If a user posts a fraudulent listing, that's on the user — not SubletSync — as long as we aren't actively involved in the fraud.

### Documents Needed (in order of priority)

1. **Terms of Service** — Generate free at Termly.io. Must include:
   - SubletSync is a marketplace, not a party to any sublease
   - Limitation of liability (capped at amount user paid SubletSync)
   - Mandatory arbitration clause (prevents class-action lawsuits)
   - User is responsible for independently verifying listings
   - SubletSync may suspend accounts for fraud/abuse

2. **Privacy Policy** — Generate free at Termly.io. Must include:
   - What data we collect and why
   - How long we retain it
   - User's right to delete their data
   - CCPA (California) and GDPR (EU) compliance
   - We never sell user data

3. **Platform Disclaimer** — Visible on every listing page:
   > "SubletSync is a platform that connects sublessors and sublessees. SubletSync is not a party to any sublease agreement and does not guarantee the accuracy of any listing. Escrow payments are processed and held by Stripe, Inc. Identity verification is powered by Stripe Identity."

### When To Form an LLC
- Do it once you hit $500/month in revenue
- Protects your personal assets from any lawsuit
- Cost: $50–150 at your state's Secretary of State website
- Until then: operating as a sole proprietor is legally fine for a pre-revenue platform

### What NOT To Claim Until Live
These features are on the landing page and must be backed by real tech before launch to avoid false advertising claims:
- "Escrow-protected deposits" → only claimable once Stripe Connect is connected
- "ID Verified" badge → only claimable once Stripe Identity is live
- "$0 in deposit scams" → only claimable as a stat, not a guarantee

---

## Free Tech Stack (Monthly Cost: ~$0)

| Service | What it does | Free tier |
|---|---|---|
| **Supabase** | Database, auth, file storage | 500MB DB, 50k MAU, 1GB storage |
| **Netlify / GitHub Pages** | Hosting | Unlimited static sites |
| **Stripe** | Payments, escrow, ID verification | No monthly fee — pay per transaction |
| **Twilio** | SMS phone verification | Free trial credits to start |
| **LinkedIn OAuth** | Professional verification | Free developer API |
| **Resend** | Email notifications | 3,000 emails/month free |
| **GitHub** | Code hosting | Free |
| **Namecheap** | Domain | ~$10/year |

**Total monthly cost: ~$1 (domain amortized)**

---

## Launch Roadmap

### Phase 1 — Now (Free, No Payments)
- [ ] Deploy site to Netlify/Vercel
- [ ] Connect Supabase (real database)
- [ ] Enable .edu email + phone verification
- [ ] Add LinkedIn OAuth
- [ ] Generate and publish Terms of Service + Privacy Policy
- [ ] Add platform disclaimer to every listing page
- [ ] Build user base — collect signups, let people browse + post

**Goal**: 500 users, 100 listings, 5 active cities

### Phase 2 — Month 2 (Turn On Revenue)
- [ ] Connect Stripe Connect for escrow payments
- [ ] Enable 5% platform fee on transactions
- [ ] Launch Featured Listings ($9.99/30 days)
- [ ] File LLC once hitting $500/month

**Goal**: First $1,000 in revenue

### Phase 3 — Month 4 (Verification Upgrade)
- [ ] Add Stripe Identity ($3 ID Verified badge)
- [ ] Launch Premium Membership ($7.99/month)
- [ ] Add lifestyle matching questionnaire
- [ ] Expand to 20+ active cities

**Goal**: $5,000/month revenue, 2,000 users

### Phase 4 — Month 6+ (Scale)
- [ ] University partnerships (housing office referrals)
- [ ] Corporate partnerships (Amazon, Google, Deloitte intern housing)
- [ ] Mobile app (React Native)
- [ ] Automated sublease agreement generation

---

## Competitive Advantage

| What we have | Why it matters |
|---|---|
| Multi-method verification | Broader than .edu-only, safer than nothing |
| Stripe escrow | No Venmo risk — legally protected deposits |
| Date-exact search | Built for internship/sublease timelines |
| Lifestyle matching | Reduces roommate conflict |
| Platform disclaimer model | Legal protection without expensive lawyers |
| Zero monthly cost | Profitable from first transaction |

---

## Key Risks & Mitigations

| Risk | Mitigation |
|---|---|
| User posts fraudulent listing | Terms of Service, platform disclaimer, Stripe Identity verification, account suspension system |
| Stripe dispute / chargeback | Signed sublease agreement in app is evidence. Stripe's dispute process handles it. |
| Data breach | Supabase handles encryption at rest. We never store payment info (Stripe does). Stripe stores IDs. |
| Regulatory action (money transmission) | We never hold funds. Stripe does. Their license, their liability. |
| Low initial liquidity (few listings) | Demo listings visible to non-logged-in users. Targeted launch in 2–3 cities first. |

---

*SubletSync is not a law firm and this document is not legal advice. Consult an attorney before launching payment features.*
