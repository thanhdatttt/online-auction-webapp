import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/useAuth.store.js";
import { useEffect, useState } from "react";

// component to check whether user has authenticated
export default function AdminRoute() {
    const {accessToken, refresh, loading, fetchMe, user} = useAuthStore();
    // is web starting state
    const [starting, setStarting] = useState(true);

    // initialze when refresh page or revisited page
    const init = async() => {
        // if no token
        if (!accessToken) {
            await refresh();
        }

        // if no user info
        if (accessToken && !user) {
            await fetchMe();
        }

        setStarting(false);
    }

    useEffect(() => {
        init();
    }, []);

    // when waiting for loading page
    if (starting || loading) {
        return <div className="flex h-screen items-center justify-center text-4xl text-black font-semibold">Loading page ...</div>;
    }

    // if user does not have token -> go to sign in page
    if (!accessToken) {
        return <Navigate to="/signin" replace></Navigate>
    }

    if (!user) {
        return <Navigate to="/signin" replace />;
    }

    // check role
    if (user.role !== "admin") {
        return <Navigate to="/home" replace />;
    }

    return (
        <Outlet></Outlet>
    );
}