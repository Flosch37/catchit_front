import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 

function AvisPage() {
  const [endingFetch, setEndingFetch] = useState(false);
  const [usernameList, setUsernameList] = useState([]);
  const [avis, setAvis] = useState([]);
  const [reviewContent, setReviewContent] = useState('');
  const [hasReviewed, setHasReviewed] = useState(false);
  const { itemId } = useParams();


  useEffect(() => {
    const fetchAvis = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/reviews/item/${itemId}`);
        setAvis(response.data);

        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        const userId = decoded.userId; 
        setHasReviewed(response.data.some(review => review.userId === userId));
        let listTemp = [];
        for(let i = 0; i < response.data.length; i++){
          const username = await fetchUsername(response.data[i].userId);
          listTemp[i] = username.username;
        }
        setUsernameList(listTemp);
        setEndingFetch(true);
      } catch (error) {
        console.error("There was an error fetching the reviews!", error);
      }
    };

    const fetchUsername = async (userId) => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${userId}`);
        return response.data;
      } catch (error) {
        console.error("There was an error fetching the reviews!", error);
      }
      return null;
    };
    

    fetchAvis();

  }, [endingFetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const userId = decoded.userId; 

    try {
      const response = await axios.post(`http://localhost:3000/api/reviews/add`, {
        itemId,
        userId, 
        content: reviewContent,
      }, {
        headers: { Authorization: `Bearer ${token}` } 
      });
      setAvis([...avis, response.data]); 
      setReviewContent(''); 
      setHasReviewed(true); 
    } catch (error) {
      console.error("Error posting the review: ", error);
    }
  };

  return (
    <div>
      <h1>Avis sur l'item</h1>
      {avis.length > 0 ? avis.map((review, index) => (
        <div key={review.id}>
          <h3>{usernameList[index] || 'Utilisateur inconnu'}</h3>
          <p>{review.content}</p>
        </div>
      )) : <p>Aucun avis trouvé pour cet item.</p>}
      {!hasReviewed && (
        <form onSubmit={handleSubmit}>
          <label>
            Votre avis :
            <textarea value={reviewContent} onChange={(e) => setReviewContent(e.target.value)} required />
          </label>
          <button type="submit">Poster l'avis</button>
        </form>
      )}
    </div>
  );
}

export default AvisPage;
