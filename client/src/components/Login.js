import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState(''); // 'success' or 'danger'
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://final-project-sha-c27.onrender.com/api/auth/login', { email, password });
            localStorage.setItem('token', response.data.token); // Store token in local storage
            setAlertMessage('Login successful!');
            setAlertType('success');
            setTimeout(() => {
                navigate('/dashboard'); // Redirect to dashboard after 2 seconds
            }, 2000);
        } catch (error) {
            console.error("Login failed:", error);
            setAlertMessage('Please check your credentials and try again.');
            setAlertType('danger');
        }
    };

    return (
        <div 
            className="container-fluid d-flex justify-content-center align-items-center vh-100"
            style={{ backgroundColor: '#f9f9f9' }} // Set main container background
        >
            <div>
                {/* Alert Message (outside the card) */}
                {alertMessage && (
                    <div 
                        className={`alert alert-${alertType} mb-3 text-center rounded`}
                        style={{ width: '350px', margin: '0 auto' }} // Match card width and center
                    >
                        {alertMessage}
                    </div>
                )}

                {/* Card */}
                <div className="card shadow-sm border-0" style={{ width: '350px' }}> {/* Smaller width */}
                    <div className="card-body">
                        <h2 className="card-title mb-4">Login</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input 
                                    type="email" 
                                    className="form-control form-control-sm" // Smaller input field
                                    id="email" 
                                    placeholder="Enter your email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                    style={{ height: '36px' }} // Custom height
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input 
                                    type="password" 
                                    className="form-control form-control-sm" // Smaller input field
                                    id="password" 
                                    placeholder="Enter your password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                    style={{ height: '36px' }} // Custom height
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="btn btn-dark w-100 btn-sm" // Dark button with small size
                            >
                                Login
                            </button>

                            {/* Divider */}
                            <div className="text-center my-3">
                            <hr style={{ width: '50%', margin: '20px auto', border: '1px solid #ccc' }} />
                            </div>

                            {/* Login with Facebook */}
                            <button 
                                type="button" 
                                className="btn btn-outline-dark w-100 mb-2 btn-sm" // Dark outline button with small size
                                disabled
                            >
                                Login with Facebook
                            </button>

                            {/* Login with Google */}
                            <button 
                                type="button" 
                                className="btn btn-outline-dark w-100 btn-sm" // Dark outline button with small size
                                disabled
                            >
                                Login with Google
                            </button>
                        </form>
                    </div>
                </div>

                {/* Create an account? Register */}
                <div className="text-center mt-3">
                    Create an account?{' '}
                    <Link to="/register" className="text-decoration-none">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;