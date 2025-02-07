import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Form, ListGroup, Nav, Container, Row, Col, Collapse } from 'react-bootstrap';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import SortableLink from './SortableLink'; // Import the SortableLink component

const Dashboard = () => {
    const [pages, setPages] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentPageId, setCurrentPageId] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [links, setLinks] = useState([{ url: '', linkTitle: '' }]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [linkType, setLinkType] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [existingImageUrl, setExistingImageUrl] = useState('');
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [textColor, setTextColor] = useState('#000000');
    const [activeSection, setActiveSection] = useState('page');
    const [selectedTheme, setSelectedTheme] = useState('default');
    const [subscriptions, setSubscriptions] = useState([]);
    const [initialFormData, setInitialFormData] = useState(null); // New state for initial form data
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    
    const [isPageInfoSectionOpen, setIsPageInfoSectionOpen] = useState(true); // Open by default
const [isPageCustomizationOpen, setIsPageCustomizationOpen] = useState(false);
const [isLinksSectionOpen, setIsLinksSectionOpen] = useState(false);


// Sensors for drag-and-drop
const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
    })
);

// Handle drag end
const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
        setLinks((links) => {
            const oldIndex = links.findIndex((link) => link.url === active.id);
            const newIndex = links.findIndex((link) => link.url === over.id);
            return arrayMove(links, oldIndex, newIndex);
        });
    }
};


    const themes = {
        default: { id: 'default', name: 'Default', backgroundColor: '#ffffff', textColor: '#000000' },
        theme1: { id: 'theme1', name: 'Light Theme', backgroundColor: '#ffffff', textColor: '#000000' },
        theme2: { id: 'theme2', name: 'Dark Theme', backgroundColor: '#11feba', textColor: '#064396' },
        theme3: { id: 'theme3', name: 'Blue Theme', backgroundColor: '#064396', textColor: '#11feba' },
    };

    const navigate = useNavigate();

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('https://final-project-sha-c27.onrender.com/api/pages', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPages(response.data);
        } catch (error) {
            console.error("Error fetching pages:", error.response ? error.response.data : error.message);
            alert("Failed to fetch pages.");
        }
    };

    const handleCreatePage = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData();

        formData.append('title', title);
        formData.append('description', description);
        formData.append('backgroundColor', backgroundColor);
        formData.append('textColor', textColor);

        const validLinks = links.filter(link => link.url && link.linkTitle);
        validLinks.forEach((link, index) => {
            formData.append(`links[${index}][url]`, link.url);
            formData.append(`links[${index}][linkTitle]`, link.linkTitle);
        });

        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }

        try {
            const response = await axios.post('https://final-project-sha-c27.onrender.com/api/pages', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPages();
            resetForm();
        } catch (error) {
            console.error("Error creating page:", error.response ? error.response.data : error.message);
        }
    };

    const handleEditPage = async (event) => {
        setShowForm(true); // Show the form and live preview
        event.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData();

        formData.append('title', title);
        formData.append('description', description);
        formData.append('backgroundColor', backgroundColor);
        formData.append('textColor', textColor);

        links.forEach((link, index) => {
            if (link.url && link.linkTitle) {
                formData.append(`links[${index}][url]`, link.url);
                formData.append(`links[${index}][linkTitle]`, link.linkTitle);
            }
        });

        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }

        try {
            await axios.put(`https://final-project-sha-c27.onrender.com/api/pages/${currentPageId}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPages();
            resetForm();
        } catch (error) {
            console.error("Error updating page:", error.response ? error.response.data : error.message);
            alert("Failed to update page.");
        }
    };

    const handleFileChange = (event) => {
        setProfilePicture(event.target.files[0]);
    };

    const handleDeletePage = async (pageId) => {
        const token = localStorage.getItem('token');
        if (window.confirm("Are you sure you want to delete this page?")) {
            try {
                await axios.delete(`https://final-project-sha-c27.onrender.com/api/pages/${pageId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchPages(); // Refresh the list of pages
                resetForm(true); // Force reset to default values and hide the form/live preview
                setInitialFormData(null); // Clear initialFormData
            } catch (error) {
                console.error("Error deleting page:", error.response ? error.response.data : error.message);
                alert("Failed to delete page.");
            }
        }
    };

    const resetForm = (forceReset = false) => {
        if (initialFormData && !forceReset) {
            // Restore form fields to initial data (used when canceling edits)
            setTitle(initialFormData.title);
            setDescription(initialFormData.description);
            setLinks(initialFormData.links);
            setProfilePicture(initialFormData.profilePicture);
            setExistingImageUrl(initialFormData.existingImageUrl);
            setBackgroundColor(initialFormData.backgroundColor);
            setTextColor(initialFormData.textColor);
            setSelectedTheme(initialFormData.selectedTheme);
        } else {
            // If no initial data or forceReset is true, reset to default values
            setTitle('');
            setDescription('');
            setLinks([{ url: '', linkTitle: '' }]);
            setProfilePicture(null);
            setExistingImageUrl('');
            setBackgroundColor('#ffffff');
            setTextColor('#000000');
            setSelectedTheme(themes.default.id);
        }
    
        // Close the form and exit edit mode
        setShowForm(false);
        setEditMode(false);
        setCurrentPageId(null);
        setLinkType(null);
        setDropdownVisible(false);
    };

    const handleEditButtonClick = (page) => {
        // Save initial form data
        setInitialFormData({
            title: page.title,
            description: page.description,
            links: page.links || [{ url: '', linkTitle: '' }],
            profilePicture: page.profilePicture || null,
            existingImageUrl: `https://final-project-sha-c27.onrender.com/uploads/${page.profileImage || ''}`,
            backgroundColor: page.backgroundColor || '#ffffff',
            textColor: page.textColor || '#000000',
            selectedTheme: page.backgroundColor === themes.theme1.backgroundColor ? themes.theme1.id :
                           page.backgroundColor === themes.theme2.backgroundColor ? themes.theme2.id :
                           page.backgroundColor === themes.theme3.backgroundColor ? themes.theme3.id :
                           themes.default.id,
        });

        // Populate form fields with initial data
        setTitle(page.title);
        setDescription(page.description);
        setLinks(page.links || [{ url: '', linkTitle: '' }]);
        setCurrentPageId(page._id);
        setEditMode(true);
        setShowForm(true);
        setExistingImageUrl(`https://final-project-sha-c27.onrender.com/uploads/${page.profileImage || ''}`);
        setBackgroundColor(page.backgroundColor || '#ffffff');
        setTextColor(page.textColor || '#000000');
        setSelectedTheme(
            page.backgroundColor === themes.theme1.backgroundColor ? themes.theme1.id :
            page.backgroundColor === themes.theme2.backgroundColor ? themes.theme2.id :
            page.backgroundColor === themes.theme3.backgroundColor ? themes.theme3.id :
            themes.default.id
        );
    };

    const handleLinkChange = (index, field, value) => {
        const newLinks = [...links];
        newLinks[index][field] = value;
        setLinks(newLinks);
    };

    const addLinkField = () => {
        if (linkType) {
            if (linkType === 'youtube' || linkType === 'link') {
                setLinks([...links, { url: '', linkTitle: '' }]);
                resetLinkType();
            }
        }
    };

    const resetLinkType = () => {
        setLinkType(null);
        setDropdownVisible(false);
    };


    const deleteLinkField = (index) => {
        const updatedLinks = links.filter((_, i) => i !== index);
        setLinks(updatedLinks);
    };

    const handleThemeChange = (event) => {
        const selectedId = event.target.value;
        setSelectedTheme(selectedId);

        if (selectedId === themes.default.id) return;

        const selectedThemeData = Object.values(themes).find(theme => theme.id === selectedId);
        if (selectedThemeData) {
            setBackgroundColor(selectedThemeData.backgroundColor);
            setTextColor(selectedThemeData.textColor);
        }
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

    const fetchSubscriptions = async () => {
        if (currentPageId) {
            try {
                const response = await axios.get(`https://final-project-sha-c27.onrender.com/api/subscriptions/${currentPageId}`);
                setSubscriptions(response.data);
            } catch (error) {
                console.error("Error fetching subscriptions:", error.response ? error.response.data : error.message);
                alert("Failed to fetch subscriptions.");
            }
        }
    };

    useEffect(() => {
        if (activeSection === 'Mail Subscribers') {
            fetchSubscriptions();
        }
    }, [activeSection, currentPageId]);

    useEffect(() => {
        if (activeSection === 'analytics') {
            fetchPages();
        }
    }, [activeSection]);


    const handleOpenPage = (pageId) => {
        window.open(`/pages/${pageId}`, '_blank');
    };

   return (
    <Container // Sticky Side Start --------------------------------------
    fluid 
    className="mt-2" 
    style={{ minHeight: '100vh' }} // Add min-height: 100vh
>
    <Row>
        {/* Sidebar Toggle Button (Visible only on mobile, aligned to the right) */}
        <div className="d-flex justify-content-end d-md-none p-3">
            {/* Toggle Button for Mobile */}
            <Button 
                variant="outline-dark" 
                size="sm" // Make the button smaller
                className="d-md-none mb-1 ms-auto" // Hide on medium and larger screens, align to the right
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                style={{ width: 'fit-content' }} // Adjust width to fit content
            >
                {isSidebarOpen ? 'Close ✕ ' : 'Menu ☰'}
            </Button>
        </div>

        {/* Normal Sidebar (No Sticky Behavior) */}
        <Col 
            md={2} 
            className={`sidebar ${isSidebarOpen ? 'd-block' : 'd-none d-md-block'}`} 
            style={{ 
                height: 'auto', 
                overflowY: 'auto', 
                padding: '20px', 
            }}
        >
            <Nav className="flex-column pt-3">
                <Nav.Link
                    className={`mb-2 p-2 rounded ${activeSection === 'page' ? 'bg-dark text-white' : 'bg-light text-dark'}`}
                    onClick={() => {
                        setActiveSection('page');
                        setIsSidebarOpen(false); // Close sidebar on mobile after clicking a link
                    }}
                >
                    <i className="bi bi-file-earmark"></i> Page
                </Nav.Link>
                <Nav.Link
                    className={`mb-2 p-2 rounded ${activeSection === 'analytics' ? 'bg-dark text-white' : 'bg-light text-dark'}`}
                    onClick={() => {
                        setActiveSection('analytics');
                        setIsSidebarOpen(false); // Close sidebar on mobile after clicking a link
                    }}
                >
                    <i className="bi bi-graph-up"></i> Analytics
                </Nav.Link>
                <Nav.Link
                    className={`mb-2 p-2 rounded ${activeSection === 'Mail Subscribers' ? 'bg-dark text-white' : 'bg-light text-dark'}`}
                    onClick={() => {
                        setActiveSection('Mail Subscribers');
                        setIsSidebarOpen(false); // Close sidebar on mobile after clicking a link
                    }}
                >
                    <i className="bi bi-person"></i> Subscribers
                </Nav.Link>
                <Nav.Link
                    className={`mb-2 p-2 rounded ${activeSection === 'settings' ? 'bg-dark text-white' : 'bg-light text-dark'}`}
                    onClick={() => {
                        setActiveSection('settings');
                        setIsSidebarOpen(false); // Close sidebar on mobile after clicking a link
                    }}
                >
                    <i className="bi bi-sliders2"></i> Page Settings
                </Nav.Link>
            </Nav> 
        </Col> 




        <Col md={showForm ? 10 : 10}> {/* Adjust width based on showForm */}
              {activeSection === 'page' && (
    <div className="mt-4">
        <Row >
            {/* Left Side Content (Existing Pages List and Form) */}
            <Col md={8}>
            <ListGroup className="mt-2">
    {Array.isArray(pages) && pages.length > 0 ? (
        pages.map(page => (
            <ListGroup.Item 
                key={page._id} 
                className="d-flex justify-content-between align-items-center mb-2"
                style={{ flexWrap: 'nowrap' }} // Prevent wrapping on mobile
            >
                {/* Page Title */}
                <div className="text-truncate me-2" style={{ maxWidth: '70%' }}>
                    <strong>{page.title}</strong> {/* Show only the page title */}
                </div>

                {/* Buttons */}
                <div className="d-flex">
                    {/* Edit Button (Hidden if form is open) */}
                    {!showForm && (
                        <Button 
                            variant="warning" 
                            onClick={() => handleEditButtonClick(page)} 
                            className="me-2"
                            size="sm" // Smaller button for mobile
                        >
                            Edit Page
                        </Button>
                    )}
                    <Button 
                        variant="danger" 
                        onClick={() => handleDeletePage(page._id)}
                        size="sm" // Smaller button for mobile
                    >
                        Delete
                    </Button>
                </div>
            </ListGroup.Item>
        ))
    ) : (
        <p>No pages available.</p>
    )}
</ListGroup>

           {!showForm && pages.length === 0 && (
               <Button variant="dark" className="me-2 btn-sm mb-3" onClick={() => { resetForm();  setShowForm(true);  setShowForm(true); }}>Create Page</Button>
             )}

{(showForm || editMode) && (
    <div className="mb-4 p-4 border rounded bg-light">
        <h3 className="mb-4">{editMode ? "Edit Page" : "Create New Page"}</h3>
        <Form onSubmit={editMode ? handleEditPage : handleCreatePage}>
            {/* Page Information Section */}
            <div className="mb-3">
                <h5 
                    onClick={() => setIsPageInfoSectionOpen(!isPageInfoSectionOpen)} 
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                    <i className={`bi bi-chevron-${isPageInfoSectionOpen ? 'down' : 'right'} me-2`}></i>
                    Page Information
                </h5>
                <Collapse in={isPageInfoSectionOpen}>
    <div>
        {/* Div 1: Title and Description (Left Side) */}
        <Row className="mb-3">
            {/* Left Column (Title and Description) */}
            <Col md={6}>
                {/* Title */}
                <Form.Group controlId="formTitle" className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="form-control-sm"
                    />
                </Form.Group>

                {/* Description */}
                <Form.Group controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        style={{ height: '100px' }}
                        className="form-control-sm"
                    />
                </Form.Group>
            </Col>

            {/* Vertical Divider (Visible only on PC) */}
            <Col md={1} className="d-none d-md-flex justify-content-center align-items-center">
                <div style={{ height: '100%', width: '1px', backgroundColor: '#dee2e6' }}></div>
            </Col>

            {/* Right Column (Image Preview and Upload Input) */}
            <Col md={5}>
                {/* Image Preview */}
                {editMode && existingImageUrl && (
                    <div className="mb-3 text-center text-md-start"> {/* Center on mobile, start on PC */}
                        <h6>Current Image:</h6>
                        <img
                            src={existingImageUrl}
                            alt="Profile"
                            style={{ maxWidth: '100px', height: 'auto', borderRadius: '8px' }}
                        />
                    </div>
                )}

                {/* Upload Input */}
                <Form.Group controlId="formProfilePicture">
                    <Form.Label>Profile Picture</Form.Label>
                    <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="form-control-sm"
                    />
                </Form.Group>
            </Col>
        </Row>
    </div>
</Collapse>
            </div>
            <hr className="my-4" />

            {/* Page Customization Section */}
            <div className="mb-3">
                <h5 
                    onClick={() => setIsPageCustomizationOpen(!isPageCustomizationOpen)} 
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                    <i className={`bi bi-chevron-${isPageCustomizationOpen ? 'down' : 'right'} me-2`}></i>
                    Page Customization
                </h5>
                <Collapse in={isPageCustomizationOpen}>
    <div>
        <Row className="mb-3">
            {/* Left Column: Background Color and Text Color */}
            <Col md={6} className="d-flex flex-column justify-content-center align-items-start"> {/* Center-left alignment */}
                {/* Background Color */}
                <Form.Group controlId="formBackgroundColor" className="mb-3">
                    <Form.Label>Background Color</Form.Label>
                    <div className="d-flex align-items-center gap-2"> {/* Flex container for color picker and hex input */}
                        {/* Color Picker */}
                        <Form.Control
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="form-control-sm"
                            style={{ width: '50px', height: '38px' }} // Adjust size of color picker
                        />
                        {/* Hex Code Input */}
                        <Form.Control
                            type="text"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            placeholder="#FFFFFF"
                            className="form-control-sm"
                            style={{ width: '100px' }} // Adjust width of hex input
                        />
                    </div>
                </Form.Group>

                {/* Text Color */}
                <Form.Group controlId="formTextColor">
                    <Form.Label>Text Color</Form.Label>
                    <div className="d-flex align-items-center gap-2"> {/* Flex container for color picker and hex input */}
                        {/* Color Picker */}
                        <Form.Control
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="form-control-sm"
                            style={{ width: '50px', height: '38px' }} // Adjust size of color picker
                        />
                        {/* Hex Code Input */}
                        <Form.Control
                            type="text"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            placeholder="#000000"
                            className="form-control-sm"
                            style={{ width: '100px' }} // Adjust width of hex input
                        />
                    </div>
                </Form.Group>
            </Col>

            {/* Vertical Divider (Visible only on PC) */}
            <Col md={1} className="d-none d-md-flex justify-content-center align-items-center">
                <div style={{ height: '100%', width: '1px', backgroundColor: '#dee2e6' }}></div>
            </Col>

            {/* Right Column: Theme Selection */}
            <Col md={5}>
                <Form.Group>
                    <Form.Label>Select a Theme</Form.Label>
                    <Row>
                        {Object.values(themes).map((theme) => (
                            <Col key={theme.id} md={12} className="mb-2"> {/* Full width on mobile, stacked */}
                                <Form.Check
                                    type="radio"
                                    id={theme.id}
                                    label={theme.name}
                                    name="theme"
                                    value={theme.id}
                                    checked={selectedTheme === theme.id}
                                    onChange={handleThemeChange}
                                />
                            </Col>
                        ))}
                    </Row>
                </Form.Group>
            </Col>
        </Row>
    </div>
</Collapse>
            </div>
            <hr className="my-4" />

            {/* Page Links Section */}
            <div className="mb-4">
                <h5 
                    onClick={() => setIsLinksSectionOpen(!isLinksSectionOpen)} 
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                    <i className={`bi bi-chevron-${isLinksSectionOpen ? 'down' : 'right'} me-2`}></i>
                    Page Links
                </h5>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
    <SortableContext items={links.map((link) => link.url)}>
        <Collapse in={isLinksSectionOpen}>
            <div>
                {links.map((link, index) => (
                    <SortableLink
                        key={link.url}
                        id={link.url}
                        link={link}
                        index={index}
                        handleLinkChange={handleLinkChange}
                        deleteLinkField={deleteLinkField} // Pass the corrected function
                    />
                ))}

                {/* Add Link Button */}
                <div className="mb-4 pt-2">
                    <Button variant="dark" className="me-2 btn-sm px-2 rounded-pill" onClick={() => setDropdownVisible(!dropdownVisible)}>
                        <i className="bi bi-plus-circle"></i> Add Link
                    </Button>
                    {dropdownVisible && (
                        <div className="mt-2">
                            <Button
                                variant="outline-secondary"
                                onClick={() => { setLinkType('youtube'); addLinkField(); }}
                                className="me-2 btn-sm rounded-pill"
                            >
                                <i className="bi bi-play-circle"></i> YouTube Video
                            </Button>
                            <Button
                                variant="outline-secondary"
                                onClick={() => { setLinkType('link'); addLinkField(); }}
                                className="me-2 btn-sm rounded-pill px-3"
                            >
                                <i className="bi bi-link-45deg"></i> Link
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Collapse>
    </SortableContext>
</DndContext>
            </div>

           {/* Submit and Cancel Buttons */}
           <div className="mt-4 d-flex justify-content-end">
                {(title !== '' || description !== '' || links.some(link => link.url !== '' || link.linkTitle !== '') || profilePicture !== null || backgroundColor !== '#ffffff' || textColor !== '#000000') ? (
                    editMode ? (
                        <Button variant="dark" type="submit" className="me-2 btn-sm">
                            Update
                        </Button>
                    ) : (
                        <Button variant="dark" type="submit" className="me-2 btn-sm">
                            Create
                        </Button>
                    )
                ) : (
                    editMode && (
                        <Button variant="primary" type="submit" disabled className="me-2 btn-sm">
                            Update
                        </Button>
                    )
                )}
                <Button variant="outline-dark" className="btn-sm" onClick={resetForm}>
                    Cancel
                </Button>
            </div>
        </Form>
    </div>
)}

            </Col>

 

   {/* Right Side Card (Live Preview) */}
   {showForm && ( // Only show the live preview when the form is visible
    <Col md={4} xs={12} className="pb-4 pt-2"> {/* Column takes 50% width on medium and larger screens, full width on smaller screens */}
        <div style={{ position: 'sticky', top: '20px' }}>
            
            {/* Small Div for Buttons */}
            {currentPageId && (
                <div 
                    className="bg-light rounded border"
                    style={{ 
                        width: '100%', // Full width
                        display: 'flex', 
                        justifyContent: 'space-between', // Space between buttons
                        alignItems: 'center', // Center buttons vertically
                        padding: '6px', // Add some padding
                        marginBottom: '10px' // Add margin at the bottom
                    }}
                >
                    {/* Copy Link Button */}
                    <Button 
                        variant={isCopied ? "success" : "outline-dark"} // Change to green when copied
                        size="sm" 
                        onClick={() => {
                            navigator.clipboard.writeText(`https://astonishing-piroshki-4eba3c.netlify.app/pages/${currentPageId}`);
                            setIsCopied(true); // Set isCopied to true
                            setTimeout(() => setIsCopied(false), 2000); // Revert after 2 seconds
                        }}
                    >
                        {isCopied ? (
                            <>
                                <i className="bi bi-clipboard-check"></i> Link Copied!
                            </>
                        ) : (
                            <>
                                <i className="bi bi-clipboard"></i> Copy Link
                            </>
                        )}
                    </Button>

                    {/* Open Page Button */}
                    <Button 
                        variant="dark" 
                        size="sm" 
                        onClick={() => handleOpenPage(currentPageId)}
                    >
                        Open Page <i className="bi bi-arrow-right-short"></i>
                    </Button>
                </div>
            )}

            {/* Live Preview Card */}
            <Card
                className="text-center mx-auto border" // Center the card horizontally
                style={{
                    width: '100%', // Full width on smaller screens
                    maxWidth: '600px', // Fixed width on larger screens
                    backgroundColor: backgroundColor || '#ffffff', // Use backgroundColor prop or fallback to white
                    color: textColor || '#000000',
                    position: 'relative',
                    marginBottom: '20px', // Add some margin at the bottom of the card
                    border: 'none', // Remove the card border
                    minHeight: '40vh' // Add minimum height of 50px
                }}
            >
                {/* Subscribe Button (Non-functional in Preview) */}
                <Button 
                    variant="secondary" 
                    className="position-absolute top-0 start-0 m-2"
                    disabled
                >
                    <i className="bi bi-bell"></i> 
                </Button>

                {/* Share Button (Non-functional in Preview) */}
                <Button 
                    variant="secondary" 
                    className="position-absolute top-0 end-0 m-2"
                    disabled
                >
                    <i className="bi bi-three-dots-vertical"></i> 
                </Button>

                {/* Display Profile Image */}
                <div 
                    className="mt-3" 
                    style={{ 
                        width: '100px', // Fixed width for the container
                        height: '100px', // Fixed height for the container
                        borderRadius: '50%', // Circular container (optional)
                        overflow: 'hidden', // Ensure the image stays within the container
                        margin: '0 auto', // Center the container horizontally
                        backgroundColor: '#f0f0f0', // Fallback background color
                        display: 'flex', // 
                        justifyContent: 'center', // Center horizontally
                        alignItems: 'center', // Center vertically
                        backgroundImage: `url('https://i.ibb.co/BVCbLgf/Untitled-design-5.png')`, // Use profile image or fallback image
                        backgroundSize: 'cover', // Ensure the background image covers the container
                        backgroundPosition: 'center' // Center the background image
                    }}
                >
                    {profilePicture || existingImageUrl ? (
                        <img 
                            src={
                                profilePicture ? 
                                URL.createObjectURL(profilePicture) : 
                                existingImageUrl
                            } 
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
                    {/* Display Title */}
                    <Card.Title>{title || "Link Bio"}</Card.Title>

                    {/* Display Description */}
                    <Card.Text>{description || "Create Page to start Live Preview."}</Card.Text>

                    {/* Display Links */}
                    {links.length > 0 && (
                        <ul className="list-unstyled">
                            {links.map((link, index) => (
                                link.url && link.linkTitle && (
                                    <li key={index}>
                                        {link.url.includes('youtube.com/watch?v=') || link.url.includes('youtu.be/') ? (
                                            <div style={{ 
                                                position: 'relative', 
                                                paddingBottom: '56.25%', 
                                                height: 0, 
                                                overflow: 'hidden',
                                                margin: '10px 0' // Add margin for spacing
                                            }}>
                                                <iframe
                                                    src={getYouTubeEmbedUrl(link)}
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
                                                onClick={() => window.open(link.url.startsWith('http') ? link.url : `http://${link.url}`, '_blank')} 
                                                className="m-1 w-100"
                                                style={{
                                                    backgroundColor: textColor || '#000000', // Background color = textColor
                                                    color: backgroundColor || '#ffffff', // Text color = backgroundColor
                                                    border: 'none' // Remove default border
                                                }}
                                            >
                                                {link.linkTitle}
                                            </Button>
                                        )}
                                    </li>
                                )
                            ))}
                        </ul>
                    )}
                </Card.Body>
            </Card>
        </div>
    </Col>
)}
        </Row>
    </div>
)}

{activeSection === 'analytics' && (
    <>
      <div className="mb-5 pt-5 ">
        {/* Analytics Section */}
        <h2>Analytics</h2>
        {pages.length === 0 ? (
            <div>
                <p>You don't have any pages. Create one to start tracking your page views.</p>
               
            </div>
        ) : (
            <Row className="mt-4">
                {pages.map(page => (
                    <Col md={4} key={page._id} className="mb-3">
                        <div className="card text-center">
                            <div className="card-body">
                                <h2 className="card-text">{page.viewCount !== undefined ? page.viewCount : '--'}</h2>
                                <p className="card-text">Views</p>
                            </div>
                        </div>
                    </Col>
                ))}
                {/* Premium Card */}
                <Col md={4} className="mb-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h2 className="card-text">More Analytics?</h2>
                            <p className="card-text">Go Premium</p>
                        </div>
                    </div>
                </Col>
            </Row>
        )}
        </div>
    </>
)}



                  {activeSection === 'settings' && (
                      <>
                      <div className="mb-5 pt-5 ">
                          {/* Page Settings Section */}
                          <h2>Page Settings</h2>
                          {/* This section is currently empty */}
                          <p>No settings available.</p>
                          </div>
                      </>
                  )}

{activeSection === 'Mail Subscribers' && (
    <>
     <div className="mb-5 pt-5 ">
        <h2>Mail Subscribers</h2>
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Total Subscribers: {subscriptions.length}</h5> {/* Displaying the count of subscriptions */}
            <Button variant="outline-dark"><i class="bi bi-envelope-at m-1"></i> Mail Settings</Button> {/* Mail Settings Button */}
        </div>
        {subscriptions.length > 0 ? (
            <ListGroup>
                {subscriptions.map((subscription) => (
                    <ListGroup.Item key={subscription._id} className="d-flex justify-content-between align-items-center">
                        <span>{subscription.email}</span>
                        <div>
                            <Button variant="dark" size="sm"><i class="bi bi-exclamation-triangle"></i></Button> {/* Only Report button */}
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        ) : (
            <p>No subscribers found.</p>
        )}
        </div>
    </>
)}

               </Col>
           </Row>
      </Container>
   );
};

export default Dashboard;
