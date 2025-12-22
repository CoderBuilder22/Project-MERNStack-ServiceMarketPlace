import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import "./chat.css";

const Chat = () => {
  const { otherUserId } = useParams();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [userList, setUserList] = useState([]);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const messagesEndRef = useRef(null);

  // Load current user from localStorage
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setCurrentUser(userInfo);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const userId = currentUser?._id || currentUser?.user?._id;

  // Fetch user list based on role
  useEffect(() => {
    if (!currentUser || !userId) return;

    const fetchUserList = async () => {
      try {
        setLoading(true);
        let response;
        if (currentUser.role === "provider") {
          response = await axios.get(
            `http://localhost:5000/api/provider/customers/${userId}`
          );
        } else if (currentUser.role === "customer") {
          response = await axios.get(
            `http://localhost:5000/api/customer/${userId}`
          );
        }
        setUserList(response.data);
        
        // Set selected user if otherUserId exists
        if (otherUserId) {
          const foundUser = response.data.find(item => {
            const user = currentUser.role === "provider" ? item.customer : item.provider;
            return user._id === otherUserId;
          });
          if (foundUser) {
            setSelectedUser(foundUser);
          }
        }
      } catch (error) {
        console.error("Error fetching user list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserList();
  }, [currentUser, userId, otherUserId]);

  // Setup Socket.IO connection
  useEffect(() => {
    if (!userId) return;

    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.emit("join_room", userId);

    const receiveMessage = (data) => {
      if (
        (data.sender === otherUserId && data.receiver === userId) ||
        (data.sender === userId && data.receiver === otherUserId)
      ) {
        setMessageList((list) => [...list, data]);
      }
    };

    newSocket.on("receive_message", receiveMessage);

    return () => {
      newSocket.off("receive_message", receiveMessage);
      newSocket.disconnect();
    };
  }, [userId, otherUserId]);

  // Fetch chat history
  useEffect(() => {
    if (!userId || !otherUserId) return;

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
  }, [userId, otherUserId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  const sendMessage = async () => {
    if (!message.trim() || !socket || !userId || !otherUserId) return;

    const messageData = {
      sender: userId,
      receiver: otherUserId,
      message: message.trim(),
      timestamp: new Date(),
    };

    try {
      socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleUserClick = (user, index) => {
    const targetUser = currentUser.role === "provider" ? user.customer : user.provider;
    setSelectedUser(user);
    navigate(`/chat/${targetUser._id}`);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActiveUser = () => {
    if (!selectedUser) return null;
    return currentUser.role === "provider" ? selectedUser.customer : selectedUser.provider;
  };

  if (loading || !currentUser) {
    return (
      <div className="chat-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  const activeUser = getActiveUser();

  return (
    <div className="chat-container">
      <div className="user-list">
        <h3>{currentUser.role === "provider" ? "Customers" : "Providers"}</h3>
        {userList.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', marginTop: '20px' }}>
            No {currentUser.role === "provider" ? "customers" : "providers"} found
          </p>
        ) : (
          <ul>
            {userList.map((item, index) => {
              const user = currentUser.role === "provider" ? item.customer : item.provider;
              const isActive = activeUser?._id === user._id;
              return (
                <li
                  key={index}
                  className={isActive ? "active" : ""}
                  onClick={() => handleUserClick(item, index)}
                >
                  <p>{user.name}</p>
                  <p>{user.email}</p>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="chat-window">
        <div className="chat-header">
          <div className="chat-header-info">
            <h3>
              {activeUser ? activeUser.name : "Select a user to chat"}
            </h3>
            {activeUser && (
              <p>{activeUser.email}</p>
            )}
          </div>
        </div>
        
        <div className="chat-body">
          {!otherUserId ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              color: '#94a3b8',
              fontSize: '16px'
            }}>
              Select a user from the sidebar to start chatting
            </div>
          ) : (
            <div className="message-container">
              {messageList.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  color: '#94a3b8',
                  marginTop: '40px'
                }}>
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messageList.map((msg, index) => {
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
                          <p id="time">{formatTime(msg.timestamp)}</p>
                          <p id="author">{isSender ? "You" : activeUser?.name.split(' ')[0] || "Them"}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {otherUserId && (
          <div className="chat-footer">
            <input
              type="text"
              value={message}
              placeholder="Type your message here..."
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              disabled={!otherUserId}
            />
            <button 
              onClick={sendMessage} 
              disabled={!message.trim() || !otherUserId}
              title="Send message"
            >
              <span style={{ transform: 'translateX(2px)' }}>→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;