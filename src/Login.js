import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const [csrfToken, setCsrfToken] = useState('');
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        async function fetchCsrfToken() {
            const response = await axios.get('http://127.0.0.1:8000/csrf_cookie/');
            const csrfToken = response.data.csrfToken;
            setCsrfToken(csrfToken);
        }

        fetchCsrfToken();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };
    const togglePasswordVisibility = () => {
        setShowPassword(prevShowPassword => !prevShowPassword);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/login/', credentials, {
                headers: {
                    'X-CSRFToken': csrfToken
                }
            });
            if (response && response.data) {
                const { token, user } = response.data;
                const { role, gender, uname, userid } = user;
                sessionStorage.setItem('userid', userid);
                sessionStorage.setItem('userRole', role);
                sessionStorage.setItem('gender', gender);
                sessionStorage.setItem('uname', uname);
                onLogin();
                navigate('/Dashboard');
            }
            else {
                setMessage('Login failed. Please try again later.');
                setTimeout(() => {
                    setMessage('');
                }, 5000);
            }
        } catch (error) {
            console.error('Login failed:', error);
            if (error.response) {
                // The request was made and the server responded with a status code
                if (error.response.status === 401) {
                    // Unauthorized access, handle accordingly
                    setMessage('Invalid credentials. Please try again.');
                } else {
                    // Handle other error responses
                    setMessage('Failed to login. Please try again.');
                }
            } else if (error.request) {
                // The request was made but no response was received
                setMessage('No response received from server. Please try again later.');
            } else {
                // Something else went wrong
                setMessage('Failed to login. Please try again.');
            }
            setTimeout(() => {
                setMessage('');
            }, 5000);
        }
    };

    return (
        <>


            <div className="auth-page-content">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-6 col-xl-5">
                            <div className="card mt-4">
                                <div className="card-body p-4">
                                    <div className="text-center mt-2">
                                        <h5 className="text-primary">Welcome Back!</h5>
                                        <p className="text-muted">Sign in to continue to Sage Summer.</p>
                                    </div>
                                    <div className="p-2 mt-4">
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-3">
                                                <label htmlFor="username" className="form-label">Username</label>
                                                <input type="text" className="form-control" name="username" value={credentials.username} onChange={handleChange} placeholder="Enter username" required />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label" htmlFor="password-input">Password</label>
                                                <div className="position-relative auth-pass-inputgroup mb-3">
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        className="form-control pe-5"
                                                        placeholder="Enter password"
                                                        name="password"
                                                        value={credentials.password}
                                                        onChange={handleChange}
                                                    />
                                                    <button
                                                        className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-decoration-none text-muted shadow-none"
                                                        type="button"
                                                        id="password-addon"
                                                        onClick={() => setShowPassword(prevShowPassword => !prevShowPassword)}
                                                    >
                                                        <i className={`ri-eye-fill align-middle`}></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="auth-remember-check" required />
                                                <label className="form-check-label" htmlFor="auth-remember-check">Accept Terms and Conditions</label>
                                            </div><div className="mt-4 row">
                                                {message && (
                                                    <div className="alert alert-danger" role="alert">
                                                        {message}
                                                    </div>
                                                )}</div>
                                            <div className="mt-4 row">
                                                <div className="col-6">
                                                    <button className="btn btn-success w-100" type="submit">Sign In</button>
                                                </div>
                                                <div className="col-6">
                                                    <Link to="/Registration" className="btn btn-info w-100">Sign Up</Link>
                                                </div>

                                            </div>
                                            <div className="mt-4 row">

                                                <div className="col-12">
                                                    <Link to="/OTP" className="btn btn-danger w-100">Reset Password</Link>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
