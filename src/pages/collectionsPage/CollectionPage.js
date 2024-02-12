import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './CollectionPage.css';


function ItemForm({ initialState, onFormSubmit, buttonText }) {
  const [name, setName] = useState(initialState?.name || '');
  const [description, setDescription] = useState(initialState?.description || '');
  const [imagePath, setImagePath] = useState(initialState?.imagePath || '');
  const [isReal, setIsReal] = useState(initialState?.isReal || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    onFormSubmit({ name, description, imagePath, isReal});
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
          onChange={(e) => setIsReal(e.target.checked ? 1 : 0)} 
        />
      </label>
      <button type="submit">{buttonText}</button>
    </form>
  );
}

function CollectionPage(){
  const [collectionItems, setCollectionItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [currentItemId, setCurrentItemId] = useState(null);

  const { collectionId } = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        fetchItemsCollection(collectionId); //TODO
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
  const fetchItemsCollection = (collectionId) => {
    setLoading(true);
    axios.get(`http://localhost:3000/api/items/all/${collectionId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(response => {
      setCollectionItems(response.data);
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
    setEditingItem(null);
    fetchItemsCollection(collectionId);
  };

  const onFormSubmit = async ({ name, description, imagePath, isReal}) => {
    const token = localStorage.getItem('token');
    try {
      const headers = { Authorization: `Bearer ${token}` };
      if (editingItem) {
        await axios.put(`http://localhost:3000/api/items/${currentItemId}`,
          { collectionId, name, description, image_path: imagePath, is_real: isReal},
          { headers }
        );
      } else {
        await axios.post(`http://localhost:3000/api/items/add`,
        { name, description, image_path: imagePath, is_real: isReal, collectionId},
        { headers: { Authorization: `Bearer ${token}` } }
    );
      }
      handleCollectionCreatedOrUpdated();
    } catch (error) {
      console.error("There was an error processing the collection: ", error);
    }
  };

  const handleEditClick = (itemId) => {
    const collection = collectionItems.find(c => c.id === itemId);
    if (collection) {
      setEditingItem(collection);
      setCurrentItemId(itemId);
      setShowForm(true);
    }
  };

  const deleteItem = (ItemId) => {
    axios.delete(`http://localhost:3000/api/items/${ItemId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(() => {
      fetchItemsCollection(collectionId);
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
        <ItemForm
          initialState={editingItem || { name: '', description: '', imagePath: '', isReal: 0 }}
          onFormSubmit={onFormSubmit}
          buttonText={editingItem ? 'Modifier' : 'Créer'}
        />
      ) : (
        <button onClick={() => setShowForm(true)}>Créer un nouvel objet</button>
      )}
      <div className="my-Items">
        <h2>Mes Objets de la collection</h2>
        {collectionItems.length === 0 ? (
          <p>Vous n'avez d'objet dans votre collection pour le moment.</p>
        ) : (
          <div className="collections-list">
            {collectionItems.map(Item => (
              <div key={Item.id} className="collection-item">
                <h3>{Item.name}</h3>
                <p>{Item.description}</p>
                <p>{Item.image_path}</p>
                <p>{Item.is_real ? "Réel" : "Non réel"}</p>
                <button onClick={() => handleEditClick(Item.id)}>Modifier</button>
                <button onClick={() => deleteItem(Item.id)}>Supprimer</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CollectionPage;