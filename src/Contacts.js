import React, { useEffect, useState, useReducer} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Chat from './Chat';

const API_URL = "https://chatservice-nbjs.onrender.com/contacts/" + sessionStorage.getItem('username');
const forceUpdateReducer = (state) => state + 1;

const Contacts = () => {
    const [user, setUsers] = useState([]);
    const [active, setActive] = useState();
    const [uniqueKey, setUniqueKey] = useState(0);
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
    const interval = setInterval(() => {
     if(sessionStorage.getItem('click')){
        setUniqueKey(prevKey => prevKey + 1);
       setActive(sessionStorage.getItem('newChat'));
       sessionStorage.setItem('click', false)
       console.log(sessionStorage.getItem('newChat'))
     }
        forceUpdate();
    }, 100); // Refresh every second

    return () => clearInterval(interval); // Cleanup on component unmount
}, []);
  
  const handleClick = async (username) => {
    setUniqueKey(prevKey => prevKey + 1);
    setActive(username);
    sessionStorage.setItem('reciver', username);
};

    
  return (
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
      
  );}

export default Contacts;