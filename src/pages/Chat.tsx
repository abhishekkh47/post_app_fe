import React from "react";
import { ChatList, ChatPopup } from "../components/chat";
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
    newGroupCreated,
  } = useChat();

  return (
    <div className={`relative h-screen flex`}>
      <ChatList
        user={user}
        conversations={conversations}
        groups={groups}
        selectedUser={selectedUser}
        selectedGroup={selectedGroup}
        onSelectConversation={handleSelectConversation}
        onSelectGroup={handleSelectGroupChat}
        newGroupCreated={newGroupCreated}
      />
      {/* <ChatWindow
        selectedUser={selectedUser}
        messages={messages}
        setMessages={setMessages}
        onSendMessage={handleSendMessage}
        onBackButtonClick={handleBackButtonClick}
        className="absolute top-0 left-0 w-full h-full z-20"
      /> */}
      <ChatPopup
        selectedUser={selectedUser}
        selectedGroup={selectedGroup}
        messages={messages}
        updateMessages={updateMessages}
        onSendMessage={handleSendMessage}
        onClose={handleCloseChat}
      />
    </div>
  );
};

export default ChatPage;
