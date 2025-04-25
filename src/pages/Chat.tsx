import React from "react";
import { ChatList, ChatMessageView } from "../components/chat";
import { useChat } from "../hooks";
import { User } from "../types";

interface ChatPageProps {
  user: User;
}

const ChatPage: React.FC<ChatPageProps> = ({ user }) => {
  const {
    conversations,
    groups,
    handleCloseChat,
    handleSelectConversation,
    handleSelectGroupChat,
    handleSendMessage,
    messages,
    selectedUser,
    updateMessages,
    selectedGroup,
  } = useChat();

  return (
    <div className={`relative flex`}>
      {!selectedUser && !selectedGroup ? (
        <ChatList
          user={user}
          conversations={conversations}
          groups={groups}
          selectedUser={selectedUser}
          selectedGroup={selectedGroup}
          onSelectConversation={handleSelectConversation}
          onSelectGroup={handleSelectGroupChat}
        />
      ) : (
        <ChatMessageView
          selectedUser={selectedUser}
          selectedGroup={selectedGroup}
          messages={messages}
          updateMessages={updateMessages}
          onSendMessage={handleSendMessage}
          onClose={handleCloseChat}
        />
      )}
    </div>
  );
};

export default ChatPage;
