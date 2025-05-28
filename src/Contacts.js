import React, { useEffect, useState, useReducer } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Chat from './Chat';

const API_URL = "https://chatservice-nbjs.onrender.com/contacts/" + sessionStorage.getItem('username');
const forceUpdateReducer = (state) => state + 1;

const Contacts = () => {
  const [users, setUsers] = useState([]);
  const [active, setActive] = useState();
  const [uniqueKey, setUniqueKey] = useState(0);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [, forceUpdate] = useReducer(forceUpdateReducer, 0);

  useEffect(() => {
    axios.get(API_URL)
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (sessionStorage.getItem('click')) {
        setUniqueKey(prevKey => prevKey + 1);
        const newChat = sessionStorage.getItem('newChat');
        setActive(newChat);
        sessionStorage.setItem('click', false);
        console.log(newChat);
      }
      forceUpdate();
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (username) => {
    setUniqueKey(prevKey => prevKey + 1);
    setActive(username);
    sessionStorage.setItem('reciver', username);
  };

  const handleBack = () => {
    setActive(null);
  };

  return (
    <div className="container-fluid">
      <div className="row no-gutters flex-nowrap full-height">

        {(!isMobileView || !active) && (
          <div className="col-12 col-md-3 friends-list">
            <h5 className="p-2">Kontaktok</h5>
            {users.map(user => (
              <div
                key={user.id}
                className={`clickable-div ${active === user.username ? 'active' : ''}`}
                onClick={() => handleClick(user.username)}
              >
                {user.username}
              </div>
            ))}
          </div>
        )}

        {(!isMobileView || active) && (
          <div className="col-12 col-md-9">
            {isMobileView && active && (
              <div className="p-2 bg-light border-bottom">
                <button className="btn btn-sm btn-outline-secondary" onClick={handleBack}>
                  ← Vissza
                </button>
              </div>
            )}
            {active && <Chat key={uniqueKey} username={active} />}
          </div>
        )}

      </div>
    </div>
  );
};

export default Contacts;
