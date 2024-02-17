import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Assurez-vous que cette importation fonctionne correctement
import './UserPage.css';

function CollectionForm({ initialState, onFormSubmit, buttonText }) {
  const [name, setName] = useState(initialState?.name || '');
  const [description, setDescription] = useState(initialState?.description || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    onFormSubmit({ name, description });
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
      <button type="submit">{buttonText}</button>
    </form>
  );
}

function UserPage() {
  const [userCollections, setUserCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const navigate = useNavigate();
  
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
    axios.get(`http://localhost:3000/api/collection/collections/user/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
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

  const handleCollectionCreatedOrUpdated = () => {
    setShowForm(false);
    setEditingCollection(null);
    fetchUserCollections(jwtDecode(localStorage.getItem('token')).userId);
  };

  const onFormSubmit = async ({ name, description }) => {
    const token = localStorage.getItem('token');
    try {
      const headers = { Authorization: `Bearer ${token}` };
      if (editingCollection) {
        await axios.put(`http://localhost:3000/api/collection/${editingCollection.id}`,
          { name, description },
          { headers }
        );
      } else {
        await axios.post(`http://localhost:3000/api/collection/add`,
        { name, description, isAdmin: false, userId: jwtDecode(token).userId },
        { headers: { Authorization: `Bearer ${token}` } }
    );
      }
      handleCollectionCreatedOrUpdated();
    } catch (error) {
      console.error("There was an error processing the collection: ", error);
    }
  };

  const handleEditClick = (collectionId) => {
    const collection = userCollections.find(c => c.id === collectionId);
    if (collection) {
      setEditingCollection(collection);
      setShowForm(true);
    }
  };

  const deleteCollection = (collectionId) => {
    axios.delete(`http://localhost:3000/api/collection/${collectionId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(() => {
      fetchUserCollections(jwtDecode(localStorage.getItem('token')).userId);
    })
    .catch(error => {
      console.error("There was an error deleting the collection: ", error);
    });
  };

  const handleNaviguate = (collectionName, collectionId) => {
    navigate(`/collectionPage/${collectionName}/${collectionId}`);
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="user-page">
      <h1>Bienvenue sur CatchIt</h1>
      {showForm ? (
        <CollectionForm
          initialState={editingCollection || { name: '', description: '' }}
          onFormSubmit={onFormSubmit}
          buttonText={editingCollection ? 'Modifier' : 'Créer'}
        />
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
                <button onClick={() => handleNaviguate(collection.name, collection.id)}>Voir la collection</button>
                <button onClick={() => handleEditClick(collection.id)}>Modifier</button>
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
