export const CONVERSATIONS = [
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

export const MESSAGES = {
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