# Kairo Client Architecture

This document provides an overview of the frontend client architecture for Kairo.

## Technology Stack
- **Framework:** [Next.js](https://nextjs.org/) (App Router format, `app` directory)
- **UI & Styling:** [Tailwind CSS](https://tailwindcss.com/) with a dark-mode first, minimal technical aesthetic.
- **Micro-Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Components:** Modified Shadcn UI components
- **Language:** TypeScript

## Directory Structure

\`\`\`
client/
├── app/                  # Next.js App Router entry points
│   ├── globals.css       # Core styling & Tailwind directives
│   ├── layout.tsx        # Main application layout, theme provider wrapper
│   └── page.tsx          # Initial entry point, renders the ChatWindow
├── components/           # Reusable React components
│   ├── ui/               # Generic UI building blocks
│   ├── common/           # Shared, theme-related components
│   ├── ChatWindow.tsx    # Main chat container logic and layout
│   ├── MessageBubble.tsx # Individual message presentation
│   └── MessageInput.tsx  # Input area for user messages
├── hooks/                # Custom React hooks
│   └── useWebSocket.ts   # Connects & handles real-time messaging logic
├── lib/                  # Utility functions
│   └── utils.ts          # Common utility logic (e.g. className merging)
├── types/                # TypeScript type definitions
│   └── type.ts           # Defines Message, ChatSession interfaces
└── public/               # Static assets
\`\`\`
    
## Key Features & Implementations

### Real-Time Chat (WebSocket)
The application relies strictly on WebSockets for bi-directional communication with the backend. The core logic for this connection resides in the `useWebSocket` hook (`hooks/useWebSocket.ts`).
- Supports user messaging and live character/word streaming from the AI.
- Includes mechanisms for users to interrupt the AI stream.

### Modern Minimalist Aesthetic
The UI uses `next-themes` and relies on Tailwind's configuration (`globals.css`) to maintain a clean, high-contrast, structural feel, characterized by minimal borders and subdued colors.

### Messaging Components
- **ChatWindow:** The overarching container, manages scroll state and uses `useWebSocket`.
- **MessageBubble:** Responsible for rendering user vs AI messages, handling interrupted states and the visual formatting of the message.
- **MessageInput:** Handles text input and the triggering of the WebSocket send function.

## Running the Application
Ensure dependencies are installed via `npm install`.
Start the development server using:
\`\`\`bash
npm run dev
\`\`\`
The application will be accessible at `http://localhost:3000`.
