function Header() {
    const isLoggedIn = localStorage.getItem('token') ? true : false;

    return (
        <nav>
            {/* Autres liens */}
            <ul>
                {!isLoggedIn && (
                    <>
                        <li><a href="/login">Connexion</a></li>
                        <li><a href="/register">Inscription</a></li>
                    </>
                )}
                {isLoggedIn && (
                    <li><a href="/logout">Déconnexion</a></li>
                )}
            </ul>
        </nav>
    );
}

export default Header;