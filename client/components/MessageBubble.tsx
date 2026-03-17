import { Message } from "@/types/type";
import React from 'react';

// Formatter to match standard time (e.g., 2:35 PM)
const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).format(date);
};

export function MessageBubble({ message, isStreaming = false }: { message: Message, isStreaming?: boolean }) {
    const isUser = message.sender === "user";
    const timeString = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).format(new Date(message.timeStamp || Date.now()));

    return (
        <div className={`flex w-full mb-6 ${isUser ? "justify-end" : "justify-start"} animate-message-slide`}>
            <div className={`flex flex-col ${isUser ? "items-end max-w-[85%] sm:max-w-[70%]" : "max-w-[85%] sm:max-w-[80%]"}`}>

                {/* Meta details (top) */}
                <div className={`text-[9px] font-mono tracking-widest uppercase mb-1.5 flex items-center gap-1.5 opacity-60 ${isUser ? 'text-gray-500 justify-end' : 'text-gray-500'}`}>
                    {!isUser && <span className="text-orange-500 font-bold">sys</span>}
                    {isUser && <span className="font-bold">usr</span>}
                    <span className="opacity-40">&bull;</span>
                    {timeString}
                </div>

                <div
                    className={`px-4 py-3 relative transition-all duration-300
                    ${isUser
                            ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg rounded-tr-sm"
                            : "bg-black/5 dark:bg-white/5 text-gray-900 dark:text-gray-100 rounded-lg rounded-tl-sm border border-black/5 dark:border-white/5"}`}
                >
                    <div className="text-[13px] leading-relaxed whitespace-pre-wrap font-sans font-medium flex flex-col">
                        <span>{message.text}</span>
                        {isStreaming && (
                            <span className="inline-flex gap-1 items-center mt-2 h-3 opacity-60">
                                <span className="w-1 h-1 rounded-full bg-current animate-pulse" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-1 h-1 rounded-full bg-current animate-pulse" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-1 h-1 rounded-full bg-current animate-pulse" style={{ animationDelay: '300ms' }}></span>
                            </span>
                        )}
                    </div>
                </div>

                {message.interrupted && (
                    <div className="mt-1.5 text-[8px] font-mono font-bold tracking-widest uppercase text-red-500 opacity-80">
                        &lt;signal_lost&gt;
                    </div>
                )}
            </div>
        </div>
    );
}