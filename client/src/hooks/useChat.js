import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import { getJson } from "api/APIUtils";

const JOIN_CONVERSATION = "join";
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const ONLINE_STATUS_UPDATE = "onlineStatusUpdate"
const SOCKET_SERVER_URL = "http://localhost:5000";

const useChat = (user) => {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState(null);
  const socketRef = useRef();

  useEffect(() => {
    getJson('/conversations')
    .then(fetchedPreviews => {
      setPreviews(fetchedPreviews);
    })
    .catch(err => {
      setError(err.message);
    });
  }, []);

  useEffect(() => {
    const rooms = previews.map(preview => preview.id);
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { rooms, user },
      withCredentials: true
    });

    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      let newPreviews = [...previews];
      const previewIndex = previews.findIndex(preview => preview.id === message.roomId);
      if (previewIndex === -1) {
        // New conversation with no preview
        const newPreview = {
          id: message.roomId,
          messages: [{
            body: message.body,
            conversationId: message.roomId,
            created_at: message.createdAt,
            from_user: message.fromUser
          }],
          users: [...message.toUsers, message.fromUser]
        };
        setPreviews((previews) => [newPreview, ...previews]);
      } else {
        // Conversation preview already exists
        const newMessagePreview = {
          conversationId: message.roomId,
          from_user: message.fromUser,
          body: message.body,
          created_at: message.createdAt
        }
        newPreviews[previewIndex].messages = [newMessagePreview];
        const sortedPreviews = newPreviews.sort((a, b) => {
          if (a.messages.length > 0 && b.messages.length > 0) {
            return Date.parse(b.messages[0]['created_at']) - Date.parse(a.messages[0]['created_at']);
          } else {
            return 0;
          }
        });
        setPreviews(sortedPreviews);
      }
      setMessages((messages) => [...messages, message]);
    }, [previews, user]);

    socketRef.current.on(ONLINE_STATUS_UPDATE, (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socketRef.current.disconnect()
    }
  }, [previews, user]);

  // Join room when starting a new conversation
  const joinConversation = (roomId) => {
    socketRef.current.emit(JOIN_CONVERSATION, {
      roomId: roomId
    });
  };

  // Send message to backend
  const sendMessage = (roomId, messageBody, toUsers) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      senderId: socketRef.current.id,
      roomId: roomId,
      fromUser: user,
      toUsers: toUsers,
      body: messageBody,
    });
  };

  return {
    error,
    joinConversation,
    messages,
    onlineUsers,
    previews,
    sendMessage,
    setMessages
  };
};

export default useChat;
