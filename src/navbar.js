import React, { useEffect, useState, useReducer } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Chat from './Chat';

const API_URL = "https://chatservice-nbjs.onrender.com/contacts/" + sessionStorage.getItem('username');
const forceUpdateReducer = (state) => state + 1;

const Navbar = () => {
  const username = sessionStorage.getItem('username');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [data, setData] = useState([]);
  const [user, setUsers] = useState([]);
  const [active, setActive] = useState(null);
  const [uniqueKey, setUniqueKey] = useState(0);
  const [, forceUpdate] = useReducer(forceUpdateReducer, 0);
  const [showContacts, setShowContacts] = useState(true); // Új állapot, hogy mobilon váltani lehessen

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const filteredSuggestions = data.filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setActive(suggestion);
    setSearchQuery('');
    setSuggestions([]);
    setUniqueKey(prevKey => prevKey + 1);
    setShowContacts(false); // Ha chat indult, elrejti a kontaktlistát mobilon
  };

  useEffect(() => {
    axios.get("https://chatservice-nbjs.onrender.com/search")
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get(API_URL)
        .then(response => {
          setUsers(response.data);
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
      forceUpdate();
    }, 1000); // Egy másodpercenként frissítés elég

    return () => clearInterval(interval);
  }, []);

  const handleClick = (username) => {
    setUniqueKey(prevKey => prevKey + 1);
    setActive(username);
    setShowContacts(false); // Mobilon elrejti a kontaktlistát
  };

  const handleBack = () => {
    setActive(null);
    setShowContacts(true); // Vissza a kontaktlistához
  };

  // Media query a mobil/desktop nézet kezelésére
  const isMobile = window.innerWidth <= 768;

  return (
    <>
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="ChatApp" />
<link rel="apple-touch-icon" href="/icon.png" />
      <nav className="navbar navbar-light bg-light flex-column align-items-start">
        <a className="navbar-brand">{username}</a>
        {showContacts && (
          <form className="form-inline mt-2">
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </form>
        )}
        {showContacts && suggestions.length > 0 && (
          <ul className="list-group mt-2">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="list-group-item list-group-item-action"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </nav>

      <div className="container-fluid">
        <div className="row">
          {/* Kontaktlista megjelenítése csak akkor, ha desktop vagy showContacts true */}
          {(isMobile ? showContacts : true) && (
            <div className="col-md-3 friends-list" style={{ borderRight: '1px solid #ddd', minHeight: '80vh', overflowY: 'auto' }}>
              {user.map(user => (
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

          {/* Chat megjelenítése csak ha van aktív chat, és mobilon ha showContacts false */}
          {(active && (isMobile ? !showContacts : true)) && (
            <div className={isMobile ? "col-12" : "col-md-9"}>
              {/* Mobilon vissza gomb */}
              {isMobile && (
                <button
                  className="btn btn-secondary mb-2"
                  onClick={handleBack}
                >
                  ← Vissza
                </button>
              )}
              <Chat key={uniqueKey} username={active} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
