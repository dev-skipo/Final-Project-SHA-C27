import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const PageDetails = () => {
    const { id } = useParams(); // Get the page ID from the URL parameters
    const [page, setPage] = useState(null);

    useEffect(() => {
        fetchPageDetails();
    }, [id]);

    const fetchPageDetails = async () => {
        const token = localStorage.getItem('token'); // Get token from local storage
        console.log("Fetching details for ID:", id); // Log the ID being fetched
        console.log("Using token:", token); // Log the token being used

        try {
            const response = await axios.get(`https://final-project-sha-c27.onrender.com/api/pages/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Fetched page data:", response.data); // Log the fetched data
            setPage(response.data); // Set fetched data to state
        } catch (error) {
            console.error("Error fetching page details:", error.response ? error.response.data : error.message);
            alert("Failed to fetch page details.");
        }
    };

    if (!page) return <div>Loading...</div>; // Show loading state while fetching data

    return (
        <div>
            <h2>{page.title}</h2>
            <p>{page.description}</p>
            <p><strong>Created at:</strong> {new Date(page.createdAt).toLocaleString()}</p>
            <p><strong>Updated at:</strong> {new Date(page.updatedAt).toLocaleString()}</p>

            {/* Displaying links */}
            {page.links && page.links.length > 0 && (
                <div>
                    <h3>Links:</h3>
                    <ul>
                        {page.links.map((link, index) => (
                            <li key={index}>
                                {/* Format link as a clickable URL */}
                                <Link to={link.startsWith('http') ? link : `http://${link}`} style={{ color: 'blue', textDecoration: 'underline' }}>
                                    {link}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Watermark at the bottom */}
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
                <Link to="/register" style={{ color: 'gray', textDecoration: 'none' }}>
                    Made By XXX
                </Link>
            </p>
        </div>
    );
};

export default PageDetails;