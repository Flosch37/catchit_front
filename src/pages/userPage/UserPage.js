import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './UserPage.css';

function CollectionForm({ onCollectionCreated }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post(`http://localhost:3000/collection/add`,
                { name, description, isAdmin: false, userId: jwtDecode(token).userId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onCollectionCreated();
        } catch (error) {
            console.error("There was an error creating the collection: ", error);
        }
    };
    

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Nom:
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
                Description:
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>
            <button type="submit">Créer</button>
        </form>
    );
}

function UserPage() {
    const [userCollections, setUserCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                fetchUserCollections(decoded.userId);
            } catch (error) {
                console.error("Error decoding token: ", error);
                setError('Failed to authenticate user.');
                setLoading(false);
            }
        } else {
            setError('No authentication token found.');
            setLoading(false);
        }
    }, []);

    const fetchUserCollections = (userId) => {
        setLoading(true);
        axios.get(`http://localhost:3000/collection/collections/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            setUserCollections(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error("There was an error fetching the collections: ", error);
            setError('There was an error loading the collections.');
            setLoading(false);
        });
    };

    const handleCollectionCreated = () => {
        setShowForm(false);
        fetchUserCollections();
    };

    // Cette fonction semble être appelée mais n'est pas définie. Voici un exemple de définition :
    const navigateToForm = (collectionId) => {
        console.log(`Navigate to form for collection ID: ${collectionId}`);
        // Ici, vous pouvez ajouter la logique pour naviguer vers le formulaire de modification de la collection
    };

    const deleteCollection = (collectionId) => {
        axios.delete(`http://localhost:3000/collection/${collectionId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            console.log("Delete de la collection avec l'id :" + collectionId + " réussi, réponse :", response);
        })
        .catch(error => {
            console.error("There was an error fetching the collections: ", error);
            setError('There was an error loading the collections.');
        });
    };


    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="user-page">
            <h1>Bienvenue sur CatchIt</h1>
            {showForm ? (
                <CollectionForm onCollectionCreated={handleCollectionCreated} />
            ) : (
                <button onClick={() => setShowForm(true)}>Créer une nouvelle collection</button>
            )}
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
