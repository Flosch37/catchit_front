import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserPage.css';

function UserPage() {
    const [userCollections, setUserCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUserCollections();
    }, []);

    const fetchUserCollections = () => {
        setLoading(true);
        axios.get('http://localhost:3000/collection/users', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}` // Assuming you store the access token in localStorage
            }
        })
            .then(response => {
                setUserCollections(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the user collections: ", error);
                setError('There was an error loading the user collections.');
                setLoading(false);
            });
    };

    const deleteCollection = (id) => {
        axios.delete(`http://localhost:3000/collection/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then(() => {
                fetchUserCollections();
            })
            .catch(error => {
                console.error("There was an error deleting the collection: ", error);
            });
    };

    const navigateToForm = (collectionId) => {
        // Vous implémenteriez ici la logique de navigation, éventuellement en utilisant useHistory de react-router-dom
        // Par exemple : history.push(`/collections/edit/${collectionId}`);
        console.log(`Navigate to form for collection: ${collectionId || 'new'}`);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="user-page">
            <h1>Bienvenue sur CatchIt</h1>
            <button onClick={() => navigateToForm()}>Créer une nouvelle collection</button>
            <div className="my-collections">
                <h2>Mes Collections</h2>
                {userCollections.length === 0 ? (
                    <p>Vous n'avez pas créé de collection pour le moment.</p>
                ) : (
                    <div className="collections-list">
                        {userCollections.map(collection => (
                            <div key={collection.id} className="collection-item">
                                <h3>{collection.name}</h3>
                                <p>{collection.description}</p>
                                <button onClick={() => navigateToForm(collection.id)}>Modifier</button>
                                <button onClick={() => deleteCollection(collection.id)}>Supprimer</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserPage;
