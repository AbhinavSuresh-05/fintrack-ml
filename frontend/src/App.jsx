import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { SkeletonDashboard } from "./components/ui/LoadingSkeletons";
import { queryClient } from './lib/queryClient';

// Lazy load main pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const AuthPage = lazy(() => import("./pages/AuthPage"));

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <SkeletonDashboard />;
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <Suspense fallback={<SkeletonDashboard />}>
            {isAuthenticated ? (
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            ) : (
              <AuthPage />
            )}
          </Suspense>
        } 
      />
      <Route 
        path="/auth" 
        element={
          isAuthenticated ? (
            <Home />
          ) : (
            <AuthPage />
          )
        } 
      />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Router>
              <AppContent />
              {/* React Query DevTools - Only show in development */}
              {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
            </Router>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
