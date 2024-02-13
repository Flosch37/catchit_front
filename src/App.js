import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import HomePage from './pages/homePage/HomePage';
import Login from './components/login/Login';
import AdminPage from './pages/adminPage/AdminPage';
import UserPage from './pages/userPage/UserPage';
import CollectionPage from './pages/collectionsPage/CollectionPage';
import AvisPage from './pages/avisPage/AvisPage';
import Register from './components/register/Register';
import Logout from './components/logout/Logout'
import Footer from './components/footer/Footer';
import { AuthProvider} from './context/AuthContext'; 

function App() {
    return (
        <AuthProvider> 
            <Router>
                <div className="app">
                    <Header />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path="/adminPage" element={<AdminPage />} />
                        <Route path="/userPage" element={<UserPage />} />
                        <Route path="/collectionPage/:collectionName/:collectionId" element={<CollectionPage />} />
                        <Route path="/avisPage/:item/:itemId" element={<AvisPage />} />
                    </Routes>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
