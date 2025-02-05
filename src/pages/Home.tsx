import { Feed } from "./Feed";
import { ChatPage } from "./Chat";

export const Home: React.FC = () => {
  return (
    <div className="flex">
      <div className="flex-1">
        <Feed />
      </div>
      <div className="w-96">
        <ChatPage />
      </div>
    </div>
  );
};
