# CV Agent

An AI-powered, interactive CV builder. Chat with an AI agent to build a
professional, ATS-friendly resume — with a live preview that updates in real
time and a one-click PDF export.

![Stack](https://img.shields.io/badge/Next.js%2016-000000?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white)
![lucide](https://img.shields.io/badge/lucide-react-7964c9?logo=lucide&logoColor=white)

## Features

- **Landing page** — a clean, modern overview of how the interactive CV builder works.
- **Guided AI chat (`/builder`)** — the agent walks you step by step through
  your target role, contact details, summary, skills, work experience,
  education, projects and certifications.
- **Structured CV state** — every answer is parsed into structured JSON that
  drives the preview; your progress is persisted to `localStorage`.
- **Live preview pane** — a split-screen layout: chat on the left, a real-time
  professional, ATS-friendly CV template on the right.
- **PDF export** — download a high-quality, print-ready PDF using
  `html2pdf.js` (client-side rendering).

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page, or
jump straight to [http://localhost:3000/builder](http://localhost:3000/builder)
to start building a CV.

### Scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start the development server         |
| `npm run build`    | Create a production build            |
| `npm run start`    | Run the production build             |
| `npm run lint`     | Lint the codebase with ESLint        |

## Project Structure

```
src/
├── app/
│   ├── page.tsx            # Landing page
│   ├── layout.tsx          # Root layout + fonts
│   ├── globals.css         # Tailwind CSS v4 + global styles
│   └── builder/
│       └── page.tsx        # /builder route
├── components/
│   ├── landing/            # Navbar, Hero, Features, HowItWorks, CTA, Footer
│   └── builder/
│       ├── BuilderClient.tsx   # Chat state + split-screen layout
│       ├── ChatPanel.tsx       # Chat UI with typing indicator + suggestions
│       ├── PreviewPanel.tsx    # Scale-to-fit live preview + completeness
│       ├── CVTemplate.tsx      # ATS-friendly template (also the PDF source)
│       └── ExportButton.tsx    # PDF download trigger
└── lib/
    ├── types.ts           # CV data model + chat types
    ├── cv.ts              # Empty CV, parsers (email, phone, dates, skills...)
    ├── agent.ts           # The guided conversation agent (step machine)
    └── export-pdf.ts      # html2pdf.js export helper
```

## How the agent works

The current agent is a **deterministic, rule-based step machine** — no external
API keys are required, so the app works out of the box. Each step asks a
targeted question and uses lightweight parsers in `src/lib/cv.ts` to extract
structured data (name, email, phone, date ranges, skills, etc.) into the CV
state.

To plug in a real LLM later, replace `processUserMessage` in `src/lib/agent.ts`
with a call to your model of choice while keeping the same return shape
(`{ state, cv, messages, done }`), and the rest of the UI stays unchanged.

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router, React 19, Turbopack)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com)
- [lucide-react](https://lucide.dev) for icons
- [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) for PDF export

## License

MIT
