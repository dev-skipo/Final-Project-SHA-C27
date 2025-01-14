import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const CustomNavbar = () => {
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setExpanded(false); // Collapse the navbar on logout
        navigate('/login');
    };

    const isLoggedIn = !!localStorage.getItem('token');

    // Common style for buttons and Nav.Link elements
    const commonStyle = {
        padding: '2px 8px', // Smaller padding
        height: '28px', // Smaller height
        display: 'flex',
        alignItems: 'center', // Center text vertically
        margin: '0 4px', // Add margin for spacing
    };

    return (
        <Navbar className="px-3" bg="black" variant="dark" expand="lg" expanded={expanded}>
            <Navbar.Brand as={Link} to="/">Link Bio</Navbar.Brand>
            {/* Toggle Button without Shadow and Border */}
            <Navbar.Toggle 
                aria-controls="basic-navbar-nav" 
                className="border-0 shadow-none" // Remove border and shadow
                onClick={() => setExpanded(expanded ? false : true)}
            />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto"> {/* Aligns links to the right */}
                    {isLoggedIn ? (
                        <>
                            {/* Dashboard and Settings Links */}
                            <Nav.Link 
                                as={Link} 
                                to="/dashboard" 
                                style={commonStyle} // Apply common style
                                className="d-flex align-items-center" // Ensure vertical alignment
                                onClick={() => setExpanded(false)} // Collapse navbar on click
                            >
                                Dashboard
                            </Nav.Link>
                            <Nav.Link 
                                as={Link} 
                                to="/settings" 
                                style={commonStyle} // Apply common style
                                className="d-flex align-items-center" // Ensure vertical alignment
                                onClick={() => setExpanded(false)} // Collapse navbar on click
                            >
                                Settings
                            </Nav.Link>
                            {/* Logout Button */}
                            <Button 
                                variant="outline-light" // Light outline for contrast
                                onClick={handleLogout}
                                size="sm" // Small button
                                style={commonStyle} // Apply common style
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            {/* Login and Register Buttons */}
                            <Button 
                                variant="outline-light" // Light outline for contrast
                                as={Link} 
                                to="/login" 
                                size="sm" // Small button
                                style={commonStyle} // Apply common style
                                onClick={() => setExpanded(false)} // Collapse navbar on click
                            >
                                Login
                            </Button>
                            <Button 
                                variant="light" // Light outline for contrast
                                as={Link} 
                                to="/register" 
                                size="sm" // Small button
                                style={commonStyle} // Apply common style
                                onClick={() => setExpanded(false)} // Collapse navbar on click
                            >
                                Register
                            </Button>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default CustomNavbar;