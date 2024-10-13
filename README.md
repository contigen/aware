# <img src='./src/app/shield-logo.png' alt='logo for aware'/> Aware

A scam detection web app that helps senior citizens identify potential scams in texts and images using AI.

## Inspiration

This project was inspired by the increasing number of scams targeting seniors. The goal was to create a simple, easy-to-use tool that could help older adults quickly identify potential online threats, like phishing emails and fake links, without feeling overwhelmed. The idea was to provide peace of mind and make the internet a safer place for them.

## How I built it

The project was built using the Next.js app router, utilising Gemini AI to analyse the text via Vercel AI SDK, Radix UI for the base UI components provided by [shadcn/ui](https://ui.shadcn.com), with Tailwind CSS for styling. The AI analyses emails or messages to identify potential scams, by checking for phishing patterns, dangerous links, and suspicious requests for personal information.

## Features

- Input handling for text and images with drag-and-drop, click-to-upload, copy-and-paste via the Clipboard API.
- Text & image analysis capabilities for both quick and in-depth analysis interfaces using Gemini AI via the Vercel AI SDK.
- Speech-to-text in the indepth-analysis chat UI to improve UX & accessibility.
- Text-to-speech to read analysis results.
- Print analysis result using the `react-to-print` library.

## What I learned

One of the main lessons was understanding how to build something accessible to a non-technical audience. It became clear that making technology both powerful and simple requires extra thought in terms of design and user experience. There was a lot learned about structuring data for better integration with the frontend and ensuring the results were presented in a clear, understandable way.

## What's next for Aware

- A platform to report confirmed scams
- Enabling Generative UI in the AI chat interface for a more interactive experience
- Validating any suspicious URL extracted in a suspicious text against an external service

## Tech stack

- Next.js App Router
- TypeScript
- Gemini AI
- Vercel AI SDK
- TailwindCSS
- Radix UI
- Zod schema for AI structured output

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
