"use client";
import React, { useState, useRef, useEffect } from "react";
import { SendHorizontal } from 'lucide-react';

interface MessageInputProps {
    onSend: (text: string) => void;
}

export function MessageInput({ onSend }: MessageInputProps) {
    const [text, setText] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSend = () => {
        if (text.trim()) {
            onSend(text.trim());
            setText("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <div className="p-4 bg-transparent border-t-0 pb-6 px-4 transition-colors">
            <div className="max-w-2xl mx-auto flex items-center gap-2 bg-white/40 dark:bg-[#1c1c1a]/40 backdrop-blur-3xl rounded-md p-1.5 border border-black/10 dark:border-white/10 shadow-sm focus-within:ring-1 focus-within:ring-orange-500/30 focus-within:border-orange-500/30 transition-all duration-300">
                <input
                    ref={inputRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter command..."
                    className="flex-1 bg-transparent px-3 py-1.5 outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400/80 dark:placeholder-gray-500/80 font-mono text-[11px] font-medium"
                />
                <button
                    onClick={handleSend}
                    disabled={!text.trim()}
                    className="bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-gray-900 dark:text-white disabled:text-gray-300 dark:disabled:text-gray-700 disabled:cursor-not-allowed p-2 rounded-sm transition-all duration-200 flex items-center justify-center"
                >
                    <SendHorizontal size={14} className={text.trim() ? "stroke-orange-500 dark:stroke-orange-400" : ""} strokeWidth={2} />
                </button>
            </div>
            <div className="text-center mt-3 text-[9px] text-gray-400 dark:text-gray-600 font-mono uppercase tracking-widest">
                VERIFY SYNTHESIS
            </div>
        </div>
    );
}