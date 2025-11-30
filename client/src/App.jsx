import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AuthSuccessPage from "./pages/AuthSuccessPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AuctionDetailPage from "./pages/AuctionDetailPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* defaut route */}
        <Route index element={<Navigate to={"/home"} />} />

        {/* routes */}
        {/* public route */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/auth/success" element={<AuthSuccessPage />} />

        <Route path="/home" element={<HomePage />} />
        <Route
          path="/auction/:id"
          element={<AuctionDetailPage></AuctionDetailPage>}
        />
        {/* protected route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
