import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import "./Chat.css";

const Chat = () => {
  const { otherUserId } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  // Load current user from localStorage
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setCurrentUser(userInfo);
    }
  }, []);

  const userId = currentUser?._id || currentUser?.user?._id;

  // Initialize Socket.IO after userId is available
  useEffect(() => {
    if (!userId) return;

    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    // Join the room using userId
    newSocket.emit("join_room", userId);

    // Listen for incoming messages
    const receiveMessage = (data) => {
      if (
        (data.sender === otherUserId && data.receiver === userId) ||
        (data.sender === userId && data.receiver === otherUserId)
      ) {
        setMessageList((list) => [...list, data]);
      }
    };

    newSocket.on("receive_message", receiveMessage);

    // Clean up on unmount
    return () => {
      newSocket.off("receive_message", receiveMessage);
      newSocket.disconnect();
    };
  }, [userId, otherUserId]);

  // Fetch chat history
  useEffect(() => {
    if (userId && otherUserId) {
      const fetchChatHistory = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/chat/${userId}/${otherUserId}`
          );
          setMessageList(response.data);
        } catch (error) {
          console.error("Error fetching chat history:", error);
        }
      };

      fetchChatHistory();
    }
  }, [userId, otherUserId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  // Send message
  const sendMessage = async () => {
    if (message.trim() === "" || !socket) return;

    const messageData = {
      sender: userId,
      receiver: otherUserId,
      message: message,
      timestamp: new Date(),
    };

    // Emit to server
    socket.emit("send_message", messageData);

    // Add to local message list
    setMessageList((list) => [...list, messageData]);
    setMessage("");
  };

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Chat</p>
      </div>
      <div className="chat-body">
        <div className="message-container">
          {messageList.map((msg, index) => {
            const isSender = msg.sender === userId;
            return (
              <div
                key={index}
                className="message"
                id={isSender ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{msg.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p id="author">{isSender ? "You" : "Them"}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={message}
          placeholder="Hey..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chat;
