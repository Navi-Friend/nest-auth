import { RouterProvider } from "react-router";
import { router } from "@/router";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
                <Toaster position="top-center" duration={3000} />
            </QueryClientProvider>
        </>
    );
}

export default App;

