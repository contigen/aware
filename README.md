## Inspiration

This project was inspired by the increasing number of scams targeting seniors. The goal was to create a simple, easy-to-use tool that could help older adults quickly identify potential online threats, like phishing emails and fake links, without feeling overwhelmed. The idea was to provide peace of mind and make the internet a safer place for them.

## What it does

The web app analyses texts, emails and whatnots using AI to prevent potential scam opportunities.

## How I built it

The project was built using the Next.js app router, utilising Gemini AI to analyse the text via Vercel AI SDK, Radix UI for the base UI components with Tailwind CSS for styling. The AI analyzes emails or messages to identify potential scams, by checking for phishing patterns, dangerous links, and suspicious requests for personal information.

## Challenges I ran into

One of the biggest challenges was getting structured data from the AI that could easily be displayed on the frontend. Making sure the information was understandable and actionable for users without overcomplicating things took some extra effort. But ultimately, it was worth it to ensure a smooth user experience.

## Accomplishments that I'm proud of

I'm grateful for being able to bring the app to fruition, generally speaking; from ideation to building & deploying, anything could go(have gone) wrong.

Particularly, the whole app UI looks good

## What I learned

One of the main lessons was understanding how to build something accessible to a non-technical audience. It became clear that making technology both powerful and simple requires extra thought in terms of design and user experience. There was a lot learned about structuring data for better integration with the frontend and ensuring the results were presented in a clear, understandable way.

## What's next for Aware

- A platform to report confirmed scams
- Adding speech synthesis to read AI analysis, for accessibility and improved UX
- Enabling Generative UI in the AI chat interface for a more interactive experience
- Validating any suspicious URL extracted in a suspicious text against an external service

## Tech stack

- Next.js App Router
- TypeScript
- Gemini AI
- Vercel AI SDK
- TailwindCSS
- Radix UI
- Zod to provide schema for AI structured output

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
