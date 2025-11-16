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

function App() {
  return (
    <Router>
      <Routes>
        {/* defaut route */}
        <Route index element={<Navigate to={"/signin"} />} />

          {/* routes */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          <Route path="/auth/success" element={<AuthSuccessPage />} />

          <Route element={<ProtectedRoute/>}>
            <Route path="/home" element={<HomePage />}/>
            <Route path="/profile" element={<ProfilePage />}/>
          </Route>
      </Routes>
    </Router>
  );
}

export default App;
