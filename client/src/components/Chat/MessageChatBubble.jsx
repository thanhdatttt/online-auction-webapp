import { useState } from 'react';
import { MessageCircle, X, Minimize2, Send, Search } from 'lucide-react';

// Dummy data
const CONVERSATIONS = [
    {
        id: 1,
        name: 'John Doe',
        avatar: 'https://i.pravatar.cc/150?img=1',
        lastMessage: 'Hey! How are you doing?',
        timestamp: '2m ago',
        unread: 2,
        online: true
    },
    {
        id: 2,
        name: 'Sarah Wilson',
        avatar: 'https://i.pravatar.cc/150?img=5',
        lastMessage: 'Thanks for the help!',
        timestamp: '1h ago',
        unread: 0,
        online: true
    },
    {
        id: 3,
        name: 'Mike Johnson',
        avatar: 'https://i.pravatar.cc/150?img=12',
        lastMessage: 'See you tomorrow',
        timestamp: '3h ago',
        unread: 0,
        online: false
    },
    {
        id: 4,
        name: 'Emma Brown',
        avatar: 'https://i.pravatar.cc/150?img=9',
        lastMessage: 'Got it, thanks!',
        timestamp: '1d ago',
        unread: 1,
        online: false
    }
];

const MESSAGES = {
    1: [
        { id: 1, senderId: 1, text: 'Hey! How are you doing?', timestamp: '10:30 AM', isMine: false },
        { id: 2, senderId: 'me', text: 'Hi! I\'m doing great, thanks!', timestamp: '10:32 AM', isMine: true },
        { id: 3, senderId: 1, text: 'That\'s awesome! Want to grab coffee later?', timestamp: '10:33 AM', isMine: false }
    ],
    2: [
        { id: 1, senderId: 'me', text: 'Hey Sarah, did you get my email?', timestamp: '9:15 AM', isMine: true },
        { id: 2, senderId: 2, text: 'Yes! Thanks for the help!', timestamp: '9:20 AM', isMine: false }
    ],
    3: [
        { id: 1, senderId: 3, text: 'Meeting at 3pm tomorrow?', timestamp: 'Yesterday', isMine: false },
        { id: 2, senderId: 'me', text: 'Perfect! See you then', timestamp: 'Yesterday', isMine: true },
        { id: 3, senderId: 3, text: 'See you tomorrow', timestamp: 'Yesterday', isMine: false }
    ],
    4: [
        { id: 1, senderId: 'me', text: 'Can you review the document?', timestamp: 'Monday', isMine: true },
        { id: 2, senderId: 4, text: 'Got it, thanks!', timestamp: 'Monday', isMine: false }
    ]
};

function ConversationList({ onSelectConversation, onClose }) {
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
                        className="w-full pl-10 pr-4 py-2 bg-light text-dark rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                    <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
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

function ChatWindow({ conversation, onClose, onMinimize }) {
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
            <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-blue-600 rounded-t-lg">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <img
                        src={conversation.avatar}
                        alt={conversation.name}
                        className="w-8 h-8 rounded-full"
                        />
                        {conversation.online && (
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm text-white">{conversation.name}</h4>
                        {conversation.online && (
                            <p className="text-xs text-blue-100">Active now</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={onMinimize}
                        className="text-white hover:bg-blue-700 p-1 rounded"
                    >
                        <Minimize2 size={16} />
                    </button>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-blue-700 p-1 rounded"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[70%] ${msg.isMine ? 'order-2' : 'order-1'}`}>
                            <div
                                className={`px-3 py-2 rounded-2xl ${
                                msg.isMine
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-900 border border-gray-200'
                                }`}
                            >
                                <p className="text-sm break-words">{msg.text}</p>
                            </div>
                            <p className={`text-xs text-gray-500 mt-1 ${msg.isMine ? 'text-right' : 'text-left'}`}>
                                {msg.timestamp}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
                <div className="flex items-end gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!message.trim()}
                        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function MessengerChatBubble() {
    const [isListOpen, setIsListOpen] = useState(false);
    const [openChats, setOpenChats] = useState([]);
    const [minimizedChats, setMinimizedChats] = useState([]);

    const handleSelectConversation = (conversation) => {
        // Check if chat is already open
        const isOpen = openChats.find(chat => chat.id === conversation.id);
        const isMinimized = minimizedChats.find(chat => chat.id === conversation.id);

        if (isMinimized) {
            // Restore from minimized
            setMinimizedChats(prev => prev.filter(chat => chat.id !== conversation.id));
            if (!isOpen) {
                setOpenChats(prev => [...prev, conversation]);
            }
        } else if (!isOpen) {
            // Open new chat
            setOpenChats(prev => [...prev, conversation]);
        }
        
        setIsListOpen(false);
    };

    const handleCloseChat = (conversationId) => {
        setOpenChats(prev => prev.filter(chat => chat.id !== conversationId));
        setMinimizedChats(prev => prev.filter(chat => chat.id !== conversationId));
    };

    const handleMinimizeChat = (conversation) => {
        setOpenChats(prev => prev.filter(chat => chat.id !== conversation.id));
        if (!minimizedChats.find(chat => chat.id === conversation.id)) {
            setMinimizedChats(prev => [...prev, conversation]);
        }
    };

    const handleRestoreChat = (conversation) => {
        setMinimizedChats(prev => prev.filter(chat => chat.id !== conversation.id));
        if (!openChats.find(chat => chat.id === conversation.id)) {
            setOpenChats(prev => [...prev, conversation]);
        }
    };

    return (
        <div className="fixed bottom-0 right-6 z-50 flex items-end gap-3">
            {/* Open chat windows */}
            {openChats.map((chat, index) => (
                <div key={chat.id} style={{ marginRight: index * 10 }}>
                    <ChatWindow
                        conversation={chat}
                        onClose={() => handleCloseChat(chat.id)}
                        onMinimize={() => handleMinimizeChat(chat)}
                    />
                </div>
            ))}

            {/* Minimized chats */}
            {minimizedChats.map((chat) => (
                <button
                key={chat.id}
                onClick={() => handleRestoreChat(chat)}
                className="bg-white rounded-t-lg shadow-lg px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                    <div className="relative">
                        <img
                        src={chat.avatar}
                        alt={chat.name}
                        className="w-8 h-8 rounded-full"
                        />
                        {chat.online && (
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                    </div>
                    <span className="font-semibold text-sm">{chat.name}</span>
                </button>
            ))}

            {/* Conversation list */}
            {isListOpen && (
                <ConversationList
                onSelectConversation={handleSelectConversation}
                onClose={() => setIsListOpen(false)}
                />
            )}

            {/* Main button */}
            {!isListOpen && (
                <button
                onClick={() => setIsListOpen(true)}
                className="bg-primary text-light cursor-pointer p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all hover:scale-110 mb-6"
                >
                    <MessageCircle size={24} />
                </button>
            )}
        </div>
    );
}