import { useAuth } from "../context/AuthContext";
import { Feed, ChatPage } from "./";

const Home: React.FC = () => {
  const { user } = useAuth();
  if (!user) return;
  return (
    <div className="flex">
      <div className="flex-1">
        <Feed />
      </div>
      <div className="w-96">
        <ChatPage user={user} />
      </div>
    </div>
  );
};

export default Home;
