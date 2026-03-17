"use client"
import { useEffect, useState, useRef, useCallback } from "react"
import { Message } from "@/types/type"
import { v4 as uuid } from "uuid"

const RECONNECT_DELAY = 3000

export default function useWebSocket(url: string) {
    const [messages, setMessages] = useState<Message[]>([])
    const [connected, setConnected] = useState(false)
    const [currentAI, setCurrentAI] = useState<string>("")

    const currentAIId = useRef<string | null>(null)
    const currentAIText = useRef<string>("")
    const socketRef = useRef<WebSocket | null>(null)
    const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const shouldReconnect = useRef(true)

    const finalizeAIMessage = useCallback((interrupted = false) => {
        if (currentAIId.current && currentAIText.current) {
            setMessages(prev => [
                ...prev,
                {
                    id: currentAIId.current!,
                    sender: "ai",
                    text: currentAIText.current,
                    timeStamp: Date.now(),
                    interrupted,
                },
            ])
        }
        setCurrentAI("")
        currentAIId.current = null
        currentAIText.current = ""
    }, [])

    const connect = useCallback(() => {
        if (socketRef.current?.readyState === WebSocket.OPEN) return

        const ws = new WebSocket(url)
        socketRef.current = ws

        ws.onopen = () => {
            setConnected(true)
            if (reconnectTimer.current) {
                clearTimeout(reconnectTimer.current)
                reconnectTimer.current = null
            }
        }

        ws.onclose = () => {
            setConnected(false)
            socketRef.current = null
            if (shouldReconnect.current) {
                reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY)
            }
        }

        ws.onerror = () => {
            // onerror always fires before onclose — let onclose handle reconnect
            ws.close()
        }

        ws.onmessage = (event) => {
            const msg: Message & { token?: string; done?: boolean; interrupted?: boolean } = JSON.parse(event.data)

            if (msg.sender === "ai" && msg.done) {
                finalizeAIMessage(msg.interrupted ?? false)
            } else if (msg.sender === "ai" && msg.token !== undefined) {
                if (!currentAIId.current) {
                    currentAIId.current = uuid()
                }
                currentAIText.current += msg.token
                setCurrentAI(currentAIText.current)
            } else if (msg.sender === "ai" && msg.text !== undefined) {
                setMessages(prev => [...prev, { ...msg, id: msg.id || uuid() }])
            }
        }
    }, [url, finalizeAIMessage])

    useEffect(() => {
        shouldReconnect.current = true
        connect()

        return () => {
            shouldReconnect.current = false
            if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
            socketRef.current?.close()
            socketRef.current = null
        }
    }, [connect])

    const sendMessage = useCallback((text: string) => {
        const ws = socketRef.current
        if (!ws || ws.readyState !== WebSocket.OPEN) return

        if (currentAIId.current) {
            finalizeAIMessage(true)
        }

        const newMsg: Message = {
            id: uuid(),
            sender: "user",
            text,
            timeStamp: Date.now()
        }

        setMessages(prev => [...prev, newMsg])
        ws.send(JSON.stringify(newMsg))
    }, [finalizeAIMessage])

    return { messages, currentAI, sendMessage, connected, finalizeAIMessage }
}
