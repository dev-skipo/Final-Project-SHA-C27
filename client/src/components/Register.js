import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [category, setCategory] = useState('');
    const [username, setUsername] = useState(''); // Add username state
    const [alertMessage, setAlertMessage] = useState(''); // Alert message state
    const [alertType, setAlertType] = useState(''); // Alert type state ('success' or 'danger')
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://final-project-sha-c27.onrender.com/api/auth/register', { 
                name, 
                email, 
                password, 
                category, 
                username // Include username 
            });
      
            setAlertMessage('Registration successful!');
            setAlertType('success');
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            console.error("Registration failed:", error);
            // Set error alert
            if (error.response) {
                setAlertMessage(`Registration failed: ${error.response.data.message}`);
            } else {
                setAlertMessage("Registration failed. Please try again.");
            }
            setAlertType('danger');
        }
    };

    return (
        <div 
            className="container-fluid d-flex justify-content-center align-items-center vh-100"
            style={{ backgroundColor: '#f9f9f9' }} 
        >
            <div>
                {/* Alert Message*/}
                {alertMessage && (
                    <div 
                        className={`alert alert-${alertType} mb-3 text-center rounded`}
                        style={{ width: '350px', margin: '0 auto' }} 
                    >
                        {alertMessage}
                    </div>
                )}

                {/* Card */}
                <div className="card shadow-sm border-0" style={{ width: '350px' }}> 
                    <div className="card-body">
                        <h2 className="card-title mb-4">Register</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input 
                                    type="text" 
                                    className="form-control form-control-sm" 
                                    id="name" 
                                    placeholder="Enter your name" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    required 
                                    style={{ height: '36px' }} 
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Username</label>
                                <input 
                                    type="text" 
                                    className="form-control form-control-sm" 
                                    id="username" 
                                    placeholder="Choose a username" 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)} 
                                    required 
                                    style={{ height: '36px' }} 
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input 
                                    type="email" 
                                    className="form-control form-control-sm" 
                                    id="email" 
                                    placeholder="Enter your email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                    style={{ height: '36px' }} 
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input 
                                    type="password" 
                                    className="form-control form-control-sm" 
                                    id="password" 
                                    placeholder="Enter your password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                    style={{ height: '36px' }} 
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="category" className="form-label">Select Category</label>
                                <select
                                    id="category"
                                    className="form-select form-select-sm" 
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                    style={{ height: '36px' }} 
                                >
                                    <option value="">Select Category</option>
                                    <option value="music">Music</option>
                                    <option value="clothes">Clothes</option>
                                    <option value="sells">Sells $</option>
                                </select>
                            </div>
                            <button 
                                type="submit" 
                                className="btn btn-dark w-100 btn-sm" 
                            >
                                Register
                            </button>

                            {/* ---- */}
                            <div className="text-center my-3">
                            <hr style={{ width: '50%', margin: '20px auto', border: '1px solid #ccc' }} />
                            </div>

                            {/* Login with Facebook */}
                            <button 
                                type="button" 
                                className="btn btn-outline-dark w-100 mb-2 btn-sm" 
                                disabled
                            >
                                Register with Facebook
                            </button>

                            {/* Login with Google */}
                            <button 
                                type="button" 
                                className="btn btn-outline-dark w-100 btn-sm" 
                                disabled
                            >
                                Register with Google
                            </button>
                        </form>
                    </div>
                </div>

                {/* Already have an account? Login */}
                <div className="text-center mt-3">
                    Already have an account?{' '}
                    <Link to="/login" className="text-decoration-none">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;