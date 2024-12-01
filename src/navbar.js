import React, { useState, useEffect, useReducer} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import Chat from './Chat';
import axios from 'axios';

const API_URL = "https://chatservice-nbjs.onrender.com/contacts/" + sessionStorage.getItem('username');
const forceUpdateReducer = (state) => state + 1;

const Navbar = () => {
  const userna = sessionStorage.getItem('username');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [data, setData] = useState([]);
  const [user, setUsers] = useState([]);
  const [active, setActive] = useState();
  const [uniqueKey, setUniqueKey] = useState(0);
  const [, forceUpdate] = useReducer(forceUpdateReducer, 0);

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
    console.log('Search query:', suggestion);
    setActive(suggestion);
    setSearchQuery(suggestion);
    setSuggestions([]);
    setUniqueKey(prevKey => prevKey + 1);
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
    }, 100); // Refresh every second

    return () => clearInterval(interval); // Cleanup on component unmount
}, []);
  
  const handleClick = async (username) => {
    setUniqueKey(prevKey => prevKey + 1);
    setActive(username);
    setSearchQuery('');
};


  return (
    <>
    <nav className="navbar navbar-light bg-light flex-column align-items-start">
      <a className="navbar-brand">{userna}</a>
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
      {suggestions.length > 0 && (
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
    <div class="container-fluid">
    <div class="row">
      <div class="col-md-3 friends-list">
      {user.map(user => (
      <div key={user.id} className={`clickable-div ${active === user.username ? 'active' : ''}`} 
      onClick={() => handleClick(user.username)}>{user.username}</div>
    ))}
      </div>
      {active && <Chat key={uniqueKey} username={active} />}
    </div>
  </div>
  </>
  );
};
export default Navbar;