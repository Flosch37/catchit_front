import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [userRole, setUserRole] = useState(null);

    const navigate = useNavigate();
    const { login } = useAuth();
    

    useEffect(() => {
        if (userRole === 'admin') {
            navigate('/adminPage'); 
            console.log('jojo')
        } else if (userRole === 'user') {
            navigate('/userPage'); 
            console.log('tat')
        }
        console.log('pro')
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
                
                const data = await response.json(); 
                const token = data.token;
                const userInfoResponse = await fetch(`http://localhost:3000/api/users/name/${username}`, {
                    headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },

            });
            console.log(userInfoResponse)
                if (response.ok) {
                    login(data.token, { username }); // Suppose que cette fonction gère également le stockage du token
                    console.log(data); // Ajoutez ceci pour vérifier la structure de la réponse
                    
                    // Ajustez en fonction de la structure de votre réponse
                    const role = data.user ? data.user.role : data.role; // Utilisez un opérateur conditionnel pour gérer les deux cas
                    if(role) {
                        setUserRole(role);
                    } else {
                        // Gérez le cas où le rôle n'est pas disponible
                        setError('Impossible de déterminer le rôle de l\'utilisateur.');
                    }
                } else {
                    setError(data.message || 'Erreur de connexion');
                }
            } catch (networkError) {
                console.error('Error:', networkError);
                setError('Erreur de connexion au serveur.');
            }
        };
        


    return (
        <div>
            <form onSubmit={handleSubmit}>
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
