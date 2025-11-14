import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/useAuth.store.js";

// component to check whether user has authenticated
const ProtectedRoute = () => {
    const {accessToken} = useAuthStore();

    // if user does not have token -> go to sign in
    if (!accessToken) {
        return <Navigate to="/signin" replace></Navigate>
    }

    return (
        <Outlet></Outlet>
    );
}

export default ProtectedRoute;