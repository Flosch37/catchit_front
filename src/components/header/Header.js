import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Ajustez selon votre structure de fichiers
import './Header.css'


function Header() {
    console.log("Header is rendering");
    const { logout } = useAuth(); // Assurez-vous que votre contexte d'authentification fournit une fonction de logout
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Efface le token et met à jour l'état d'authentification
        navigate('/login'); // Redirige vers la page de connexion
    };

    const isLoggedIn = localStorage.getItem('token') ? true : false; // Ou utilisez un état d'authentification global via useAuth

    return (
        <nav>
            <ul>
                {!isLoggedIn ? (
                    <>
                        <li><Link to="/login">Connexion</Link></li>
                        <li><Link to="/register">Inscription</Link></li>
                    </>
                ) : (
                    <li><a href="/logout" onClick={handleLogout}>Déconnexion</a></li> // Utilisez <button> ou <Link> avec onClick pour une meilleure pratique
                )}
            </ul>
        </nav>
    );
}

export default Header;
