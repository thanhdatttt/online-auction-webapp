import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
  useLocation
} from "react-router-dom";
import { Toaster } from "sonner";
import { useAuthStore } from "./stores/useAuth.store.js";
import useTimeStore from "./stores/useTime.store.js";
import { useEffect } from "react";

import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AuthSuccessPage from "./pages/AuthSuccessPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AuctionDetailPage from "./pages/AuctionDetailPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import ForgotPassPage from "./pages/ForgotPassPage.jsx";
import AuctionPage from "./pages/AuctionPage.jsx";
import CreateAuctionPage from "./pages/CreateAuctionPage.jsx";
import InstructionPage from "./pages/InstructionPage.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import MessengerChatBubble from "./components/Chat/MessageChatBubble.jsx";

function ChatBubbleWrapper() {
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


function App() {
  // reload info user from refresh token

  useEffect(() => {
    const { accessToken, refresh, fetchMe } = useAuthStore.getState();

    const recover = async () => {
      if (!accessToken) {
        await refresh();
      } else {
        await fetchMe();
      }
    };

    recover();
  }, []);

  const startClock = useTimeStore((state) => state.startClock);

  useEffect(() => {
    startClock();
  }, []);

  return (
    <>
      {/* toaster */}
      <Toaster position="top-right" richColors closeButton />
      {/* routes */}
      <Router>
        <ScrollToTop/>
        <Routes>
          {/* defaut route */}
          <Route index element={<Navigate to={"/home"} />} />

          {/* routes */}
          {/* public route */}
          {/* authentication */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgotPassword" element={<ForgotPassPage />} />
          <Route path="/auth/success" element={<AuthSuccessPage />} />

          {/* guest route */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/instructions" element={<InstructionPage/>}/>
          <Route
            path="/auctions/:id"
            element={<AuctionDetailPage></AuctionDetailPage>}
          />
          <Route path="/auctions" element={<AuctionPage />} />

          {/* protected route */}
          <Route element={<ProtectedRoute />}>
            <Route path="/auctions/create" element={<CreateAuctionPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/dashboard" element={<DashboardPage />}></Route>
          </Route>
      </Routes>

      <ChatBubbleWrapper />
    </Router>
    </>
  );
}

export default App;
