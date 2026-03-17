# Kairo

Kairo is a real-time chat application featuring a Next.js frontend and a Node.js WebSocket server, integrating the Google Gemini API for AI-assisted conversations. 

## How It Works: Frontend to Backend Flow

The application relies on a persistent WebSocket connection for real-time, bi-directional communication between the client and the server.

1.  **Connection Initialization**: When a user opens the Next.js frontend application, the `useWebSocket` hook establishes a connection to the WebSocket server running on port 8081.
2.  **Session Creation**: Upon connection, the backend generates a unique `roomId` using UUID to track the specific chat session. The server immediately sends an initial greeting from the AI to the client.
3.  **User Input**: The user types a message into the frontend's `MessageInput` component.
4.  **Message Transmission**: When sent, the frontend transmits the message data, including sender information and a timestamp, over the WebSocket connection.
5.  **Backend Processing**:
    *   The server receives the message.
    *   An idle timer (set to ping the user after 30 seconds of inactivity) is reset.
    *   The backend's `ConversationManager` logs the user's message into its in-memory store for the current `roomId`.
    *   If the AI was previously generating a response and the user sent a new message, the server flags the previous AI message as "interrupted".
6.  **AI Invocation**: The server sends the user's prompt to the Google Gemini API using the `@google/genai` SDK.
7.  **Response Delivery**: The AI's generated response is received by the server and dispatched back to the frontend via the WebSocket.
8.  **UI Update**: The frontend receives the AI's response data, updates the local chat state, and renders the message using the `MessageBubble` components.

## Tech Stack

### Frontend (Client)
*   **Framework**: Next.js (App Router)
*   **Library**: React 19
*   **Styling**: Tailwind CSS v4
*   **Animations**: Framer Motion
*   **Icons**: Lucide React
*   **Components**: Radix UI primitives and Custom (Shadcn-inspired)

### Backend (Server)
*   **Environment**: Node.js
*   **Language**: TypeScript
*   **Real-time Communication**: `ws` (WebSockets)
*   **AI Integration**: `@google/genai` (Google Gemini API)
*   **Environment Variables**: `dotenv`

## Installation and Setup

To run Kairo locally, you need to set up both the server and the client. Ensure you have Node.js installed on your machine.

### 1. Server Setup

First, initialize the backend WebSocket server.

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Set up environment variables
# Copy .env.example to .env and add your Google Gemini API key
cp .env.example .env

# Open .env in your text editor and set:
# GEMINI_API_KEY=your_api_key_here

# Start the development server
npm run dev
```

The WebSocket server will start and listen on port 8081.

### 2. Client Setup

Open a new terminal window to start the frontend application.

```bash
# Navigate to the client directory from the project root
cd client

# Install dependencies
npm install

# Start the Next.js development server
npm run dev
```

The frontend application will be available at `http://localhost:3000`. Open this URL in your browser to start using Kairo.
