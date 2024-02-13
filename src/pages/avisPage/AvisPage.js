import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function AvisPage() {
  const [avis, setAvis] = useState([]); // Changé de bddItems à avis pour la clarté
  const { itemId } = useParams(); // Utilisez useParams pour accéder à l'ID de l'item depuis l'URL

  useEffect(() => {
    const fetchAvis = () => {
      axios.get(`http://localhost:3000/api/reviews/item/${itemId}`) // Assurez-vous que cette URL est correcte pour votre API d'avis
        .then(response => {
          setAvis(response.data); // On utilise setAvis ici car nous récupérons des avis
        })
        .catch(error => {
          console.error("There was an error fetching the reviews!", error);
        });
    };

    if (itemId) {
      fetchAvis();
    }
  }, [itemId]); // Exécutez l'effet lorsque itemId change

  return (
    <div>
      <h1>Avis</h1>
      {avis.length > 0 ? avis.map((review) => (
        <div key={review.id}>
          {/* Assurez-vous que les champs comme review.title et review.content existent dans votre réponse d'API */}
          <h3>{review.title}</h3>
          <p>{review.content}</p>
          {/* Autres détails de l'avis */}
        </div>
      )) : <p>Aucun avis trouvé pour cet item.</p>}
    </div>
  );
}

export default AvisPage;
