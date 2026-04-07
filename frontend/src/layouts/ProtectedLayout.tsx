import { useAuth } from "@clerk/clerk-react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedLayout() {
    const { isSignedIn, isLoaded } = useAuth();
    const location = useLocation();

    if (!isLoaded) return null;

    if (!isSignedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
}
