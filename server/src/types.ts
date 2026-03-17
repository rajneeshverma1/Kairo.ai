export interface Message {
    id: string;
    sender: "user" | "ai";
    text: string;
    timestamp: number;
    interrupted?: boolean;
}