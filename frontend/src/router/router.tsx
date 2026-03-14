import { Navigate, createBrowserRouter } from "react-router-dom";

import ProtectedLayout from "@/layouts/ProtectedLayout";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";

const router = createBrowserRouter([
    // Public Routes
    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <SignupPage /> },

    // Protected Routes
    {
        element: <ProtectedLayout />,
        children: [{ path: "/", element: <HomePage /> }],
    },

    // Fallback
    { path: "*", element: <Navigate to="/" replace /> },
]);

export default router;
