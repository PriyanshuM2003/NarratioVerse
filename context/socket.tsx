import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = (): Socket | null => {
  const socket = useContext(SocketContext);
  return socket;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const connection = io(process.env.NEXT_PUBLIC_SERVER as string);
    console.log("socket connection", connection);
    setSocket(connection);
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("connect_error", (err) => {
      console.log("Error establishing socket", err);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
