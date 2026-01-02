import { useState } from 'react';
import { X, Search } from 'lucide-react';
import { CONVERSATIONS } from './chatData';

export default function ConversationList({ onSelectConversation, onClose }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredConversations = CONVERSATIONS.filter(conv =>
        conv.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-80 h-[500px] bg-light rounded-lg shadow-2xl flex flex-col">
            {/* Header */}
            <div className="p-4 border-b bg-primary rounded-t-lg border-gray-200 flex items-center justify-between">
                <h3 className="font-bold text-lg text-light">Chats</h3>
                <button onClick={onClose} className="cursor-pointer text-light hover:text-gray-500">
                    <X size={20} />
                </button>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-gray-200">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-200 text-dark rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conv) => (
                    <button
                        key={conv.id}
                        onClick={() => onSelectConversation(conv)}
                        className="w-full p-3 cursor-pointer hover:bg-decor flex items-center gap-3 transition-colors"
                    >
                        <div className="relative">
                            <img
                                src={conv.avatar}
                                alt={conv.name}
                                className="w-12 h-12 rounded-full"
                            />
                            {conv.online && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-sm truncate text-dark">{conv.name}</span>
                                <span className="text-xs text-gray-500">{conv.timestamp}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                                {conv.unread > 0 && (
                                    <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                                        {conv.unread}
                                    </span>
                                )}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}