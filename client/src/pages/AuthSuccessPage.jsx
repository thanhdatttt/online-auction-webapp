import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../stores/useAuth.store.js";
import { effect } from "zod/v3";

const AuthSuccessPage = () => {
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const params = new URLSearchParams(window.location.search);
  const token = params.get("accessToken");

  useEffect(() => {
      if (token) {
        setAccessToken(token);
        navigate("/home");
      } else {
        navigate("/signin");
      }
  }, [token]);

  return <div>Sign in with Google...</div>;
}

export default AuthSuccessPage;