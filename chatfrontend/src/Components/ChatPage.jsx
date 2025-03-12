import React, { useEffect, useState, useRef } from "react";
import { useChatContext } from "../Context/ChatContext";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaPaperclip } from "react-icons/fa";
import "./ChatPage.css";

const ChatPage = () => {
  const { roomId, currentUser } = useChatContext();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const chatBoxRef = useRef(null);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!roomId) return;

    const socket = new SockJS("http://localhost:8080/chats");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("Connected to WebSocket ✅");

        client.subscribe(`/topic/room/${roomId}`, (msg) => {
          const newMessage = JSON.parse(msg.body);
          setMessages((prev) => [...prev, newMessage]);
        });

        setStompClient(client);
      },

      onStompError: (frame) => {
        console.error("STOMP Error:", frame.headers["message"]);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [roomId]);

  useEffect(() => {
    chatBoxRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if ((!message.trim() && !file) || !stompClient?.connected) return;

    let newMessage = {
      sender: currentUser,
      timeStamp: new Date().toISOString(),
    };

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        newMessage.file = {
          name: file.name,
          type: file.type,
          data: reader.result,
        };

        stompClient.publish({
          destination: `/app/sendMessage/${roomId}`,
          body: JSON.stringify(newMessage),
        });

        setFile(null);
      };
      reader.readAsDataURL(file);
    } else {
      newMessage.content = message;

      stompClient.publish({
        destination: `/app/sendMessage/${roomId}`,
        body: JSON.stringify(newMessage),
      });
    }

    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <motion.div 
      className="chat-container"
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
    >
      <header className="chat-header">
        <h2>Room: {roomId}</h2>
        <h3>User: {currentUser}</h3>
        <motion.button 
          className="leave-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/")} 
        >
          Leave
        </motion.button>
      </header>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <motion.div 
            key={index}
            className={`message ${msg.sender === currentUser ? "sent" : "received"}`}
             initial={{ opacity: 0, x: msg.sender === currentUser ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="user">{msg.sender}</span>
            {msg.content && <p>{msg.content}</p>}
            {msg.file && (
              <a href={msg.file.data} download={msg.file.name} className="file-link">
                📂 {msg.file.name}
              </a>
            )}
            <span className="timestamp">
              {new Date(msg.timeStamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </motion.div>
        ))}
        <div ref={chatBoxRef}></div>
      </div>

      <div className="input-area">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={handleKeyPress}
        />
        <input 
          type="file" 
          id="file-input" 
          onChange={(e) => setFile(e.target.files[0])} 
          className="hidden-file-input"
        />
        <label htmlFor="file-input" className="file-icon">
          <FaPaperclip size={20} />
        </label>
        <motion.button 
          onClick={sendMessage}
          disabled={!stompClient || !stompClient.connected}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Send
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ChatPage;
