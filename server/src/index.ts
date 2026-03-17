import { WebSocketServer } from "ws";
import { ConversationManager } from "./utils/conversationManager.js";
import { getAIResponse } from "./ai.js";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";

dotenv.config();
const PORT = parseInt(process.env.PORT || "8081");
const wss = new WebSocketServer({ port: PORT });
const manager = new ConversationManager();

wss.on("connection", (ws) => {
    let roomId: string = uuid();

    let aliveTimeout = setTimeout(() => {
        ws.send(JSON.stringify({
            sender: "ai",
            text: "hello, are you still there??",
            timeStamp: Date.now()
        }));
    }, 30000);

    let currentAborter: AbortController | null = null;

    ws.on("message", async (data) => {
        clearTimeout(aliveTimeout);

        // Abort any ongoing AI response
        if (currentAborter) {
            currentAborter.abort();
            currentAborter = null;
        }

        const msg = JSON.parse(data.toString());

        // Mark the previous AI msg as interrupted
        manager.interruptLastAIMessage(roomId);

        // Add user's msg
        manager.addMessage(roomId, { ...msg, id: uuid() });

        currentAborter = new AbortController();

        try {
            // Stream AI response
            await getAIResponse(msg.text, (token) => {
                ws.send(JSON.stringify({
                    sender: "ai",
                    token: token,
                    timeStamp: Date.now()
                }));
            }, currentAborter.signal);

            // Signal stream end so client can finalize the message
            ws.send(JSON.stringify({
                sender: "ai",
                done: true,
                timeStamp: Date.now()
            }));

            currentAborter = null;
        } catch (error: any) {
            if (error.name === "AbortError") {
                // User interrupted — send done signal so client finalizes partial message
                ws.send(JSON.stringify({
                    sender: "ai",
                    done: true,
                    interrupted: true,
                    timeStamp: Date.now()
                }));
            } else {
                console.error("AI Response Error:", error.message);
                ws.send(JSON.stringify({
                    sender: "ai",
                    text: `[Error: ${error.message}]`,
                    timeStamp: Date.now(),
                }));
            }
        }

        aliveTimeout = setTimeout(() => {
            ws.send(JSON.stringify({ sender: "ai", text: "Are you still there?", timeStamp: Date.now() }));
        }, 30000);
    });

    ws.on("close", () => {
        clearTimeout(aliveTimeout);
    });
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);
