import { Suspense, useEffect, useState, ReactNode } from "react";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { ProtectedRoute } from "./components/auth";
import { useAuth } from "./context/AuthContext";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  AuthenticatedLayout,
  MaintenancePageLayout,
} from "./components/layout/";
import { JoinGroupProvider } from "./context/JoinGroupContext";
import { CommonService } from "./services";
import { NotificationInitializer } from "./components/common";
import createRoutesConfig, { RouteConfig } from "./routes";

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">Loading...</div>
);

// Wrapper components for different route types
const ProtectedRouteWithNotifications = ({
  children,
}: {
  children: ReactNode;
}) => (
  <ProtectedRoute>
    <SocketProvider>
      <NotificationInitializer />
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </SocketProvider>
  </ProtectedRoute>
);

const ProtectedRouteBasic = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute>
    <AuthenticatedLayout>{children}</AuthenticatedLayout>
  </ProtectedRoute>
);

const WithJoinGroupProvider = ({ children }: { children: ReactNode }) => (
  <JoinGroupProvider>{children}</JoinGroupProvider>
);

const AppContent = () => {
  const { user, isAuthenticated } = useAuth();
  const [isMaintenance, setIsMaintenance] = useState<boolean>(false);
  const routesConfig = createRoutesConfig(isAuthenticated, user);

  useEffect(() => {
    // Function to check if the server is in maintenance mode
    const checkServerStatus = async () => {
      try {
        const response = await CommonService.getAppStatus();
        if (response?.response?.status === 503) {
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
  }, []);

  // If maintenance mode is active, show the maintenance page
  if (
    isMaintenance ||
    window.localStorage.getItem("maintenanceMode") === "true"
  ) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <MaintenancePageLayout />
      </Suspense>
    );
  }

  // Helper function to wrap elements based on route config
  const getWrappedElement = (route: RouteConfig) => {
    // Handle redirect for public routes when authenticated
    if (!route.protected && "redirect" in route.component) {
      return <Navigate to={(route.component as any).redirect} replace />;
    }

    // Get the component
    const Component = route.component;
    let element = <Component />;

    // Apply wrappers based on route config
    if (route.protected) {
      if (route.withJoinGroup) {
        element = <WithJoinGroupProvider>{element}</WithJoinGroupProvider>;
      }

      if (route.withNotifications) {
        element = (
          <ProtectedRouteWithNotifications>
            {element}
          </ProtectedRouteWithNotifications>
        );
      } else {
        element = <ProtectedRouteBasic>{element}</ProtectedRouteBasic>;
      }
    }

    return element;
  };

  // Render routes from config
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {routesConfig.map((route, index) => (
          <Route
            key={`route-${index}-${route.path}`}
            path={route.path}
            element={getWrappedElement(route)}
          />
        ))}
      </Routes>
    </Suspense>
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
