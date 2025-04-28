// src/routes/routesConfig.tsx
import { lazy } from "react";
import { ReactNode } from "react";

// Define route types for better type safety
export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<any> | ((props: any) => ReactNode);
  protected: boolean;
  withNotifications?: boolean;
  withJoinGroup?: boolean;
  children?: RouteConfig[];
}

// Lazy load components
const LoginForm = lazy(() => import("./components/auth/LoginForm"));
const SignupForm = lazy(() => import("./components/auth/SignupForm"));
const SearchAccount = lazy(() => import("./components/auth/SearchAccount"));
const ResetPassword = lazy(() => import("./components/auth/ResetPassword"));
const UpdatePassword = lazy(() => import("./components/auth/UpdatePassword"));
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));
const Friends = lazy(() => import("./pages/Friends"));
const Settings = lazy(() => import("./pages/Settings"));
const GroupDetails = lazy(() => import("./pages/GroupDetails"));
const JoinGroup = lazy(() => import("./pages/JoinGroup"));
const ChatPage = lazy(() => import("./pages/Chat"));
const ViewPost = lazy(() => import("./components/post/ViewPost"));
const Explore = lazy(() => import("./pages/Explore"));
const MaintenancePageLayout = lazy(
  () => import("./components/layout/MaintenancePageLayout")
);

// Define the routes configuration
const createRoutesConfig = (isAuthenticated: boolean, user: any) => {
  const routesConfig: RouteConfig[] = [
    // Public Routes
    {
      path: "/login",
      component: isAuthenticated
        ? () => {
            window.location.href = "/";
            return null;
          }
        : LoginForm,
      protected: false,
    },
    {
      path: "/signup",
      component: isAuthenticated
        ? () => {
            window.location.href = "/";
            return null;
          }
        : SignupForm,
      protected: false,
    },
    {
      path: "/login/identity",
      component: isAuthenticated
        ? () => {
            window.location.href = "/";
            return null;
          }
        : SearchAccount,
      protected: false,
    },
    {
      path: "/login/reset-password",
      component: isAuthenticated
        ? () => {
            window.location.href = "/";
            return null;
          }
        : ResetPassword,
      protected: false,
    },

    // Protected Routes with Notifications
    {
      path: "/",
      component: Home,
      protected: true,
      withNotifications: true,
      withJoinGroup: true,
    },
    {
      path: "/profile/:userId",
      component: Profile,
      protected: true,
      withNotifications: true,
    },
    {
      path: "/friends",
      component: Friends,
      protected: true,
      withNotifications: true,
    },
    {
      path: "/settings/:userId",
      component: Settings,
      protected: true,
    },
    {
      path: "/settings/update-password",
      component: UpdatePassword,
      protected: true,
    },
    {
      path: "/group/:groupId",
      component: GroupDetails,
      protected: true,
      withNotifications: true,
    },
    {
      path: "/group/members/join/:inviteToken",
      component: JoinGroup,
      protected: true,
      withNotifications: true,
      withJoinGroup: true,
    },
    {
      path: "/post/:postId",
      component: ViewPost,
      protected: true,
      withNotifications: true,
    },
    {
      path: "/explore",
      component: Explore,
      protected: true,
      withNotifications: true,
    },
    // Maintenance Mode
    {
      path: "/maintenance",
      component: MaintenancePageLayout,
      protected: false,
    },
    // Catch all route
    {
      path: "*",
      component: Home,
      protected: true,
      withNotifications: true,
    },
  ];

  // Conditionally add the messages route if user exists
  if (user) {
    routesConfig.push({
      path: "/messages",
      component: (props: any) => <ChatPage user={user} {...props} />,
      protected: true,
      withNotifications: true,
      withJoinGroup: true,
    });
  }

  return routesConfig;
};

export default createRoutesConfig;
