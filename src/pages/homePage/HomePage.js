import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomePage.css';

function HomePage() {
    const [latestCollections, setLatestCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3000/api/collection/all') 
            .then(response => {
                setLatestCollections(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the collections!", error);
                setError(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>There was an error loading the collections.</div>;
    }

    return (
        <div className="homepage">
            <h1>Bienvenue sur CatchIt</h1>
            <div className="latest-collections">
                <h2>Dernières Collections</h2>
                <div className="collections-list">
                    {latestCollections.map(collection => (
                        <div key={collection.id} className="collection-item">
                            <h3>{collection.name}</h3>
                            <p>{collection.description}</p>
                            
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HomePage;
