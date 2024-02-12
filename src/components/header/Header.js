import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import './Header.css'


function Header() {
    console.log("Header is rendering");
    const { logout } = useAuth(); 
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); 
        navigate('/login');
    };

    const isLoggedIn = localStorage.getItem('token') ? true : false;

    return (
        <nav>
            <ul>
                {!isLoggedIn ? (
                    <>
                        <li><Link to="/login">Connexion</Link></li>
                        <li><Link to="/register">Inscription</Link></li>
                    </>
                ) : (
                    <li><a href="/logout" onClick={handleLogout}>Déconnexion</a></li> 
                )}
            </ul>
        </nav>
    );
}

export default Header;
