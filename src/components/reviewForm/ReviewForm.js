import React, { useState } from 'react';
import axios from 'axios';

function ReviewForm({ itemId, onReviewSubmitted }) {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); 

    axios.post(`http://localhost:3000/api/reviews`, {
      itemId,
      content
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      console.log('Review added successfully');
      setContent(''); 
      onReviewSubmitted(); 
    })
    .catch(error => {
      console.error("There was an error posting the review: ", error);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your review here..."
      />
      <button type="submit">Submit Review</button>
    </form>
  );
}

export default ReviewForm;