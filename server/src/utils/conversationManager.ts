import type { Message } from "../types.js";

interface Conversation {
    roomId: string;
    messages: Message[];
}

export class ConversationManager {
    private conversations: Conversation[] = [];

    getConversation(roomId: string): Message[] {
        const convo = this.conversations.find(c => c.roomId === roomId);
        //Linear search to find the  room &&& Returns conversation history
        //returb history / message
        return convo ? convo.messages : [];
    }
    //If it doesn’t exist, creates a new conversation for that room.
    addMessage(roomId: string, message: Message) {
        let convo = this.conversations.find(c => c.roomId === roomId);

        if (!convo) {
            convo = { roomId, messages: [] };
            this.conversations.push(convo);
        }

        convo.messages.push(message);
    }

    //Finds the last message in a conversation.

    //If the last message is from the AI, it marks it as interrupted = true.

    //Useful in streaming chat scenarios where the AI is generating a response and the user wants to stop it mid-way.

    interruptLastAIMessage(roomId: string) {
        const convo = this.conversations.find(c => c.roomId === roomId);
        if (!convo || convo.messages.length === 0) return;

        const lastMessage = convo.messages[convo.messages.length - 1];
        // @ts-ignore
        if (lastMessage.sender === "ai") {
            // @ts-ignore

            lastMessage.interrupted = true;
        }
    }
}