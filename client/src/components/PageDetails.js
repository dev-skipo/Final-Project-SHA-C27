import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react'; // Import QRCodeSVG

const PageDetails = () => {
    const { id } = useParams();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSharePopup, setShowSharePopup] = useState(false);
    const [showSubscribePopup, setShowSubscribePopup] = useState(false); // State for subscribe popup
    const [email, setEmail] = useState(''); // State for email input
    const [consent1, setConsent1] = useState(false); // State for first consent checkbox
    const [consent2, setConsent2] = useState(false); // State for second consent checkbox
    const [isLinkCopied, setIsLinkCopied] = useState(false); // State for success message
    const [buttonText, setButtonText] = useState('Subscribe'); // State for button text
    const [buttonVariant, setButtonVariant] = useState('dark'); // State for button color

    useEffect(() => {
        fetchPageDetails();
        incrementPageView();
    }, [id]);

    const incrementPageView = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(`http://localhost:5000/api/pages/${id}/view`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Error incrementing view count:", error.response ? error.response.data : error.message);
        }
    };

    const fetchPageDetails = async () => {
        const token = localStorage.getItem('token');
        console.log("Fetching details for ID:", id);

        try {
            const response = await axios.get(`http://localhost:5000/api/pages/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Fetched page data:", response.data);
            setPage(response.data);
        } catch (error) {
            console.error("Error fetching page details:", error.response ? error.response.data : error.message);
            alert("Failed to fetch page details.");
        } finally {
            setLoading(false);
        }
    };

    const isYouTubeLink = (link) => {
        return link.url.includes('youtube.com/watch?v=') || link.url.includes('youtu.be/');
    };

    const getYouTubeEmbedUrl = (link) => {
        let videoId;
        if (link.url.includes('youtube.com/watch?v=')) {
            videoId = link.url.split('v=')[1].split('&')[0];
        } else if (link.url.includes('youtu.be/')) {
            videoId = link.url.split('youtu.be/')[1].split('?')[0];
        }
        return `https://www.youtube.com/embed/${videoId}`;
    };

    const handleLinkClick = (url) => {
        window.open(url.startsWith('http') ? url : `http://${url}`, '_blank');
    };

    const handleShareToFacebook = () => {
        const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;
        window.open(facebookShareUrl, '_blank');
    };

    const handleShareToWhatsApp = () => {
        const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(window.location.href)}`;
        window.open(whatsappShareUrl, '_blank');
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                setIsLinkCopied(true); // Show success message
                setTimeout(() => setIsLinkCopied(false), 3000); // Hide message after 3 seconds
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    const handleSubscribe = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    pageId: id // Assuming 'id' is the ID of the current page
                })
            });

            const data = await response.json();

            if (response.ok) {
                setEmail(''); // Clear input on success
                setConsent1(false); // Reset consent checkboxes
                setConsent2(false);
                setButtonText('Subscribed'); // Change button text
                setButtonVariant('success'); // Change button color to green

                // Revert button back to original state after 2 seconds
                setTimeout(() => {
                    setButtonText('Subscribe');
                    setButtonVariant('dark');
                    setShowSubscribePopup(false); // Close popup on success
                }, 1000);
            } else {
                alert(data.message); // Show error message if any
            }
        } catch (error) {
            console.error('Error subscribing:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <Container
            fluid // Make the container full-width
            className="d-flex flex-column justify-content-center align-items-center"
            style={{
                minHeight: '100vh', // Ensure the container takes up the full viewport height
                paddingTop: '20px', // Add padding at the top to prevent the card from touching the top of the page
                paddingBottom: '20px', // Add padding at the bottom for the watermark
                backgroundColor: page.backgroundColor || '#ffffff' // Move the background color here
            }}
        >
            {/* Card Section */}
            <Row className="justify-content-center w-100">
                <Col md={6} xs={12}> {/* Column takes 50% width on medium and larger screens, full width on smaller screens */}
                    <Card
                        className="text-center mx-auto" // Center the card horizontally
                        style={{
                            width: '100%', // Full width on smaller screens
                            maxWidth: '600px', // Fixed width on larger screens
                            backgroundColor: 'transparent', // Remove the card background color
                            color: page.textColor || '#000000',
                            position: 'relative',
                            marginBottom: '20px', // Add some margin at the bottom of the card
                            border: 'none' // Remove the card border
                        }}
                    >
                        {/* Subscribe Button positioned at the top left */}
                        <Button
                            variant="secondary"
                            onClick={() => setShowSubscribePopup(true)} // Open subscribe popup
                            className="position-absolute top-0 start-0 m-2"
                        >
                            <i className="bi bi-bell"></i> Subscribe
                        </Button>

                        {/* Share Button positioned at the top right */}
                        <Button
                            variant="dark"
                            onClick={() => setShowSharePopup(true)}
                            className="position-absolute top-0 end-0 m-2"
                        >
                            <i className="bi bi-three-dots-vertical"></i> Share
                        </Button>

                        {/* Display profile image */}
                        <div
                            className="mt-3"
                            style={{
                                width: '100px', // Fixed width for the container
                                height: '100px', // Fixed height for the container
                                borderRadius: '50%', // Circular container (optional)
                                overflow: 'hidden', // Ensure the image stays within the container
                                margin: '0 auto', // Center the container horizontally
                                backgroundColor: '#f0f0f0', // Fallback background color
                                display: 'flex', // Use Flexbox for centering
                                justifyContent: 'center', // Center horizontally
                                alignItems: 'center', // Center vertically
                                backgroundImage: `url(${page.profileImage ? `http://localhost:5000/uploads/${page.profileImage}` : 'https://i.ibb.co/BVCbLgf/Untitled-design-5.png'})`, // Use profile image or fallback image
                                backgroundSize: 'cover', // Ensure the background image covers the container
                                backgroundPosition: 'center' // Center the background image
                            }}
                        >
                            {page.profileImage ? (
                                <img
                                    src={`http://localhost:5000/uploads/${page.profileImage}`}
                                    alt="" // Empty alt text to hide fallback text
                                    style={{
                                        width: '100%', // Fill the container
                                        height: '100%', // Fill the container
                                        objectFit: 'cover' // Ensure the image covers the container without distortion
                                    }}
                                />
                            ) : null}
                        </div>
                        <Card.Body>
                            <Card.Title>{page.title}</Card.Title>
                            <Card.Text>{page.description}</Card.Text>

                            {/* Displaying links */}
                            {page.links && page.links.length > 0 && (
                                <div>
                                    <ul className="list-unstyled">
                                        {page.links.map((linkObj, index) => (
                                            <li key={index}>
                                                {isYouTubeLink(linkObj) ? (
                                                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', margin: '10px 0' }}>
                                                        <iframe
                                                            src={getYouTubeEmbedUrl(linkObj)}
                                                            frameBorder="0"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                            title="Embedded youtube"
                                                            style={{
                                                                position: 'absolute',
                                                                top: 0,
                                                                left: 0,
                                                                width: '100%',
                                                                height: '100%',
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <Button
                                                        variant="primary"
                                                        onClick={() => handleLinkClick(linkObj.url)}
                                                        className="m-1 w-100" // Changed from m-1 to m-2 for more spacing
                                                        style={{
                                                            backgroundColor: page.textColor || '#000000', // Background color = page.textColor
                                                            color: page.backgroundColor || '#ffffff', // Text color = page.backgroundColor
                                                            border: 'none' // Remove default border
                                                        }}
                                                    >
                                                        {linkObj.linkTitle}
                                                    </Button>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Share Popup */}
            <Modal show={showSharePopup} onHide={() => setShowSharePopup(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Share This Page</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {/* QR Code */}
                    <div className="mb-3">
                        <QRCodeSVG value={window.location.href} size={300} /> {/* Use QRCodeSVG */}
                        <p className="mt-2">Scan to share</p>
                    </div>
                    <hr style={{ width: '50%', margin: '20px auto', border: '1px solid #ccc' }} />
                    {/* Buttons Grid */}
                    <Row className="g-3 justify-content-center"> {/* Adjust gap as needed */}
                        {/* Share on Facebook Button */}
                        <Col xs={4} sm={3} className="p-1"> {/* Use xs={4} for equal spacing on phones */}
                            <div className="d-flex flex-column align-items-center"> {/* Stack button and text vertically */}
                                <Button
                                    variant="primary"
                                    onClick={handleShareToFacebook}
                                    className="rounded-circle p-0 mb-2" // Add margin below the button
                                    style={{ width: '50px', height: '50px' }} // Fixed size for the circle
                                >
                                    <i className="bi bi-facebook"></i> {/* Facebook icon */}
                                </Button>
                                <p className="m-0 text-center">Share to Facebook</p> {/* Centered text */}
                            </div>
                        </Col>

                        {/* Copy Link Button */}
                        <Col xs={4} sm={3} className="p-1"> {/* Use xs={4} for equal spacing on phones */}
                            <div className="d-flex flex-column align-items-center"> {/* Stack button and text vertically */}
                                <Button
                                    variant="secondary"
                                    onClick={handleCopyLink}
                                    className="rounded-circle p-0 mb-2" // Add margin below the button
                                    style={{ width: '50px', height: '50px' }} // Fixed size for the circle
                                >
                                    <i className="bi bi-link-45deg"></i> {/* Link icon */}
                                </Button>
                                <p className="m-0 text-center">Copy Link</p> {/* Centered text */}
                            </div>
                        </Col>

                        {/* Share to WhatsApp Button */}
                        <Col xs={4} sm={3} className="p-1"> {/* Use xs={4} for equal spacing on phones */}
                            <div className="d-flex flex-column align-items-center"> {/* Stack button and text vertically */}
                                <Button
                                    variant="success"
                                    onClick={handleShareToWhatsApp} // Updated onClick handler
                                    className="rounded-circle p-0 mb-2" // Add margin below the button
                                    style={{ width: '50px', height: '50px' }} // Fixed size for the circle
                                >
                                    <i className="bi bi-whatsapp"></i> {/* WhatsApp icon */}
                                </Button>
                                <p className="m-0 text-center">Share to WhatsApp</p> {/* Centered text */}
                            </div>
                        </Col>
                        {isLinkCopied && ( // Conditionally render success message
                            <p className="m-0 text-center text-dark">Link copied successfully!</p>
                        )}
                    </Row>
                </Modal.Body>
            </Modal>

            {/* Subscribe Popup */}
            <Modal show={showSubscribePopup} onHide={() => setShowSubscribePopup(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Subscribe</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Subscribe to stay updated with {page?.title}</p>
                    <Form.Group controlId="subscribeEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    {/* Consent Checkboxes */}
                    <Form.Group className="mt-3">
                        <Form.Check
                            type="checkbox"
                            label="I agree to LinkBio T&Cs and Privacy Notice."
                            checked={consent1}
                            onChange={(e) => setConsent1(e.target.checked)}
                        />
                        <Form.Check
                            type="checkbox"
                            label={`I agree to my contact details being shared with ${page?.title}, who may contact me.`}
                            checked={consent2}
                            onChange={(e) => setConsent2(e.target.checked)}
                        />
                    </Form.Group>

                    {/* Subscribe Button (Disabled until both checkboxes are checked) */}
                    <Button
                        variant={buttonVariant}
                        onClick={handleSubscribe}
                        className="mt-3 w-100"
                        disabled={!consent1 || !consent2 || !email} // Disable if either checkbox is unchecked or email is empty
                    >
                        {buttonText}
                    </Button>
                </Modal.Body>
            </Modal>

            {/* Watermark at the bottom */}
            <div className="text-center mt-4">
                <p>
                    <a href="/register" style={{ color: 'gray', textDecoration: 'none' }}>
                        Made By LinkBio, Create Your Page Free!
                    </a>
                </p>
            </div>
        </Container>
    );
};

export default PageDetails;