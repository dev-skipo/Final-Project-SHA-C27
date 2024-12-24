import React, { useEffect, useState } from 'react'; 
import axios from 'axios'; 
import { useNavigate, Link } from 'react-router-dom'; // Import Link 

const Dashboard = () => { 
    const [pages, setPages] = useState([]); 
    const [showPopup, setShowPopup] = useState(false); 
    const [editMode, setEditMode] = useState(false); 
    const [currentPageId, setCurrentPageId] = useState(null); 
    const [title, setTitle] = useState(''); 
    const [description, setDescription] = useState(''); 
    const [links, setLinks] = useState([{ url: '', linkTitle: '' }]); // State to manage links with titles 

    const navigate = useNavigate(); 

    useEffect(() => { 
        fetchPages(); 
    }, []); 

    const fetchPages = async () => { 
        const token = localStorage.getItem('token'); 
        try { 
            const response = await axios.get('http://localhost:5000/api/pages', { headers: { Authorization: `Bearer ${token}` } }); 
            console.log("Fetched pages:", response.data); // Log fetched pages 
            setPages(response.data); // Update state with fetched pages 
        } catch (error) { 
            console.error("Error fetching pages:", error.response ? error.response.data : error.message); 
            alert("Failed to fetch pages."); 
        } 
    }; 

    const handleCreatePage = async () => { 
        const token = localStorage.getItem('token'); 
        try { 
            const response = await axios.post('http://localhost:5000/api/pages', { title, description, links }, // Include links in request body 
            { headers: { Authorization: `Bearer ${token}` } }); 
            console.log("Created page response:", response.data); // Log the response 
            fetchPages(); // Refresh the list of pages after creation 
            resetForm(); // Reset form after creation 
        } catch (error) { 
            console.error("Error creating page:", error.response ? error.response.data : error.message); 
        } 
    }; 

    const handleEditPage = async () => { 
        const token = localStorage.getItem('token'); 
        try { 
            await axios.put(`http://localhost:5000/api/pages/${currentPageId}`, { title, description, links }, // Include links in request body 
            { headers: { Authorization: `Bearer ${token}` } }); 
            fetchPages();
            resetForm(); 
        } catch (error) { 
            console.error("Error updating page:", error.response ? error.response.data : error.message); 
            alert("Failed to update page."); 
        } 
    }; 

    const handleDeletePage = async (pageId) => { 
        const token = localStorage.getItem('token'); 
        if (window.confirm("Are you sure you want to delete this page?")) { // Confirmation before deletion 
            try { 
                await axios.delete(`http://localhost:5000/api/pages/${pageId}`, { headers: { Authorization: `Bearer ${token}` } }); 
                console.log("Deleted page:", pageId); // Log deleted page ID 
                fetchPages(); 
                resetForm(); 
            } catch (error) { 
                console.error("Error deleting page:", error.response ? error.response.data : error.message); 
                alert("Failed to delete page."); 
            } 
        } 
    }; 

    const resetForm = () => { 
        setTitle(''); 
        setDescription(''); 
        setLinks([{ url: '', linkTitle: '' }]); // Reset links state
        setShowPopup(false); 
        setEditMode(false); 
        setCurrentPageId(null); 
    }; 

    const handleEditButtonClick = (page) => { 
        setTitle(page.title); 
        setDescription(page.description);  
        setLinks(page.links || [{ url: '', linkTitle: '' }]);
        setCurrentPageId(page._id);  
        setEditMode(true); 
        setShowPopup(true);  
    }; 


    const handleLinkChange = (index, field, value) => {  
        const newLinks = [...links];  
        newLinks[index][field] = value; // Update specific field based on index and field name  
        setLinks(newLinks);  
    }; 

    // Function to add a new link input field  
    const addLinkField = () => {  
        setLinks([...links, { url: '', linkTitle: '' }]); 
    }; 

    // Function to move a link up in the list  
    const moveLinkUp = (index) => {  
        if (index > 0) {  
            const newLinks = [...links];  
            [newLinks[index], newLinks[index - 1]] = [newLinks[index - 1], newLinks[index]]; // Swap positions  
            setLinks(newLinks);  
        }  
    }; 

    // Function to move a link down in the list  
    const moveLinkDown = (index) => {  
        if (index < links.length - 1) {  
            const newLinks = [...links];  
            [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]]; // Swap positions  
            setLinks(newLinks);  
        }  
    }; 

    return (  
        <div>  
            <h2>Dashboard</h2>  
            {/* Conditionally render the Create Page button */}  
            {pages.length === 0 && (  
                <button onClick={() => { resetForm(); setShowPopup(true); }}>Create Page</button>  
            )}  

            {showPopup && (  
                <div className="popup">  
                    <h3>{editMode ? "Edit Page" : "Create New Page"}</h3>  
                    <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />  
                    <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />  

                    <h4>Links (Optional)</h4>  
                    {links.map((link, index) => (  
                        <div key={index}>  
                            <input type="text" placeholder="Enter link" value={link.url} onChange={(e) => handleLinkChange(index, 'url', e.target.value)} />   
                            <input type="text" placeholder="Link Title" value={link.linkTitle} onChange={(e) => handleLinkChange(index, 'linkTitle', e.target.value)} />   
                            {/* Move buttons */}   
                            <button type="button" onClick={() => moveLinkUp(index)} disabled={index === 0}>Move Up</button>   
                            <button type="button" onClick={() => moveLinkDown(index)} disabled={index === links.length - 1}>Move Down</button>   
                        </div>   
                    ))}  

                    <button type="button" onClick={addLinkField}>Add Link</button>   
                    <button onClick={editMode ? handleEditPage : handleCreatePage}>   
                        {editMode ? "Update" : "Create"}   
                    </button>  
                    <button onClick={resetForm}>Cancel</button>   
                </div>   
            )}  

            <div className="pages-list">   
                {Array.isArray(pages) && pages.length > 0 ? (   
                    pages.map(page => (   
                        <div key={page._id} className="page-card">   
                            {/* Make the entire card clickable */}   
                            <Link to={`/pages/${page._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>   
                                <div>   
                                    <h4>{page.title}</h4>   
                                    <p>{page.description}</p>   
                                    {/* Display links with titles */}   
                                    {page.links.map((linkObj, idx) => (   
                                        <p key={idx}><strong>{linkObj.linkTitle || 'Link'}:</strong> {linkObj.url}</p>   
                                    ))}   
                                </div>   
                            </Link>   

                            <button onClick={() => handleEditButtonClick(page)}>Edit</button> {/* Add Delete Button */}   
                            <button onClick={() => handleDeletePage(page._id)}>Delete</button>   
                        </div>   
                    ))    
                ) : (    
                    <p>No pages available.</p> // Message when there are no pages    
                )}    
            </div>    
        </div>    
    );    
};    

export default Dashboard;
