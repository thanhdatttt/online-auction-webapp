import { useState } from 'react';
import { X, Minimize2, Send } from 'lucide-react';
import { MESSAGES } from './chatData';

export default function ChatWindow({ conversation, onClose, onMinimize }) {
    const [message, setMessage] = useState('');
    const messages = MESSAGES[conversation.id] || [];

    const handleSend = () => {
        if (message.trim()) {
            console.log('Sending message:', message);
            setMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="w-80 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col">
            {/* Header */}
            <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-secondary rounded-t-lg">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <img
                        src={conversation.avatar}
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
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-light">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[70%] ${msg.isMine ? 'order-2' : 'order-1'}`}>
                            <div
                                className={`px-3 py-2 rounded-2xl ${
                                msg.isMine
                                    ? 'bg-blue-500 text-light'
                                    : 'bg-light text-dark border border-gray-300'
                                }`}
                            >
                                <p className="text-sm wrap-break-word">{msg.text}</p>
                            </div>
                            <p className={`text-xs text-gray-500 mt-1 ${msg.isMine ? 'text-right' : 'text-left'}`}>
                                {msg.timestamp}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-200 bg-light rounded-b-lg">
                <div className="flex items-end gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 bg-gray-200 text-dark rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!message.trim()}
                        className="bg-blue-600 text-light cursor-pointer p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}