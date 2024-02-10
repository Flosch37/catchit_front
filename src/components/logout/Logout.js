import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Supprimer le token d'authentification du stockage local
    localStorage.removeItem('token'); // Ou cookies.remove('token') si vous utilisez des cookies
    
    // Rediriger vers la page de connexion
    navigate('/login', { replace: true });

    // Ici, vous pouvez également mettre à jour l'état global d'authentification si nécessaire
    // Par exemple, en utilisant un contexte d'authentification ou Redux
  }, [navigate]);

  // Ce composant peut simplement retourner null puisqu'il ne rend rien visuellement
  return null;
};

export default Logout;
