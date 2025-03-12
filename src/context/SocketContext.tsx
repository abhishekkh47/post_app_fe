// Frontend SocketProvider.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { WS_EVENTS } from "../utils";

const { CHAT, GROUP } = WS_EVENTS;
interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  // private chat methods
  sendPrivateMessage: (
    receiverId: string,
    content: string,
    attachments: string[]
  ) => void;
  notifyTyping: (receiverId: string) => void;
  markAsRead: (senderId: string) => void;
  // group chat methods
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  sendGroupMessage: (
    groupId: string,
    content: string,
    attachments?: string[]
  ) => void;
  notifyGroupTyping: (groupId: string) => void;
  markGroupMessageAsRead: (groupId: string, messageId: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  sendPrivateMessage: () => {},
  notifyTyping: () => {},
  markAsRead: () => {},
  joinGroup: () => {},
  leaveGroup: () => {},
  sendGroupMessage: () => {},
  notifyGroupTyping: () => {},
  markGroupMessageAsRead: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false); // Initialize as false
  const [error, setError] = useState<string | null>(null);

  const sendPrivateMessage = useCallback(
    (receiverId: string, content: string, attachments: string[] = []) => {
      if (socket && isConnected) {
        socket.emit(CHAT.EMITTER.PRIVATE_MSG, {
          receiverId,
          content,
          attachments,
        });
      }
    },
    [socket, isConnected]
  );

  const notifyTyping = useCallback(
    (receiverId: string) => {
      if (socket && isConnected) {
        socket.emit(CHAT.LISTENER.TYPING, { receiverId });
      }
    },
    [socket, isConnected]
  );
  const markAsRead = useCallback(
    (senderId: string) => {
      if (socket && isConnected) {
        socket.emit(WS_EVENTS.CHAT.LISTENER.MARK_READ, {
          receiverId: senderId,
        });
      }
    },
    [socket, isConnected]
  );
  const joinGroup = useCallback(
    (groupId: string) => {
      if (socket && isConnected) {
        socket.emit(WS_EVENTS.GROUP.LISTENER.JOIN_GROUP, { groupId });
      }
    },
    [socket, isConnected]
  );
  const leaveGroup = useCallback(
    (groupId: string) => {
      if (socket && isConnected) {
        socket.emit(WS_EVENTS.GROUP.LISTENER.LEAVE_GROUP, { groupId });
      }
    },
    [socket, isConnected]
  );
  const sendGroupMessage = useCallback(
    (groupId: string, content: string, attachments: string[] = []) => {
      if (socket && isConnected) {
        socket.emit(GROUP.LISTENER.GROUP_MSG, {
          groupId,
          content,
          attachments,
        });
      }
    },
    [socket, isConnected]
  );
  const notifyGroupTyping = useCallback(
    (groupId: string) => {
      if (socket && isConnected) {
        socket.emit(GROUP.LISTENER.GROUP_TYPING, { groupId });
      }
    },
    [socket, isConnected]
  );
  const markGroupMessageAsRead = useCallback(
    (groupId: string, messageId: string) => {
      if (socket && isConnected) {
        socket.emit(GROUP.LISTENER.GROUP_MARK_READ, { groupId, messageId });
      }
    },
    [socket, isConnected]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found in localStorage");
      return;
    }

    // Don't create new socket if one exists
    if (socket?.connected) {
      return;
    }

    // Create the socket URL properly
    const socketUrl = import.meta.env.VITE_API_URL;
    console.log("Attempting to connect to:", socketUrl);

    const socketInstance = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket"], // Try websocket only first
      auth: { token },
      path: "/socket.io", // Explicitly set the path
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected with ID:", socketInstance.id);
      setIsConnected(true);
      setError(null);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      setError(`Connection error: ${err.message}`);
      setIsConnected(false);

      // Try to reconnect with polling if websocket fails
      // if (socketInstance?.io?.opts?.transports[0] === "websocket") {
      //   console.log("Retrying with polling transport");
      //   socketInstance.io.opts.transports = ["polling", "websocket"];
      // }
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      if (socketInstance.connected) {
        console.log("Cleaning up socket connection");
        socketInstance.close();
      }
      setSocket(null);
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        sendPrivateMessage,
        notifyTyping,
        markAsRead,
        joinGroup,
        leaveGroup,
        sendGroupMessage,
        notifyGroupTyping,
        markGroupMessageAsRead,
      }}
    >
      {children}
      {error && (
        <div
          className="error-message"
          style={{ color: "red", padding: "10px" }}
        >
          {error}
        </div>
      )}
    </SocketContext.Provider>
  );
};
