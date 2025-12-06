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

function App() {
  return (
    <>
      {/* toaster */}
      <Toaster 
        position="top-right"
        richColors 
        closeButton
      />
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

          <Route path="/home" element={<HomePage />} />
          {/* protected route */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="/auctions/:id"
              element={<AuctionDetailPage></AuctionDetailPage>}
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
