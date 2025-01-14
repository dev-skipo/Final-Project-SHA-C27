import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PageDetails from './components/PageDetails';
import Settings from './components/Settings'; // Import the Settings component
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage'; // Import the LandingPage component
import Footer from './components/Footer'; // Import the Footer component
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './components/index.css';

const App = () => {
    const location = useLocation(); // Get the current location

    // Define paths where the Navbar and Footer should not be displayed
    const noNavbarPaths = []; // Add any paths here if needed
    const noFooterPaths = ['/pages/:id']; // Add paths where Footer should not be displayed

    // Check if the current path is in noNavbarPaths or matches the PageDetails route
    const isNoNavbarPath = noNavbarPaths.includes(location.pathname) || location.pathname.startsWith('/pages/');

    // Check if the current path is in noFooterPaths or matches the PageDetails route
    const isNoFooterPath = noFooterPaths.includes(location.pathname) || location.pathname.startsWith('/pages/');

    return (
        <>
            {/* Render Navbar only if the current path is not in noNavbarPaths or doesn't match PageDetails */}
            {!isNoNavbarPath && <Navbar />}

            {/* Routes */}
            <Routes>
                <Route path="/" element={<LandingPage />} /> {/* LandingPage as the homepage */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/pages/:id" element={<PageDetails />} /> {/* This route will not show the Navbar or Footer */}
                <Route path="/settings" element={<Settings />} /> {/* New route for Settings */}
            </Routes>

            {/* Render Footer only if the current path is not in noFooterPaths or doesn't match PageDetails */}
            {!isNoFooterPath && <Footer />}
        </>
    );
};

export default App;