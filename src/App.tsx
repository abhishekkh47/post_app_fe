import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import {
  LoginForm,
  SignupForm,
  ProtectedRoute,
  ResetPassword,
  SearchAccount,
  UpdatePassword,
} from "./components/auth";
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
  Explore,
} from "./pages";
import { Friends } from "./components/friends";
import { JoinGroupProvider } from "./context/JoinGroupContext";
import { useEffect, useState } from "react";
import { CommonService } from "./services";
import { ViewPost } from "./components/post";
import { NotificationInitializer } from "./components/common";

const AppContent = () => {
  const { user, isAuthenticated } = useAuth();
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

  const ProtectedRouteWithNotifications = ({ children }: any) => {
    return (
      <ProtectedRoute>
        <SocketProvider>
          <NotificationInitializer />
          {children}
        </SocketProvider>
      </ProtectedRoute>
    );
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginForm />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/" replace /> : <SignupForm />}
      />
      <Route
        path="/login/identity"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <SearchAccount />
        }
      />
      <Route
        path="/login/reset-password"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <ResetPassword />
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRouteWithNotifications>
            <AuthenticatedLayout>
              <JoinGroupProvider>
                <Home />
              </JoinGroupProvider>
            </AuthenticatedLayout>
          </ProtectedRouteWithNotifications>
        }
      ></Route>
      <Route
        path="/profile/:userId"
        element={
          <ProtectedRouteWithNotifications>
            <AuthenticatedLayout>
              <Profile />
            </AuthenticatedLayout>
          </ProtectedRouteWithNotifications>
        }
      ></Route>
      <Route
        path="/friends"
        element={
          <ProtectedRouteWithNotifications>
            <AuthenticatedLayout>
              <Friends />
            </AuthenticatedLayout>
          </ProtectedRouteWithNotifications>
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
        path="/settings/update-password"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <UpdatePassword />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/group/:groupId"
        element={
          <ProtectedRouteWithNotifications>
            <AuthenticatedLayout>
              <GroupDetails />
            </AuthenticatedLayout>
          </ProtectedRouteWithNotifications>
        }
      ></Route>
      <Route
        path="/group/members/join/:inviteToken"
        element={
          <ProtectedRouteWithNotifications>
            <AuthenticatedLayout>
              <JoinGroupProvider>
                <JoinGroup />
              </JoinGroupProvider>
            </AuthenticatedLayout>
          </ProtectedRouteWithNotifications>
        }
      ></Route>
      {user && (
        <Route
          path="/messages"
          element={
            <ProtectedRouteWithNotifications>
              <AuthenticatedLayout>
                <JoinGroupProvider>
                  <ChatPage user={user} customClass={`top-10`} />
                </JoinGroupProvider>
              </AuthenticatedLayout>
            </ProtectedRouteWithNotifications>
          }
        ></Route>
      )}
      <Route
        path="/post/:postId"
        element={
          <ProtectedRouteWithNotifications>
            <AuthenticatedLayout>
              <ViewPost />
            </AuthenticatedLayout>
          </ProtectedRouteWithNotifications>
        }
      ></Route>
      <Route
        path="/explore"
        element={
          <ProtectedRouteWithNotifications>
            <AuthenticatedLayout>
              <Explore />
            </AuthenticatedLayout>
          </ProtectedRouteWithNotifications>
        }
      ></Route>

      {/* Maintenance Mode */}
      <Route path="/maintenance" element={<MaintenancePageLayout />}></Route>

      {/* Catch all route - redirect to home or login */}
      <Route
        path="*"
        element={
          <ProtectedRouteWithNotifications>
            <AuthenticatedLayout>
              <Home />
            </AuthenticatedLayout>
          </ProtectedRouteWithNotifications>
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
