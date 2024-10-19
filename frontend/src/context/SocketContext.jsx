import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
}

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser) {
      const newSocket = io("https://realtime-chat-app-g5h6.onrender.com", {
        query: {
            userId: authUser._id,
        }
      });
      setSocket(newSocket);

      // newSocket.on is used to listen to the events. can be used both on client and server side.
      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      })
      
      return () => {
        if (newSocket) newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};