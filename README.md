# StudyMate AI — Alexa+-inspired learning co-pilot

StudyMate AI is a web prototype for a conversational study assistant. It demonstrates a simulated Alexa+-style experience: a learner can ask for help, create a study mission, add tasks, start a focus timer, open a web search, and practise with a quiz. It is a hackathon prototype, not an official Amazon or Alexa product.

## Features

- Responsive dark dashboard with animated assistant orb.
- Mission Control task list with local browser persistence.
- Focus timer with 15/25/45 minute presets, pause/resume, reset, and a 5-minute break.
- Adaptive study-plan builder with goal-based steps and an action to add steps as tasks.
- Chat interface with browser speech recognition when supported.
- Quick quiz with answer feedback and a small built-in sample question bank.
- Google search action opens a new tab; the app does not scrape or summarize live Google results.
- Optional server-side AI integration using an OpenAI-compatible Chat Completions API. The API key stays in the server environment, not in browser code.
- Demo mode works without an API key; demo responses are rule-based and visibly labelled.

## Run locally (Node.js 18+)

1. Extract this ZIP and open the `StudyMate-AI` folder in VS Code.
2. Install Node.js 18 or newer if needed.
3. Open a terminal in this folder and run:

   ```bash
   npm start
   ```

4. Open `http://localhost:3000` in your browser. Do not open `index.html` directly if you want the backend status/API routes to work.
5. Without an API key, the app runs in **Demo Mode**. The timer, tasks, planner, quiz, and built-in sample assistant responses work locally.

## Enable live AI (optional)

1. Copy `.env.example` to a new file named `.env`.
2. Put your own API key in `OPENAI_API_KEY=`. You may optionally change `OPENAI_MODEL` to a model available to your account.
3. Run `npm start` again, then refresh the page.
4. Keep `.env` private and never upload it to GitHub or include it in your submission ZIP. API usage may incur charges and follows your provider's terms.

The backend sends chat messages and limited task context to the configured AI provider. Do not submit secrets or sensitive personal information. If the API request fails, the UI falls back to demo-mode responses.

## Test checklist

- [ ] Add a task, complete it, delete it, and refresh the page to check persistence.
- [ ] Start, pause, and reset a focus timer; try the break button.
- [ ] Generate a plan and add its steps to Mission Control.
- [ ] Answer a quiz question and generate another question.
- [ ] Try the assistant prompts for a plan, focus timer, task, quiz, and Google search.
- [ ] If configured, confirm the status badge says **Live AI** and try an open-ended study question.
- [ ] Test desktop and mobile widths and browser voice support.

## Hackathon scope and honest limitations

This is a **simulated Alexa+-style web experience**. It is not an official Alexa+ integration, does not connect to gated Alexa+ services, and does not include a real Alexa Agent Skill or MCP server. The optional AI path can produce dynamic assistant replies and one validated UI action per response. The planner and quiz still use local templates/a small sample question bank. Google search opens results in a separate tab; results are not embedded in the app. Browser speech recognition varies by browser and may require microphone permission.

For an Amazon Alexa+ track submission, check the current official rules and eligibility before submitting. Make sure your repository, license, setup instructions, and demo video match the rules. Do not describe demo-mode responses as live AI or claim an official Alexa integration.
