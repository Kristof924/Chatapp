import React, { useState, useEffect } from 'react';
import {
    MDBContainer,
    MDBInput,
    MDBBtn,
} from 'mdb-react-ui-kit';
import Navbar from './navbar';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const data = { username, password};
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [register, setRegister] = useState(false);
    

    useEffect(() => {
        const storedUsername = sessionStorage.getItem('username');
        setUsername(storedUsername || '');
        const storedLogged = sessionStorage.getItem('logged');
        setIsLoggedIn(storedLogged);
        
      }, []);

    const handleSubmit = async (event) => {
        await fetch('https://chatservice-nbjs.onrender.com/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
        .then(res => res.text())
        .then(res => {
            console.log(res);
            if (res == "SUCCES") {
                sessionStorage.setItem('logged', true);
                sessionStorage.setItem('username', username);
                window.location.reload();
            };
            window.location.reload();
          })
          .catch(err => {
            console.error(err);
          });;
        
    };

    const handleRegister = async (event) => {
      await fetch('https://chatservice-nbjs.onrender.com/register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
        .then(res => res.text())
        .then(res => {
            console.log(res);
            if (res == "SUCCES") {
                sessionStorage.setItem('logged', true);
                sessionStorage.setItem('username', username);
            };
            window.location.reload();
          })
          .catch(err => {
            console.error(err);
          });;
    }

    const signup = (bool) =>{
      setRegister(bool);
    }

    return ((register ? (
      <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="border rounded-lg p-4" style={{ width: '500px', height: 'auto' }}>
                <MDBContainer className="p-3">
                    <h2 className="mb-4 text-center">Register Page</h2>
                    <MDBInput wrapperClass='mb-4' placeholder='Username' id='email' value={username} type='email' onChange={(e) => setUsername(e.target.value)} />
                    <MDBInput wrapperClass='mb-4' placeholder='Password' id='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                     {error && <p className="text-danger">{error}</p>} {/* Render error message if exists */}
                    <button className="mb-4 d-block btn-primary" style={{ height: '50px', width: '100%' }} onClick={handleRegister}>Sign up</button>
                    <div className="text-center">
                        <p>Already a member? <a href="#hover" onClick={() => signup(false)}>Login</a></p>
                    </div>
                </MDBContainer>
            </div>
        </div>
    ):(isLoggedIn ? (
        <body>
      <body>
      <Navbar />
    </body>
    </body>
    ) : (

        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="border rounded-lg p-4" style={{ width: '500px', height: 'auto' }}>
                <MDBContainer className="p-3">
                    <h2 className="mb-4 text-center">Login Page</h2>
                    <MDBInput wrapperClass='mb-4' placeholder='Email address' id='email' value={username} type='email' onChange={(e) => setUsername(e.target.value)} />
                    <MDBInput wrapperClass='mb-4' placeholder='Password' id='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    {error && <p className="text-danger">{error}</p>} {/* Render error message if exists */}
                    <button className="mb-4 d-block btn-primary" style={{ height: '50px', width: '100%' }} onClick={handleSubmit}>Sign in</button>
                    <div className="text-center">
                        <p>Not a member? <a href="#hover" onClick={() => signup(true)} >Register</a></p>
                    </div>
                </MDBContainer>
            </div>
        </div>)
    ))
    );
}

export default Login; 