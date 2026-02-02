import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './theme' // Initialize theme system
import App from './App.jsx'
import { RouterProvider } from 'react-router'
import { router } from './router/Router.jsx'
import AuthProvider from './Provider/AuthProvider.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh for 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes - cache persists for 10 minutes
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      refetchOnReconnect: true, // Refetch when internet reconnects
      retry: 1, // Only retry failed requests once
    },
  },
});
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
)
