import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../stores/useAuth.store.js";

// gg authen success page
const AuthSuccessPage = () => {
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const fetchUser = useAuthStore((state) => state.fetchMe);

  // get token from gg url callback
  const params = new URLSearchParams(window.location.search);
  const token = params.get("accessToken");

  useEffect(() => {
      // set token and get user info after authen with gg
      const handleAuth = async () => {
        if (token) {
          // set access token
          setAccessToken(token);
          
          // get user info
          try {
            await fetchUser();
            navigate("/home");
          } catch (err) {
            navigate("/signin");
          }
        } else {
          navigate("/signin");
        }
      }

      handleAuth();
  }, [token]);

  return <div className="flex h-screen items-center justify-center text-4xl text-black font-semibold">Sign in with Google...</div>;
}

export default AuthSuccessPage;