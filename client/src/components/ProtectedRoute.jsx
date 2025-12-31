import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/useAuth.store.js";
import { useEffect, useState } from "react";
import { useWatchListStore } from "../stores/useWatchList.store.js";
import Loading from "./Loading.jsx";

// component to check whether user has authenticated
const ProtectedRoute = ({ roles }) => {
  const { accessToken, refresh, loading, fetchMe, user } = useAuthStore();
  const loadFavoriteIds = useWatchListStore((s) => s.fetchFavoriteIds);

  // is web starting state
  const [starting, setStarting] = useState(true);
  
  // initialze when refresh page or revisited page
  const init = async () => {
    // if no token
    if (!accessToken) {
      await refresh();
    }

    // if no user info
    if (accessToken && !user) {
      await fetchMe();
    }
    loadFavoriteIds();

    setStarting(false);
  };

  useEffect(() => {
    init();
  }, []);

  // when waiting for loading page
  if (starting || loading) {
    return (
      <div className="flex h-screen items-center justify-center text-4xl text-black font-semibold">
        <Loading message="Loading page ..."/>
      </div>
    );
  }

  // if user does not have token -> go to sign in page
  if (!accessToken) {
    return <Navigate to="/signin" replace></Navigate>;
  }

  if (roles && user) {
    if (!roles.includes(user.role)) {
      // User is logged in but doesn't have the right role
      return <Navigate to="/home" replace />;
    }
  }

  return <Outlet></Outlet>;
};

export default ProtectedRoute;
