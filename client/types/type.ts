export interface Message {
    id: string;
    sender: "ai" | "user";
    text: string;
    timeStamp: number;
    interrupted?: boolean;
    interruptedAt?: number;
}

export interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    updatedAt: number;
}