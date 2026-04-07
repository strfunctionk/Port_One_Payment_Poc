import { Navigate, createBrowserRouter } from "react-router-dom";

import ProtectedLayout from "@/layouts/ProtectedLayout";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import PaymentPage from "@/pages/PaymentPage";
import SsoCallbackPage from "@/pages/SsoCallbackPage";

const router = createBrowserRouter([
    // Public Routes
    { path: "/login", element: <LoginPage /> },
    { path: "/sso-callback", element: <SsoCallbackPage /> },

    // Protected Routes
    {
        element: <ProtectedLayout />,
        children: [
            { path: "/", element: <HomePage /> },
            { path: "/payment", element: <PaymentPage /> },
        ],
    },

    // Fallback
    { path: "*", element: <Navigate to="/" replace /> },
]);

export default router;
