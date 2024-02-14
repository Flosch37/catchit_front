import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

function ResearchCollectionsOthers() {
  const [collections, setCollections] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/api/collection/all')
        .then(response => {
            setCollections(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error("There was an error fetching the collections!", error);
            setError(error.message);
            setLoading(false);
        });
  }, []);

  const handleNaviguate = (collectionName, collectionId) => {
    navigate(`/collectionPage/${encodeURIComponent(collectionName)}/${encodeURIComponent(collectionId)}`);
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="collection-page">
      <h1>Collections des Autres Utilisateurs</h1>
      <div className="my-Items">
        {collections.length === 0 ? (
          <p>Aucune collection trouvée.</p>
        ) : (
          collections.map(collection => (
            <div key={collection.id} className="collection-item">
              <h2>{collection.name}</h2>
              <button onClick={() => handleNaviguate(collection.name, collection.id)}>Voir Collection</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ResearchCollectionsOthers;
