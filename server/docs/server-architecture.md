# Server Architecture and Core Concepts

Here is a comprehensive breakdown of the server folder and every core concept implemented in it. At a high level, this is a Node.js + TypeScript WebSocket Server designed to handle real-time chat interactions between a user and an AI model using the Google Gemini API.

## 1. Project Configuration & Setup
*   **package.json**: This defines your project metadata, scripts, and dependencies. 
    *   **Module System**: It's configured with "type": "module", meaning it uses modern ECMAScript Modules (import/export) rather than typical Node CommonJS (require). 
    *   **Dependencies**: Includes 'ws' for WebSockets, '@google/genai' to interface with the AI, 'uuid' for generating unique identifiers, and 'dotenv' to manage secret environment variables.
    *   **Scripts**: It has scripts like 'npm run dev' that compile the TypeScript code ('tsc') and then execute the output from the 'dist/index.js' file.
*   **tsconfig.json**: Controls how TypeScript compiles your code. It's set up to read '.ts' files from the 'src/' directory and compile them into standard JavaScript into the 'dist/' directory. It uses the 'nodenext' module resolution, which strictly enforces modern Node.js standards (like requiring '.js' extensions in imports, even in '.ts' files).

## 2. The Core Application (src/index.ts)
This is the heart of your server.
*   **WebSocket Server**: It initializes a WebSocket Server (wss) listening on port 8081. Unlike standard HTTP REST APIs that open and close a connection per request, WebSockets keep a persistent, two-way, real-time connection open between the client (like a web browser) and this server.
*   **Connection Handling**: Whenever a client connects (wss.on("connection")):
    *   A unique string (roomId) is generated via uuid() to track this specific chat session.
    *   The server immediately greets the client with a welcome message from the "ai".
*   **Idle Timeout ("Alive Timer")**: A setTimeout is instantiated for 30 seconds. If the user doesn't send a message over the WebSocket within that time, the server will proactively send a ping: "hello, are you still there??".
*   **Message Processing**: When the server receives a message from the client (ws.on("message")):
    *   The idle timer is reset (clearTimeout).
    *   The message data is parsed from JSON.
    *   Since it's a real-time chat, if the AI was previously typing a long message and the user interrupted by sending a new prompt, the system flags the AI's old message as "interrupted" (handled by the ConversationManager).
    *   Your user message is saved to the history.
    *   **AI Invocation**: It then calls getAIResponse() from ai.ts, passing the user's text and a callback function. As the AI generates text (or finishes), the callback uses ws.send(JSON.stringify(...)) to shoot the AI's response down the WebSocket back to the client.
    *   **Error Catching**: If the Gemini API fails (e.g., quota limits or auth errors), a comprehensive catch block intercepts the Axios/API error and gracefully sends a clean error message back to the client instead of crashing the server.

## 3. AI Integration (src/ai.ts)
*   **Setup**: It loads the .env file via dotenv.config() to securely grab the GEMINI_API_KEY.
*   **The Client**: It creates a new instance of the GoogleGenAI library.
*   **getAIResponse Function**: This function takes the user prompt and a callback (onToken). It calls the Gemini API requesting content from the "gemini-3-flash-preview" model. Currently, it retrieves the generated text and utilizes the callback function to yield the response.text.
    *   *Note on the code:* There are comments related to streaming the response token-by-token. Currently, it fires the callback with the whole response at once rather than chunking it out. 

## 4. Logic Utilities (src/utils/conversationManager.ts)
This file acts as the in-memory database for tracking chat history.
*   **ConversationManager Class**: It manages an array representing all active conversations.
*   **Adding Messages**: The addMessage method associates incoming messages to the specific roomId. If it's a new connection, it creates a new empty array to house the messages.
*   **Retrieving History**: getConversation(roomId) returns the chain of messages for a chat.
*   **Interruption Logic**: The interruptLastAIMessage method is a very useful concept for real-time generative interfaces. If a user gets impatient and sends a new message while the AI was generating its previous thought, this function tags "interrupted = true" on the final AI message object stored in history.

## 5. Type Definitions (src/types.ts)
Because this is TypeScript, strict data structures are enforced.
*   **Message Interface**: Defines exactly what a chat message should look like across your entire application. It must possess an id, a sender (limited to strictly "user" or "ai" strings), the text payload, a UNIX timestamp, and the optional boolean interrupted flag.

### Summary of the Flow:
1. User connects -> Server creates roomId, says "Welcome".
2. User sends "Hello" -> Server clears idle timer -> Server logs user's "Hello" into memory.
3. Server asks GoogleGenAI what to say -> AI says "Hi there!".
4. Server logs AI's "Hi there!" into memory -> Server sends "Hi there!" to User via WebSocket.
5. If user goes quiet for 30s -> Server checks in, "Are you still there?".
