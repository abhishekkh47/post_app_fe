import { useEffect } from "react";
import { Message } from "../types";

const useSocketListeners = (
  socket: any,
  setMessages: any,
  selectedUser: any
) => {
  useEffect(() => {
    if (socket) {
      socket.on("new_message", (newMessage: Message) => {
        if (selectedUser && newMessage.senderId._id === selectedUser._id) {
          setMessages((prevMessages: Message[]) => [
            ...prevMessages,
            newMessage,
          ]);
        }
      });

      return () => {
        socket.off("new_message");
      };
    }
  }, [socket, selectedUser, setMessages]);
};

export default useSocketListeners;
