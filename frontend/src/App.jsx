import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { SkeletonDashboard } from "./components/ui/LoadingSkeletons";

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
          isAuthenticated ? (
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          ) : (
            <AuthPage />
          )
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
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
