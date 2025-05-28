import React, { useEffect, useState, useReducer, useRef } from 'react';
import './styles.css';
import axios from 'axios';

const forceUpdateReducer = (state) => state + 1;

const Chat = ({ username }) => {
  const API_URL = "https://chatservice-nbjs.onrender.com/api/messages/" + sessionStorage.getItem('username') + "/" + username;
  const [chats, setChat] = useState([]);
  const [send, setSend] = useState('');
  const [, forceUpdate] = useReducer(forceUpdateReducer, 0);
  const chatBoxRef = useRef(null);

  const scrollToBottom = () => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: 'auto',
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get(API_URL)
        .then(response => {
          setChat(response.data);
          scrollToBottom();
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
      forceUpdate();
      scrollToBottom();
    }, 1000); // 1 másodperc frissítés

    return () => clearInterval(interval);
  }, [API_URL]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (send.length > 0) {
      try {
        const response = await fetch('https://chatservice-nbjs.onrender.com/api/send/' + sessionStorage.getItem('username') + '/' + username, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ send }),
        });

        const result = await response.text();
        console.log('Response from backend:', result);
        setSend('');
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="card mt-5">
      <div className="card-body chat-box d-flex flex-column" id="chatMessages" ref={chatBoxRef} style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {chats.map((chat, index) => (
          <div
            key={index}
            className={chat.sender === 1 ? 'chat-message bot' : chat.sender === 2 ? 'chat-message user' : 'default-text'}
          >
            {chat.chat}
          </div>
        ))}
      </div>
      <div className="card-footer">
        <form id="chatForm" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              id="messageInput"
              value={send}
              onChange={(e) => setSend(e.target.value)}
              className="form-control"
              placeholder="Írj egy üzenetet..."
            />
            <div className="input-group-append">
              <button className="btn btn-primary" type="submit">SEND</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
