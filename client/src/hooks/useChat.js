import { useContext, useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import { UserContext } from 'contexts/UserContext';

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const ONLINE_STATUS_UPDATE = "onlineStatusUpdate"
const SOCKET_SERVER_URL = "http://127.0.0.1:5000";

const useChat = (roomId) => {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    if (roomId) {
      setMessages([]);

      socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
        query: { roomId, user },
        withCredentials: true,
      });

      // Listens for incoming messages
      socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
        const incomingMessage = {
          ...message,
          ownedByCurrentUser: message.senderId === socketRef.current.id,
        };
        setMessages((messages) => [...messages, incomingMessage]);
      });

      // Online status updates
      socketRef.current.on(ONLINE_STATUS_UPDATE, (users) => {
        console.log(users);
      });

      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [roomId, user]);

  // Send message to backend
  const sendMessage = (messageBody) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      senderId: socketRef.current.id,
      roomId: roomId,
      fromUser: user,
      body: messageBody,
    });
  };

  return { messages, sendMessage };
};

export default useChat;
