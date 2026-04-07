import { useAuth } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";

import { setTokenGetter } from "@/apis/axios";
import router from "@/router/router";

const queryClient = new QueryClient();

function AppInner() {
    const { getToken } = useAuth();

    useEffect(() => {
        setTokenGetter(getToken);
    }, [getToken]);

    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

function App() {
    return <AppInner />;
}

export default App;
