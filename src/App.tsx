import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { LoginForm } from "./components/auth/LoginForm";
import { useAuth } from "./context/AuthContext";
import { Navigate, Route, Routes } from "react-router-dom";
import { SignupForm } from "./components/auth/SignupForm";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AuthenticatedLayout } from "./components/layout/AuthenticatedLayout";
import { Profile } from "./pages/Profile";
import { Home } from "./pages/Home";
import { Friends } from "./components/friends/friends";

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/auth/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginForm />}
      />
      <Route
        path="/auth/signup"
        element={isAuthenticated ? <Navigate to="/" replace /> : <SignupForm />}
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <SocketProvider>
              <AuthenticatedLayout>
                <Home />
              </AuthenticatedLayout>
            </SocketProvider>
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/profile/:userId"
        element={
          <ProtectedRoute>
            <SocketProvider>
              <AuthenticatedLayout>
                <Profile />
              </AuthenticatedLayout>
            </SocketProvider>
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/friends"
        element={
          <ProtectedRoute>
            <SocketProvider>
              <AuthenticatedLayout>
                <Friends />
              </AuthenticatedLayout>
            </SocketProvider>
          </ProtectedRoute>
        }
      ></Route>

      {/* Catch all route - redirect to home or login */}
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <SocketProvider>
              <AuthenticatedLayout>
                <Home />
              </AuthenticatedLayout>
            </SocketProvider>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
