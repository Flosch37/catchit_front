import React from 'react';
import './Footer.css'; // Assurez-vous d'avoir le fichier CSS correspondant

function Footer() {
    return (
        <footer className="footer">
            <p>&copy; {new Date().getFullYear()} CatchIt - Tous droits réservés.</p>
            {/* Vous pouvez ajouter d'autres éléments ici, comme des liens vers des réseaux sociaux */}
        </footer>
    );
}

export default Footer;
