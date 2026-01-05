import { useState, useEffect, useRef } from 'react';
import { X, Minimize2, Send } from 'lucide-react';
import api from '@/utils/axios';
import { useAuthStore } from '@/stores/useAuth.store';
import { socket } from '@/utils/socket';

export default function ChatWindow({ conversation, onClose, onMinimize }) {
    const { user } = useAuthStore();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [nextCursor, setNextCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const isFirstLoad = useRef(true);

    const fetchMessages = async (cursor = null) => {
        try {
            setLoading(true);
            // Save scroll position before loading older messages
            const container = chatContainerRef.current;
            const previousHeight = container?.scrollHeight || 0;

            console.log(conversation.id);
            const res = await api.get(`/chat/${conversation.id}`, {
                params: { cursor }
            });


            const { messages: newMessages, nextCursor: newCursor } = res.data;

            setMessages(prev => cursor ? [...newMessages, ...prev] : newMessages);
            setNextCursor(newCursor);
            setHasMore(!!newCursor);

            // Restore scroll position if loading older messages
            if (cursor && container) {
                // We use requestAnimationFrame to ensure DOM has updated
                requestAnimationFrame(() => {
                    container.scrollTop = container.scrollHeight - previousHeight;
                });
            } else if (isFirstLoad.current) {
                scrollToBottom();
                isFirstLoad.current = false;
            }

        } catch (error) {
            console.error("Failed to load messages", error);
        } finally {
            setLoading(false);
        }
    };

    const handleScroll = () => {
        const container = chatContainerRef.current;
        if (!container || loading || !hasMore) return;

        // If user scrolls to top (within 50px), load more
        if (container.scrollTop < 50) {
            fetchMessages(nextCursor);
        }
    };

    const handleSend = async () => {
        if (!newMessage.trim()) return;
        
        const textToSend = newMessage;
        setNewMessage(''); // Clear input immediately

        try {
            const res = await api.post(`/chat/${conversation.id}`, {
                text: textToSend
            });

            // If your backend socket emits back to the sender too, 
            // you might not need this line to avoid duplicates.
            // But usually, it's safer to append your own message immediately:
            // setMessages(prev => [...prev, res.data]); 
            // scrollToBottom();
            
            // IMPORTANT: If you rely ONLY on socket to receive your own message,
            // ensure your backend emits to the sender as well.
        } catch (error) {
            console.error("Failed to send message", error);
            // Optional: Restore text to input on failure
            setNewMessage(textToSend); 
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        fetchMessages();
        // Join the conversation room (optional, depending on your socket logic)
        // socket.emit('joinConversation', conversation.id); 
    }, [conversation.id]);


    useEffect(() => {
        const handleNewMessage = (msg) => {
            // Only append if the message belongs to THIS conversation
            if (msg.conversationId === conversation.id) {
                setMessages(prev => [...prev, msg]);
                scrollToBottom();
            }
        };

        socket.on('newMessage', handleNewMessage);
        return () => socket.off('newMessage', handleNewMessage);
    }, [conversation.id]);

    return (
        <div className="w-80 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col">
            {/* Header */}
            <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-secondary rounded-t-lg">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <img
                        src={conversation.avatar || "./default_person.webp"}
                        alt={conversation.name}
                        className="w-8 h-8 rounded-full"
                        />
                        {conversation.online && (
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-light"></div>
                        )}
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm text-light">{conversation.name}</h4>
                        {conversation.online && (
                            <p className="text-xs text-blue-100">Active now</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={onMinimize}
                        className="text-light cursor-pointer p-1 rounded"
                    >
                        <Minimize2 size={16} />
                    </button>
                    <button
                        onClick={onClose}
                        className="text-light cursor-pointer p-1 rounded"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div ref={chatContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-4 space-y-3 bg-light">
                {loading && hasMore && (
                    <div className="text-center py-2">
                        <span className="text-xs text-gray-400">Loading history...</span>
                    </div>
                )}

                {messages.map((msg, idx) => {
                    const isMine = msg.senderId?._id === user?._id || msg.senderId === user?._id;

                    return (
                        <div
                            key={msg._id || idx}
                            className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[70%] ${isMine ? 'order-2' : 'order-1'}`}>
                                <div
                                    className={`px-3 py-2 rounded-2xl ${
                                    isMine
                                        ? 'bg-blue-500 text-light'
                                        : 'bg-light text-dark border border-gray-300'
                                    }`}
                                >
                                    <p className="text-sm wrap-break-word">{msg.text}</p>
                                </div>
                                <p className={`text-xs text-gray-500 mt-1 ${isMine ? 'text-right' : 'text-left'}`}>
                                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-200 bg-light rounded-b-lg">
                <div className="flex items-end gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 bg-gray-200 text-dark rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!newMessage.trim()}
                        className="bg-blue-600 text-light cursor-pointer p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}