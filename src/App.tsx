import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { LoginForm, SignupForm, ProtectedRoute } from "./components/auth";
import { useAuth } from "./context/AuthContext";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  AuthenticatedLayout,
  MaintenancePageLayout,
} from "./components/layout/";
import {
  Profile,
  Home,
  Settings,
  GroupDetails,
  JoinGroup,
  ChatPage,
} from "./pages";
import { Friends } from "./components/friends";
import { JoinGroupProvider } from "./context/JoinGroupContext";
import { useEffect, useState } from "react";
import { CommonService } from "./services";

const AppContent = () => {
  const { user, isAuthenticated } = useAuth();
  if (!user) return;
  const [isMaintenance, setIsMaintenance] = useState<boolean>(false);

  useEffect(() => {
    // Function to check if the server is in maintenance mode
    const checkServerStatus = async () => {
      try {
        const response = await CommonService.getAppStatus(); // Replace with your actual endpoint
        if (response?.response?.status == 503) {
          setIsMaintenance(true);
          window.localStorage.setItem("maintenanceMode", "true");
        } else {
          window.localStorage.removeItem("maintenanceMode");
          setIsMaintenance(false);
        }
      } catch (error) {
        console.error("Error checking server status:", error);
      }
    };

    // Initial check when the component mounts
    checkServerStatus();

    // Set up an interval to periodically check if the server is back online (e.g., every 5 seconds)
    // const intervalId = setInterval(checkServerStatus, 50000); // Checks every 5 seconds

    // Clean up the interval when the component is unmounted
    // return () => clearInterval(intervalId);
  }, []);

  // If maintenance mode is active or if it's stored in localStorage, show the maintenance page
  if (
    isMaintenance ||
    window.localStorage.getItem("maintenanceMode") === "true"
  ) {
    return <MaintenancePageLayout />;
  }

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
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <SocketProvider>
              <AuthenticatedLayout>
                <JoinGroupProvider>
                  <ChatPage user={user} />
                </JoinGroupProvider>
              </AuthenticatedLayout>
            </SocketProvider>
          </ProtectedRoute>
        }
      ></Route>

      {/* Maintenance Mode */}
      <Route path="/maintenance" element={<MaintenancePageLayout />}></Route>

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
