"use client"
import { useState, useRef, useEffect } from "react"
import useWebSocket from "../hooks/useWebSocket"
import { MessageInput } from "@/components/MessageInput"
import { MessageBubble } from "@/components/MessageBubble"
import { Plus, Menu, X, ArrowUpRight } from "lucide-react"
import { ToggleTheme } from "@/components/ui/toggle-theme";

// A single Chat Tab Component that maintains its own websocket connection and state
function ChatTabContent({ isActive }: { isActive: boolean }) {
    const { messages, currentAI, sendMessage, connected } =
        useWebSocket(process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8081")

    const scrollRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current && isActive) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, currentAI, isActive])

    // Hide if not active to keep connection alive
    return (
        <div className={`flex flex-col h-full bg-transparent transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0 hidden"}`}>
            <header className="px-6 py-4 flex items-center justify-between border-b border-black/5 dark:border-white/5 bg-white/40 dark:bg-black/20 backdrop-blur-3xl sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-orange-500 shadow-[0_0_8px_rgba(255,130,50,0.6)]' : 'bg-red-500'}`}></span>
                    <div>
                        <h2 className="text-sm font-sans font-medium text-gray-900 dark:text-gray-100 tracking-tight md:ml-0 ml-5">Kairo.sys</h2>
                        <p className="text-[9px] text-gray-500 font-mono mt-0.5 uppercase tracking-widest md:ml-0 ml-5">
                            {connected ? "Connection active" : "Offline"}
                        </p>
                    </div>
                </div>
            </header>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scroll-smooth"
            >
                {messages.length === 0 && connected && (
                    <div className="flex h-full items-center justify-center animate-message-slide">
                        <div className="text-center space-y-3 max-w-sm">
                            <h3 className="text-xl font-sans font-medium text-gray-900 dark:text-gray-100 tracking-tight">
                                System Initialization
                            </h3>
                            <p className="text-[11px] font-mono text-gray-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
                                Ready for input.
                            </p>
                        </div>
                    </div>
                )}

                {messages.map(msg => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}

                {currentAI && (
                    <MessageBubble
                        message={{
                            id: "streaming-ai",
                            sender: "ai",
                            text: currentAI,
                            timeStamp: Date.now()
                        }}
                        isStreaming={true}
                    />
                )}
            </div>

            <div className="shrink-0 relative z-30 pb-4">
                <MessageInput onSend={sendMessage} />
            </div>
        </div>
    )
}

// Main Window managing multiple tabs
interface Tab {
    id: string;
    title: string;
}

export function ChatWindow() {
    const [tabs, setTabs] = useState<Tab[]>([{ id: "default", title: "sys_session_01" }]);
    const [activeTabId, setActiveTabId] = useState("default");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Apply dark mode and mesh class
    useEffect(() => {
        document.body.classList.add('body-mesh');
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const handleNewChat = () => {
        const newId = Date.now().toString();
        const newIndex = (prev: Tab[]) => prev.length < 9 ? `0${prev.length + 1}` : prev.length + 1;
        setTabs(prev => [...prev, { id: newId, title: `sys_session_${newIndex(prev)}` }]);
        setActiveTabId(newId);
        setIsSidebarOpen(false);
    }

    return (
        <div className="flex h-screen w-full bg-transparent overflow-hidden selection:bg-orange-200 selection:text-black dark:selection:bg-orange-900/40 dark:selection:text-white">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 md:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50
                w-[240px] bg-white/60 dark:bg-[#09090a]/80 backdrop-blur-3xl border-r border-black/5 dark:border-white/5
                transform transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col
                ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"}
            `}>
                <div className="px-5 py-6 flex justify-between items-center bg-transparent border-b border-black/5 dark:border-white/5">
                    <h1 className="text-sm font-sans font-semibold text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-2">
                        <ArrowUpRight size={14} className="text-orange-500" strokeWidth={2} />
                        KAIRO.SYS
                    </h1>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="md:hidden p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="px-4 py-4">
                    <button
                        onClick={handleNewChat}
                        className="w-full flex items-center justify-center gap-2 bg-transparent border border-black/10 dark:border-white/10 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md font-mono text-[10px] uppercase tracking-widest transition-all hover:bg-black/5 dark:hover:bg-white/5"
                    >
                        <Plus size={12} strokeWidth={2} />
                        Init_Session
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5 mt-2">
                    <div className="text-[9px] font-mono text-gray-400 dark:text-gray-600 px-3 pb-2 uppercase tracking-widest">
                        Active Logs
                    </div>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTabId(tab.id);
                                setIsSidebarOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 transition-all duration-200 rounded-md flex items-center font-mono text-[11px]
                                ${activeTabId === tab.id
                                    ? "bg-black/5 dark:bg-white/5 text-gray-900 dark:text-gray-100 font-medium"
                                    : "bg-transparent text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                }`}
                        >
                            <span className="truncate">{tab.title}</span>
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t border-black/5 dark:border-white/5">
                    <div className="ml-10 text-xs"> <ToggleTheme /></div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 relative bg-white/30 dark:bg-transparent backdrop-blur-[2px]">
                {/* Mobile Header */}
                <div className="md:hidden absolute top-0 left-0 w-full p-4 flex z-30 pointer-events-none">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 bg-white/60 dark:bg-[#0c0c0d]/80 backdrop-blur-xl text-gray-900 dark:text-white pointer-events-auto rounded-md shadow-sm border border-black/5 dark:border-white/5"
                    >
                        <Menu size={16} />
                    </button>
                </div>

                {tabs.map(tab => (
                    <ChatTabContent
                        key={tab.id}
                        isActive={activeTabId === tab.id}
                    />
                ))}
            </main>
        </div>
    )
}