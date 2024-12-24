import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PageDetails from './components/PageDetails';
import Navbar from './components/Navbar'; 
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
    const location = useLocation(); // Get the current location

    // Define paths where the Navbar should not be displayed
    const noNavbarPaths = [];

    // Check if the current path is in noNavbarPaths or matches the PageDetails route
    const isNoNavbarPath = noNavbarPaths.includes(location.pathname) || location.pathname.startsWith('/pages/');

    return (
        <>
            {/* Render Navbar only if the current path is not in noNavbarPaths or doesn't match PageDetails */}
            {!isNoNavbarPath && <Navbar />}
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/pages/:id" element={<PageDetails />} /> {/* This route will not show the Navbar */}
                {/* Add other routes as needed */}
            </Routes>
        </>
    );
};

export default App;