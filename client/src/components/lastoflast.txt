import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Nav, Modal, Form, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Settings = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        category: '',
        username: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState(null);
    const [activeSection, setActiveSection] = useState('general');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false); // State to control sidebar visibility
    const [showAlert, setShowAlert] = useState(false); // State to control alert visibility
    const [alertMessage, setAlertMessage] = useState(''); // State to store alert message
    const [alertVariant, setAlertVariant] = useState('success'); // State to store alert variant (success or danger)
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/auth/user', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setUserData({
                    ...response.data,
                    category: response.data.category || ''
                });
            } catch (err) {
                console.error('Error fetching user data:', err);
                setErrorMessage('Failed to fetch user data.');
            }
        };
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('http://localhost:5000/api/auth/user/update', userData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            // Show success alert
            setAlertMessage('User information updated successfully!');
            setAlertVariant('success');
            setShowAlert(true);

            // Logout after 2 seconds
            setTimeout(() => {
                localStorage.removeItem('token');
                navigate('/login');
            }, 2000);

        } catch (error) {
            console.error('Error updating user information:', error);

            // Show error alert
            setAlertMessage('Failed to update user information.');
            setAlertVariant('danger');
            setShowAlert(true);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await axios.delete('http://localhost:5000/api/auth/user/delete', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            // Show success alert
            setAlertMessage('Account deleted successfully!');
            setAlertVariant('success');
            setShowAlert(true);

            // Logout after 2 seconds
            setTimeout(() => {
                localStorage.removeItem('token');
                navigate('/login');
            }, 2000);

        } catch (error) {
            console.error('Error deleting account:', error);

            // Show error alert
            setAlertMessage('Failed to delete account.');
            setAlertVariant('danger');
            setShowAlert(true);
        }
    };

    return (
        <Container // Sticky logic Start ---------------------------------------
        fluid 
        className="mt-2" 
        style={{ minHeight: '100vh' }} // Add min-height: 100vh
    >
        <Row className="g-0"> {/* Removed sticky styles here */}
            {/* Sidebar Toggle Button (Visible only on mobile, aligned to the right) */}
            <div className="d-flex justify-content-end d-md-none p-3">
                <Button
                    variant="outline-dark"
                    onClick={() => setShowSidebar(!showSidebar)} // Toggle sidebar visibility
                >
                    {showSidebar ? 'Close ✕ ' : 'Menu ☰'} {/* Toggle button text */}
                </Button>
            </div>
    
            {/* Sidebar */}
            <Col 
                md={2} 
                className={`vh-50 p-4 rounded ${showSidebar ? 'd-block' : 'd-none d-md-block'}`}
            >
                <Nav defaultActiveKey="/home" className="flex-column mt-3">
                    <Nav.Link
                        className={`mb-2 p-2 rounded ${activeSection === 'general' ? 'bg-dark text-white' : 'bg-light text-dark'}`}
                        onClick={() => {
                            setActiveSection('general');
                            setShowSidebar(false); // Close sidebar on mobile after clicking a link
                        }}
                    >
                        <i className="bi bi-file-person"></i> General Settings
                    </Nav.Link>
                    <Nav.Link
                        className={`mb-2 p-2 rounded ${activeSection === 'site' ? 'bg-dark text-white' : 'bg-light text-dark'}`}
                        onClick={() => {
                            setActiveSection('site');
                            setShowSidebar(false); // Close sidebar on mobile after clicking a link
                        }}
                    >
                        <i className="bi bi-toggle-off"></i> Site Settings
                    </Nav.Link>
                    <Nav.Link
                        className={`mb-2 p-2 rounded ${activeSection === 'privacy' ? 'bg-dark text-white' : 'bg-light text-dark'}`}
                        onClick={() => {
                            setActiveSection('privacy');
                            setShowSidebar(false); // Close sidebar on mobile after clicking a link
                        }}
                    >
                        <i className="bi bi-file-post"></i> Privacy Policy
                    </Nav.Link>
                </Nav>
            </Col>



            

                {/* Main Content */}
                <Col md={10} className="p-4">
                    {/* Custom Alert Component */}
                    {showAlert && (
                        <Alert
                            variant={alertVariant}
                            onClose={() => setShowAlert(false)}
                            dismissible
                            className="mt-3"
                        >
                            {alertMessage}
                        </Alert>
                    )}

                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

                    {activeSection === 'general' && (
    <Card className="shadow-0 border-0">
        <Card.Body>
            <h5 className="mb-4 text-muted fw-bold">Personal informations</h5>
            <Form onSubmit={handleSubmit}>
                {/* Name and Username */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={userData.name}
                                onChange={handleChange}
                                required
                                className="form-control-sm" // Smaller input
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={userData.username}
                                onChange={handleChange}
                                className="form-control-sm" // Smaller input
                            />
                        </Form.Group>
                    </Col>
                </Row>

             

                {/* Email */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={userData.email}
                                onChange={handleChange}
                                required
                                className="form-control-sm" // Smaller input
                            />
                        </Form.Group>
                    </Col>
                </Row>

               

                {/* Category */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="category">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                name="category"
                                value={userData.category}
                                onChange={handleChange}
                                required
                                className="form-control-sm" // Smaller input
                            />
                        </Form.Group>
                    </Col>
                </Row>

                 {/* Divider */}
<hr 
    className="my-4" 
    style={{ 
        border: '0.5px solid #ddd', // Thinner and muted color
        opacity: 0.5, // Muted effect
    }} 
/>

                {/* New Password (optional) */}
                <Row>
                    <Col md={6}>
                    <h5 className="mb-4 text-muted fw-bold">Account security</h5>
                        <Form.Group className="mb-4" controlId="password">
                            <Form.Label>New Password (optional)</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={userData.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                                className="form-control-sm" // Smaller input
                            />
                        </Form.Group>
                    </Col>
                </Row>

            

                {/* Delete Account Section */}
                <Row>
                    <Col md={6}> {/* Same width as Password input */}
                        <div 
                            style={{ 
                                border: '1px solid red', // Red border
                                borderRadius: '8px', // Rounded corners
                                padding: '16px', // Inner spacing
                                marginBottom: '16px', // Spacing below the div
                            }}
                        >
                            {/* Warning Message */}
                            <p style={{ color: '#dc3546', marginBottom: '12px' }}>
                                Deleting your account cannot be undone, neither our support can help you retrieve your data.
                            </p>

                            {/* Delete Account Button */}
                            <Button
                                variant="outline-danger"
                                className="btn-sm"
                                onClick={() => setShowDeleteModal(true)}
                            >
                               <i class="bi bi-file-x"></i> Delete Account
                            </Button>
                        </div>
                    </Col>
                </Row>

               {/* Update Button */}
<div 
    className="d-flex flex-column align-items-start gap-2" 
    style={{ marginTop: '25px' }} 
>
    <Button type="submit" variant="dark" className="btn-sm">
    <i class="bi bi-arrow-clockwise"></i> Update
    </Button>
</div>
            </Form>
        </Card.Body>
    </Card>
)}

                    {/* Site Settings Section */}
                    {activeSection === 'site' && (
                        <Card className="shadow-0 border-0">
                            <Card.Body>
                                <h5 className="mb-4 text-muted fw-bold">Site Settings</h5>
                                <p>Manage your site settings here.</p>
                            </Card.Body>
                        </Card>
                    )}

                    {/* Privacy Policy Section */}
                    {activeSection === 'privacy' && (
                        <Card className="shadow-0 border-0">
                            <Card.Body>
                                <h5 className="mb-4 text-muted fw-bold">Privacy Policy</h5>
                                <p>Review our privacy policy here.</p>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete your account? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-dark" className="btn-sm" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" className="btn-sm" onClick={handleDeleteAccount}>
                        Delete Account
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Settings;