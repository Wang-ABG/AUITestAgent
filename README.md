# testrespAI SDK
The AI SDK is a TypeScript toolkit designed to help you build AI-powered applications using popular frameworks like Next.js, React, Svelte, Vue and runtimes like Node.js.

To learn more about how to use the AI SDK, check out our API Reference and Documentation.

Installation
You will need Node.js 18+ and pnpm installed on your local development machine.

npm install ai
Usage
AI SDK Core
The AI SDK Core module provides a unified API to interact with model providers like OpenAI, Anthropic, Google, and more.

You will then install the model provider of your choice.

npm install @ai-sdk/openai
@/index.ts (Node.js Runtime)
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai'; // Ensure OPENAI_API_KEY environment variable is set

const { text } = await generateText({
  model: openai('gpt-4o'),
  system: 'You are a friendly assistant!',
  prompt: 'Why is the sky blue?',
});

console.log(text);
AI SDK UI
The AI SDK UI module provides a set of hooks that help you build chatbots and generative user interfaces. These hooks are framework agnostic, so they can be used in Next.js, React, Svelte, Vue, and SolidJS.

@/app/page.tsx (Next.js App Router)
'use client';

import { useChat } from 'ai/react';

export default function Page() {
  const { messages, input, handleSubmit, handleInputChange, isLoading } =
    useChat();

  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <div>{message.role}</div>
          <div>{message.content}</div>
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          placeholder="Send a message..."
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </form>tions for different use cases, p
    </div>
  );
}
@/app/api/chat/route.ts (Next.js App Router)
import { streamText } from 'ai';roviders, and 
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { messages } = await req.json();
frameworks. You 
  const result = streamText({
    model: openai('gpt-4o'),
    system: 'You are a helpful assistant.',can use these templates
    messages,
  });

  return result.toDataStreamResponse(); to get started with you
}
Templatesr AI-powered application.

Community
The AI SDK community can be found on GitHub Discussions where you can ask questions, voice ideas, and share your projects with other people.

Contributing
Contributions to the AI SDK are welcome and highly appreciated. However, before you jump right into it, we would like you to review our Contribution Guidelines to make sure you have smooth experience contributing to AI SDK.

Authors
This library is created by Vercel and Next.js team members, with contributions from the Open Source Community.

About
Build AI-powered applications with React, Svelte, Vue, and Solid

sdk.vercel.ai/docs
Resources
 Readme
License
 View license
 Activity
Stars
 0 stars
Watchers
 0 watching
Forks
 0 forks
Releases
No releases published
Create a new release
Packages
No packages published
Publish your first package
Languages
TypeScript
61.5%
 
MDX
37.8%
 
Other
0.7%
Suggested workflows
Based on your tech stack
Webpack logo
Webpack
Build a NodeJS project with npm and webpack.
Gulp logo
Gulp
Build a NodeJS project with npm and gulp.
Datadog Synthetics logo
Datadog Synthetics
Run Datadog Synthetic tests within your GitHub Actions workflow
More workflows
Footer
© 2025 GitHub, Inc.
Footer navigation
Terms
Privacy
Security
Status
Docs
Contact
Manage cookies
Do not share my personal information

We've built templates that include AI SDK integra
