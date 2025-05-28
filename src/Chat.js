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
            behavior: 'smooth',
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
        }, 1000); // Frissítés másodpercenként

        return () => clearInterval(interval);
    }, []);

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
        <div className="chat-wrapper">
            <div className="chat-box" ref={chatBoxRef}>
                {chats.map((chat, index) => (
                    <div
                        key={index}
                        className={
                            chat.sender === 1
                                ? 'chat-message bot'
                                : chat.sender === 2
                                    ? 'chat-message user'
                                    : 'default-text'
                        }
                    >
                        {chat.chat}
                    </div>
                ))}
            </div>
            <form className="chat-input" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={send}
                    onChange={(e) => setSend(e.target.value)}
                    className="form-control"
                    placeholder="Írj egy üzenetet..."
                />
                <button className="btn btn-primary" type="submit">SEND</button>
            </form>
        </div>
    );
};

export default Chat;
