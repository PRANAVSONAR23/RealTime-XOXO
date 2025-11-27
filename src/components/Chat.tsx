import { MessageCircle, Send, Smile, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { ChatMessage } from "../types/game";

interface ChatProps {
    roomCode: string;
    currentPlayerName: string;
    socket: Socket | null;
}

const Chat: React.FC<ChatProps> = ({ socket, roomCode, currentPlayerName }) => {
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isSideBarOpen, setIsSideBarOpen] = useState(window.innerWidth > 768);

    const emojis = [
        "😀",
        "😂",
        "😍",
        "🤔",
        "😎",
        "🔥",
        "👍",
        "👎",
        "❤️",
        "🎉",
        "😢",
        "😡",
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            socket?.emit("send-message", {
                roomCode: roomCode,
                message: newMessage,
                playerName: currentPlayerName,
            });
            setNewMessage("");
            setShowEmojiPicker(false);
        }
    };

    const addEmoji = (emoji: string) => {
        setNewMessage((prev) => prev + emoji);
        setShowEmojiPicker(false);
    };

    const handleNewMessage = useCallback(
        (message: ChatMessage) => {
            setMessages((prev) => [
                ...prev,
                { ...message, isRead: isSideBarOpen },
            ]);
        },
        [isSideBarOpen],
    );

    useEffect(() => {
        if (!socket) return;
        socket.on("new-message", handleNewMessage);

        return () => {
            socket.off("new-message", handleNewMessage);
        };
    }, [handleNewMessage, socket]);

    const handleSidebarToggle = () => {
        if (!isSideBarOpen) {
            setMessages((prev) =>
                prev.map((message) => ({
                    ...message,
                    isRead: !isSideBarOpen,
                })),
            );
        }
        setIsSideBarOpen(!isSideBarOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsSideBarOpen(window.innerWidth > 768);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div
            className={`fixed top-0 right-0 h-dvh transform border-l border-white/20 bg-gradient-to-b from-white/5 to-white/10 backdrop-blur-xl transition-all duration-300 md:static md:h-full ${
                isSideBarOpen
                    ? "w-full translate-x-0 sm:w-[350px]"
                    : "w-0 translate-x-full"
            }`}
        >
            <button
                className={`absolute z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 md:hidden ${isSideBarOpen ? "top-3 right-4" : "top-[72px] -left-12"} ${messages.some((m) => !m.isRead) ? "animate-pulse bg-pink-500" : ""} ${isSideBarOpen && messages.some((m) => !m.isRead) ? "bg-white/10" : ""} backdrop-blur-2xl hover:bg-white/30`}
                onClick={handleSidebarToggle}
            >
                {isSideBarOpen ? (
                    <X className="size-6 text-white" />
                ) : (
                    <MessageCircle className="size-6 text-white" />
                )}
            </button>
            <div className="relative flex h-full flex-col overflow-hidden">
                {/* Enhanced Chat Header */}
                <div className="border-b border-white/20 bg-gradient-to-r from-white/5 to-white/10 px-6 py-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <MessageCircle className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">
                                    Live Chat
                                </h3>
                                <p className="text-sm text-white/60">
                                    {messages.length} messages
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Messages */}
                <div className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-transparent to-white/5 p-6">
                    {messages.length === 0 ? (
                        <div className="flex h-full flex-1 flex-col justify-center py-12 text-center">
                            <MessageCircle className="mx-auto mb-4 h-16 w-16 text-white/20" />
                            <div className="mb-2 text-lg font-medium text-white/50">
                                No messages yet
                            </div>
                            <p className="text-sm text-white/30">
                                Start the conversation and connect with your
                                opponent!
                            </p>
                        </div>
                    ) : (
                        messages.map((message, index) => (
                            <div
                                key={message.id}
                                className={`animate-fade-in-up ${
                                    message.playerName === currentPlayerName
                                        ? "ml-6"
                                        : "mr-6"
                                }`}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div
                                    className={`group relative ${
                                        message.playerName === currentPlayerName
                                            ? "flex justify-end"
                                            : "flex justify-start"
                                    }`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-xl p-4 transition-all duration-300 hover:scale-105 ${
                                            message.playerName ===
                                            currentPlayerName
                                                ? "border border-purple-400/40 bg-gradient-to-br from-purple-500/30 to-pink-500/30 text-white shadow-lg"
                                                : "border border-white/20 bg-white/15 text-white shadow-lg backdrop-blur-sm"
                                        }`}
                                    >
                                        <div className="mb-2 flex items-center justify-between gap-4">
                                            <span
                                                className={`text-xs font-bold ${
                                                    message.playerName ===
                                                    currentPlayerName
                                                        ? "text-purple-200"
                                                        : "text-white/80"
                                                }`}
                                            >
                                                {message.playerName ===
                                                currentPlayerName
                                                    ? "You"
                                                    : message.playerName}
                                            </span>
                                            <span className="font-mono text-xs text-white/50">
                                                {message.timestamp}
                                            </span>
                                        </div>
                                        <p className="text-sm leading-relaxed break-words">
                                            {message.message}
                                        </p>

                                        {/* Message glow effect */}
                                        <div
                                            className={`pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 ${
                                                message.playerName ===
                                                currentPlayerName
                                                    ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20"
                                                    : "bg-white/10"
                                            }`}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Enhanced Message Input */}
                <div className="border-t border-white/20 bg-gradient-to-r from-white/5 to-white/10 p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 pr-24 text-sm text-white placeholder-white/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 focus:border-transparent focus:ring-2 focus:ring-purple-400 focus:outline-none"
                                maxLength={200}
                            />

                            {/* Emoji Picker Button */}
                            <button
                                type="button"
                                onClick={() =>
                                    setShowEmojiPicker(!showEmojiPicker)
                                }
                                className="absolute top-1/2 right-12 -translate-y-1/2 transform text-white/60 transition-colors duration-300 hover:scale-110 hover:text-white"
                            >
                                <Smile className="h-5 w-5" />
                            </button>

                            {/* Send Button */}
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="absolute top-1/2 right-2 -translate-y-1/2 transform rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-2 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:from-purple-600 hover:to-pink-600 disabled:cursor-not-allowed disabled:from-gray-500 disabled:to-gray-600"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Emoji Picker */}
                        {showEmojiPicker && (
                            <div className="animate-fade-in rounded-xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-xl">
                                <div className="grid grid-cols-6 gap-2">
                                    {emojis.map((emoji, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => addEmoji(emoji)}
                                            className="rounded-lg p-2 text-3xl transition-all duration-300 hover:scale-125 hover:bg-white/20"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Character Counter */}
                        <div className="flex items-center justify-between text-xs text-white/50">
                            <span>Press Enter to send</span>
                            <span
                                className={
                                    newMessage.length > 180
                                        ? "text-red-400"
                                        : ""
                                }
                            >
                                {newMessage.length}/200
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chat;
