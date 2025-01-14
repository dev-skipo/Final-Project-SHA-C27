import React from 'react';
import { Nav } from 'react-bootstrap'; // Import Nav 

const Sidebar = () => {
    return (
        <div className="sidebar bg-light">
            <Nav className="flex-column">
                <Nav.Link href="#page">Page</Nav.Link>
                <Nav.Link href="#mails">Mails</Nav.Link>
                <Nav.Link href="#settings">Settings</Nav.Link>
            </Nav>
        </div>
    );
};

export default Sidebar;
