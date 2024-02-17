import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomePage.css';

function HomePage() {
    const [latestCollections, setLatestCollections] = useState([]);
    const [mostUserItemsOwned, setMostUserItemsOwned] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchCollections = axios.get('http://localhost:3000/api/collection/all');
        const fetchUserItemsOwned = axios.get('http://localhost:3000/api/userItemsOwned/all');

        Promise.all([fetchCollections, fetchUserItemsOwned])
            .then(([collectionsResponse, itemsOwnedResponse]) => {
                setLatestCollections(collectionsResponse.data);
                setMostUserItemsOwned(itemsOwnedResponse.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the data!", error);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>There was an error loading the data: {error}.</div>;
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
            <div className='most-owned-items'>
                <h2>Les objets les plus collectionnés</h2>
                <div className="items-list">
                    {mostUserItemsOwned.map(item => (
                        <div key={item.id} className="item-owned">
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>  
                        </div>
                       
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HomePage;
