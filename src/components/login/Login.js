import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css'

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [userRole, setUserRole] = useState(null);

    const navigate = useNavigate();
    const { login } = useAuth();

    // useEffect mis à jour pour inclure un log affichant la valeur mise à jour de userRole
    useEffect(() => {
        console.log("UserRole Updated:", userRole); // Pour confirmer que userRole est mis à jour
        if (userRole === 'admin') {
            navigate('/adminPage');
            console.log('jojo');
        } else if (userRole === 'user') {
            navigate('/userPage');
            console.log('tat');
        }
    }, [userRole, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError('Veuillez remplir tous les champs.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
        
            if (!response.ok) {
                throw new Error('Erreur de connexion ou utilisateur non trouvé');
            }
        
            const data = await response.json();
            login(data.token, { username }); // Suppose que cette fonction gère également le stockage du token
        
            // Ajustement ici pour extraire le rôle selon la structure de la réponse
            const role = data.role; // Directement puisque 'role' est à la racine de l'objet réponse
        
            if (role) {
                setUserRole(role);
            } else {
                console.log("Le rôle n'a pas été trouvé dans la réponse:", data); // Pour le débogage
                setError('Impossible de déterminer le rôle de l\'utilisateur.');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Erreur de connexion au serveur.');
        }
        
        
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                {error && <p className="error">{error}</p>}
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nom d'utilisateur ou Email"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mot de passe"
                />
                <button type="submit">Connexion</button>
            </form>
        </div>
    );
}

export default Login;
