import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PageDetails = () => {
    const { id } = useParams(); // Get the page ID from the URL parameters
    const [page, setPage] = useState(null);

    useEffect(() => {
        fetchPageDetails();
    }, [id]);

    const fetchPageDetails = async () => {
        const token = localStorage.getItem('token'); // Get token from local storage
        console.log("Fetching details for ID:", id); // Log the ID being fetched

        try {
            const response = await axios.get(`http://localhost:5000/api/pages/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Fetched page data:", response.data); // Log the fetched data
            setPage(response.data); // Set fetched data to state
        } catch (error) {
            console.error("Error fetching page details:", error.response ? error.response.data : error.message);
            alert("Failed to fetch page details.");
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
        window.open(url.startsWith('http') ? url : `http://${url}`, '_blank'); // Open link in a new tab
    };

    if (!page) return <div>Loading...</div>; // Show loading state while fetching data

    return (
        <div>
            <h2>{page.title}</h2>
            <p>{page.description}</p>
            <p><strong>Joined :</strong> {new Date(page.createdAt).toLocaleString()}</p>

            {/* Displaying links */}
            {page.links && page.links.length > 0 && (
                <div>
                    <h3>Links:</h3>
                    <ul>
                        {page.links.map((linkObj, index) => (
                            <li key={index}>
                                {/* Check if the link is a YouTube link */}
                                {isYouTubeLink(linkObj) ? (
                                    // Embed YouTube video
                                    <iframe 
                                        width="560" 
                                        height="315" 
                                        src={getYouTubeEmbedUrl(linkObj)} 
                                        frameBorder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen 
                                        title="Embedded youtube"
                                    />
                                ) : (
                                    // Display provider and link with title as a button
                                    <span>
                                        <button 
                                            onClick={() => handleLinkClick(linkObj.url)} 
                                            style={{ marginLeft: '10px', cursor: 'pointer', color: 'white', backgroundColor: 'blue', border: 'none', borderRadius: '5px', padding: '5px 10px' }}
                                        >
                                            {linkObj.linkTitle}
                                        </button>
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Watermark at the bottom */}
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
                <a href="/register" style={{ color: 'gray', textDecoration: 'none' }}>
                    Made By XXX
                </a>
            </p>
        </div>
    );
};

export default PageDetails;