import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
import { Toaster } from "sonner";
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AuthSuccessPage from "./pages/AuthSuccessPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AuctionDetailPage from "./pages/AuctionDetailPage.jsx";
import ForgotPassPage from "./pages/ForgotPassPage.jsx";
import AuctionPage from "./pages/AuctionPage.jsx";

import { useAuthStore } from "./stores/useAuth.store.js";
import useTimeStore from "./stores/useTime.store.js";
import { useEffect } from "react";

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
        <Routes>
          {/* defaut route */}
          <Route index element={<Navigate to={"/home"} />} />

          {/* routes */}
          {/* public route */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgotPassword" element={<ForgotPassPage />} />
          <Route path="/auth/success" element={<AuthSuccessPage />} />
          <Route
            path="/auctions/:id"
            element={<AuctionDetailPage></AuctionDetailPage>}
          />
          <Route path="/auctions" element={<AuctionPage />} />

          <Route path="/home" element={<HomePage />} />
          {/* protected route */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
