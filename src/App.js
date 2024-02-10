import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import HomePage from './pages/homePage/HomePage';
import Login from './components/login/Login';
import AdminPage from './pages/adminPage/AdminPage';
import UserPage from './pages/userPage/UserPage';
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
                    </Routes>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
