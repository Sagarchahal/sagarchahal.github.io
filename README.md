# AgentBiz AI — Agent-run digital service studio (prototype)

**One-line pitch:** AgentBiz AI is a prototype for a small digital studio that helps local businesses plan a simple landing page through a structured intake → draft → quality review → business log workflow.

## What is implemented

- Responsive dashboard with overview, orders, agent roles, services, reports and client checkout views.
- Local demo order creation and a four-stage deterministic JavaScript workflow.
- Template-based draft deliverables for portfolio copy, landing-page starters and project showcase packs.
- Quality checklist, downloadable `.txt` deliverables and browser-local order persistence.
- Client order form that creates a service summary and a clearly labeled **simulated checkout event**. No card details are requested or stored, no payment provider is contacted, and no money moves.
- A small-business service offer and pilot business model displayed in the Services view.

## Run locally

1. Download and extract `AgentBizAI_v3.zip`.
2. Open the extracted `AgentBizAI` folder in VS Code.
3. Open `index.html` in Chrome, or use VS Code Live Server.
4. Open **Client checkout** in the left navigation.
5. Use fictional demo details, fill in the service request and click **Create demo checkout**.
6. Review the quote, then click **Simulate test checkout**. The UI explicitly records `SIMULATED ONLY — NOT PAID`.
7. Open **Orders** to see the local order record. Try the workflow and download the draft deliverable too.

> This is a front-end prototype. Do not enter real customer personal information. The order data is saved in the browser's local storage and is not sent to a server.

## Business model hypothesis

### Target customer
Local tutors, salons, repair shops, home-service providers and solo professionals who need a clear mobile-friendly web presence but may not need a large custom website.

### First offer
A one-page website starter: headline and service copy, service list, contact call-to-action, links/map placeholder, basic responsive page structure and a handoff checklist. A human must review the copy, links, accessibility and business claims before publishing.

### Pilot prices to validate (India)
- ₹999 — copy + page outline
- ₹2,499 — one-page static site starter
- ₹499/month — optional small content update

These are proposed experiment prices, not verified market rates, existing sales, or guaranteed income. Before charging, interview at least five potential customers, agree on scope and turnaround, publish clear refund/revision terms, and deliver one sample with permission. Track actual costs and only count revenue after a genuine payment is verified.

### Customer acquisition experiment
1. Make one clearly labeled sample page for a fictional business.
2. Ask 5–10 local business owners for feedback; do not spam them.
3. Show the sample and offer a fixed scope with a delivery date.
4. Get written approval of price, scope, revisions and refund terms.
5. When ready for real sales, use a reputable payment provider with hosted checkout and server-side payment verification. Never collect or store card numbers, CVVs, UPI PINs or passwords in this app.

## Truthful feature status

| Feature | Status |
|---|---|
| Dashboard and local order records | Implemented in browser |
| Agent handoff sequence | Simulated with local JavaScript |
| Draft generation | Local templates, not an AI model |
| Quality checks | Basic deterministic checklist |
| Customer order form | Local sandbox only |
| Checkout | Simulated event only; **not a real payment** |
| Backend, login, database, live AI API | Not implemented |
| Live website deployment for customers | Not implemented |
| Verified customers or revenue | None claimed |

## Submission materials

See `DEMO_SCRIPT.md` for a 90-second demo walkthrough and `GITHUB_SUBMISSION.md` for repository/publishing steps. Record your own screen and voice; only show the working features above. Never claim that the prototype already earns money or has autonomous live AI agents.

## Suggested next technical phase

1. Build a small backend and store secrets in environment variables.
2. Connect an AI API through the backend, with input/output logs and rate limits.
3. Add human approval before content is sent or published.
4. Add a real database and server-side validation.
5. Integrate a payment provider's test mode first; verify webhooks server-side before considering a payment paid.
6. Add consent, privacy notice, retention/deletion controls and tests before onboarding real customers.

## 30-second pitch

“AgentBiz AI explores how a tiny digital service business could coordinate work through specialist agents. In this prototype, a customer can submit a sample brief, review a quote, run a four-step draft-and-quality workflow, and download a deliverable. Checkout is deliberately simulated. The next milestone is a secure backend, live AI integration and verified customer validation.”
