import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { LoginForm, SignupForm, ProtectedRoute } from "./components/auth";
import { useAuth } from "./context/AuthContext";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthenticatedLayout } from "./components/layout/";
import { Profile, Home, Settings, GroupDetails, JoinGroup } from "./pages";
import { Friends } from "./components/friends";
import { JoinGroupProvider } from "./context/JoinGroupContext";

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
                <JoinGroupProvider>
                  <Home />
                </JoinGroupProvider>
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
      <Route
        path="/settings/:userId"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Settings />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/group/:groupId"
        element={
          <ProtectedRoute>
            <SocketProvider>
              <AuthenticatedLayout>
                <GroupDetails />
              </AuthenticatedLayout>
            </SocketProvider>
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/group/members/join/:inviteToken"
        element={
          <ProtectedRoute>
            <SocketProvider>
              <AuthenticatedLayout>
                <JoinGroupProvider>
                  <JoinGroup />
                </JoinGroupProvider>
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
