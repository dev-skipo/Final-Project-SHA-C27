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


    const commonStyle = {
        padding: '2px 8px', // Smaller padding
        height: '28px', // Smaller height
        display: 'flex',
        alignItems: 'center', // Center text vertically
        margin: '0 4px', // Add margin for spacing
    };

    return (
        <Navbar className="px-4" bg="black" variant="dark" expand="lg" expanded={expanded}>
            
            <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
    {/* Icon with white rounded background and dark icon */}
    <div 
        style={{ 
            backgroundColor: 'white', 
            borderRadius: '15%', 
            width: '30px', 
            height: '30px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginRight: '8px' // Add spacing between icon and text
        }}
    >
        <i className="bi bi-feather" style={{ color: 'black', fontSize: '1.25rem' }}></i>
    </div>
    {/* Text for larger screens, hidden on mobile */}
    <span className="d-none d-lg-inline" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
        Link Bio
    </span>
    {/* BETA tag */}
    <span className="d-none d-lg-inline" style={{ fontSize: '0.8rem', color: 'gray', marginLeft: '4px' }}>
        BETA
    </span>
</Navbar.Brand>

            {/* Toggle Button */}
            <Navbar.Toggle 
                aria-controls="basic-navbar-nav" 
                className="border-0 shadow-none" // Remove bo - sh 
                onClick={() => setExpanded(expanded ? false : true)}
            />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto"> 
                    {isLoggedIn ? (
                        <>
                            {/* Dashboard and Settings Links */}
                            <Nav.Link 
                                as={Link} 
                                to="/dashboard" 
                                style={commonStyle} 
                                className="d-flex align-items-center" 
                                onClick={() => setExpanded(false)} 
                            >
                                Dashboard
                            </Nav.Link>
                            <Nav.Link 
                                as={Link} 
                                to="/settings" 
                                style={commonStyle} 
                                className="d-flex align-items-center" 
                                onClick={() => setExpanded(false)} 
                            >
                                Settings
                            </Nav.Link>
                            {/* Logout Button */}
                            <Button 
                                variant="outline-light" 
                                onClick={handleLogout}
                                size="sm" 
                                style={commonStyle} 
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            {/* Login and Register Buttons */}
                            <Button 
                                variant="outline-light" 
                                as={Link} 
                                to="/login" 
                                size="sm" 
                                style={commonStyle} 
                                onClick={() => setExpanded(false)}
                            >
                                Login
                            </Button>
                            <Button 
                                variant="light" 
                                as={Link} 
                                to="/register" 
                                size="sm" 
                                style={commonStyle} 
                                onClick={() => setExpanded(false)} 
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