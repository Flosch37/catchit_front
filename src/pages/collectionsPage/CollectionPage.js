import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Assurez-vous que cette importation fonctionne correctement
import './CollectionPage.css';


function ObjectForm({ initialState, onFormSubmit, buttonText }) {
  const [name, setName] = useState(initialState?.name || '');
  const [description, setDescription] = useState(initialState?.description || '');
  const [imagePath, setImagePath] = useState(initialState?.imagePath || '');
  const [isReal, setIsReal] = useState(initialState?.isReal || false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    onFormSubmit({ name, description, imagePath, isReal });
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
      <label>
        imagePath:
        <textarea value={imagePath} onChange={(e) => setImagePath(e.target.value)} />
      </label>
      <label>
        isReal:
        <input 
          type="checkbox" 
          checked={isReal} 
          onChange={(e) => setIsReal(e.target.checked)} 
        />
      </label>
      <button type="submit">{buttonText}</button>
    </form>
  );
}

function CollectionPage(){
  const [collectionObjects, setCollectionObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingObject, setEditingObject] = useState(null);

  const { collectionId } = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        fetchObjectsCollection(collectionId); //TODO
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

  // OK
  const fetchObjectsCollection = (collectionId) => {
    setLoading(true);
    axios.get(`http://localhost:3000/api/objects/all/${collectionId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(response => {
      setCollectionObjects(response.data);
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
    setEditingObject(null);
    fetchObjectsCollection(collectionId);
  };

  const onFormSubmit = async ({ name, description, imagePath, isReal }) => {
    const token = localStorage.getItem('token');
    try {
      const headers = { Authorization: `Bearer ${token}` };
      if (editingObject) {
        await axios.put(`http://localhost:3000/api/objects/${collectionId}`,
          { collectionId, description, imagePath, isReal },
          { headers }
        );
      } else {
        await axios.post(`http://localhost:3000/api/objects/add`,
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
    const collection = collectionObjects.find(c => c.id === collectionId);
    if (collection) {
      setEditingObject(collection);
      setShowForm(true);
    }
  };

  const deleteObject = (objectId) => {
    axios.delete(`http://localhost:3000/api/objects/${objectId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(() => {
      fetchObjectsCollection(collectionId);
    })
    .catch(error => {
      console.error("There was an error deleting the collection: ", error);
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  //OK

  return (
    <div className="collection-page">
      <h1>Bienvenue sur CatchIt</h1>
      {showForm ? (
        <ObjectForm
          initialState={editingObject || { name: '', description: '', imagePath: '', isReal: false }}
          onFormSubmit={onFormSubmit}
          buttonText={editingObject ? 'Modifier' : 'Créer'}
        />
      ) : (
        <button onClick={() => setShowForm(true)}>Créer un nouvel objet</button>
      )}
      <div className="my-objects">
        <h2>Mes Objets de la collection</h2>
        {collectionObjects.length === 0 ? (
          <p>Vous n'avez d'objet dans votre collection pour le moment.</p>
        ) : (
          <div className="collections-list">
            {setCollectionObjects.map(object => (
              <div key={object.id} className="collection-item">
                <h3>{object.name}</h3>
                <p>{object.description}</p>
                <p>{object.imagePath}</p>
                <p>{object.isReal ? "Réel" : "Non réel"}</p>
                <button onClick={() => handleEditClick(collectionId)}>Modifier</button>
                <button onClick={() => deleteObject(collectionId)}>Supprimer</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CollectionPage;