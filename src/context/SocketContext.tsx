// Frontend SocketProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false); // Initialize as false
  const [error, setError] = useState<string | null>(null);

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
    <SocketContext.Provider value={{ socket, isConnected }}>
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
