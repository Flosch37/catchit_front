import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPage.css';

function AdminPage() {
    const [bddItems, setbddItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3000/collection') 
            .then(response => {
                setbddItems(response.data); // Correction ici
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

    const fetchAllCollection = () => {
        axios.get('http://localhost:3000/collection') 
            .then(response => {
                setbddItems(response.data); // Correction ici
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the collections!", error);
                setError(error);
                setLoading(false);
            });
    }

    const fetchItemsByCollectionId = (collectionId) => {
        axios.get(`http://localhost:3000/api/items/all/${collectionId}`)
            .then(response => {
                setbddItems(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the items!", error);
            });
    };

    const fetchAllUsers = () => {
        axios.get('http://localhost:3000/api/users/all') 
            .then(response => {
                setbddItems(response.data); // Correction ici
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the collections!", error);
                setError(error);
                setLoading(false);
            });
    }

    const fetchAllReview = () => {
        //TODO
    }

    const createUser = (newUser) => {
        axios.post('http://localhost:3000/api/users/register', newUser, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(() => {
            fetchAllUsers(); 
        })
        .catch(error => {
            console.error("There was an error adding the user: ", error);
        });
    };

    const updateUser = (id, updatedUser) => {
        axios.put(`http://localhost:3000/api/users/${id}`, updatedUser, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(() => {
            fetchAllUsers(); // Actualiser la liste après la mise à jour
        })
        .catch(error => {
            console.error("There was an error updating the user: ", error);
        });
    };
    
    
    
    

    const deleteItem = (id) => {
        axios.delete(`http://localhost:3000/collection/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(() => {
            fetchAllCollection();
        })
        .catch(error => {
            console.error("There was an error deleting the collection: ", error);
        });
    };

    const handleEditClick = (id) => {
        // Ta logique pour éditer un élément
    };

    return (
        <div className="admin-page">
            <h1>Admin CatchIt</h1>
            <button onClick={() => fetchAllCollection()}>Revenir aux collections</button>
            <button onClick={() => fetchAllUsers()}>Revenir aux users</button>
            {bddItems.map((Item, index) => (
              <div key={index} className="admin-items">
                {Object.entries(Item).map(([key, value]) => (
                  <p key={key}>{`${key}: ${value}`}</p>
                ))}
                {('isAdmin' in Item) && ( 
                    <button onClick={() => fetchItemsByCollectionId(Item.id)}>Afficher les items</button>
                )}
                <button onClick={() => handleEditClick(Item.id)}>Modifier</button>
                <button onClick={() => deleteItem(Item.id)}>Supprimer</button>
              </div>
            ))}
        </div>
    );
}

export default AdminPage;
