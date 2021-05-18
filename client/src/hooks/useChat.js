import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import { getJson } from "api/APIUtils";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const ONLINE_STATUS_UPDATE = "onlineStatusUpdate"
const SOCKET_SERVER_URL = "http://localhost:5000";

const useChat = (user) => {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [error, setError] = useState(null);
  const socketRef = useRef();

  useEffect(() => {
    getJson('/conversations')
    .then(previews => {
      const rooms = previews.map(preview => preview.id);
      socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
        query: { rooms, user },
        withCredentials: true
      });
      socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
        setMessages((messages) => [...messages, message]);
      });
      socketRef.current.on(ONLINE_STATUS_UPDATE, (users) => {
        setOnlineUsers(users);
      });
    }).catch(err => {
      setError(err.message);
    });

    return () => {
      socketRef.current.disconnect()
    }
  }, [user]);

  // Send message to backend
  const sendMessage = (roomId, messageBody) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      senderId: socketRef.current.id,
      roomId: roomId,
      fromUser: user,
      body: messageBody,
    });
  };

  return {
    error,
    messages,
    onlineUsers,
    sendMessage,
    setMessages
  };
};

export default useChat;
