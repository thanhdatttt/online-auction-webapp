import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import { useAuthStore } from '@/stores/useAuth.store';
import { socket, connectSocket } from '@/utils/socket';

export default function MessengerChatBubble() {
    const {user} = useAuthStore();
    const [isListOpen, setIsListOpen] = useState(false);
    const [openChats, setOpenChats] = useState([]);
    const [minimizedChats, setMinimizedChats] = useState([]);

    const [hasUnread, setHasUnread] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        if (user?._id) {
            connectSocket(user._id);

            // Listen for new conversations (e.g. from Auction end)
            socket.on("newConversation", (newConv) => {
                if (isListOpen) {
                    // If list is open, trigger a refresh to show it
                    setRefreshTrigger(prev => prev + 1);
                } else {
                    // If list is closed, show notification dot
                    setHasUnread(true);
                }
            });

            // Listen for incoming messages
            socket.on("newMessage", (msg) => {
                if (!isListOpen) {
                    setHasUnread(true);
                } else {
                    // If list is open, refresh to update "last message" text
                    setRefreshTrigger(prev => prev + 1);
                }
            });
        }

        return () => {
            socket.off("newConversation");
            socket.off("newMessage");
        };
    }, [user, isListOpen]);

    // Clear unread indicator when list is opened
    useEffect(() => {
        if (isListOpen) {
            setHasUnread(false);
        }
    }, [isListOpen]);

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
                refreshTrigger={refreshTrigger}
                />
            )}

            {/* Main button */}
            {!isListOpen && (
                <div className='relative mb-6'>
                    <button
                    onClick={() => setIsListOpen(true)}
                    className="bg-primary text-light cursor-pointer p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all hover:scale-110 mb-6"
                    >
                        <MessageCircle size={24} />
                    </button>

                    {hasUnread && (
                        <span className="absolute top-0 right-0 block h-4 w-4 rounded-full ring-2 ring-white bg-red-500 transform translate-x-1 -translate-y-1 animate-pulse"></span>
                    )}
                </div>
            )}
        </div>
    );
}