import { useLocation } from "react-router";
import { useAuthStore } from "@/stores/useAuth.store";
import MessengerChatBubble from "./MessageChatBubble";

export default function ChatBubbleWrapper() {
    const location = useLocation();
    const { user } = useAuthStore();
    
    // Pages where chat bubble should NOT appear
    const excludedPaths = [
      '/signin',
      '/signup',
      '/forgotPassword',
      '/auth/success',
      '/dashboard'
    ];
    
    // Check if current path should be excluded
    const isExcluded = excludedPaths.some(path => 
      location.pathname.startsWith(path)
    );
    
    // Only show if user is logged in AND not on excluded pages
    if (!user || isExcluded) return null;
    
    return <MessengerChatBubble />;
}