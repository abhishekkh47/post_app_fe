import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { LoginForm } from "./components/auth/LoginForm";
import { Feed } from "./pages/Feed";
import { ChatPage } from "./pages/Chat";
import { useAuth } from "./context/AuthContext";
import { NavBar } from "./components/navbar/navbar";

const AppContent = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <LoginForm />;
  }

  return (
    <SocketProvider>
      <NavBar />
      <div className="min-h-screen bg-gray-100">
        <div className="flex">
          <div className="flex-1">
            <Feed />
          </div>
          <div className="w-96">
            <ChatPage />
          </div>
        </div>
      </div>
    </SocketProvider>
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
