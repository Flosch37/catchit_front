const entityFields = {
    collection: [
        { name: 'name', label: 'Nom', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: false },
        { name: 'isAdmin', label: 'Est administrateur', type: 'checkbox', required: false },
        { name: 'userId', label: 'ID Utilisateur', type: 'number', required: true },
    ],
    users: [
        { name: 'username', label: 'Nom d\'utilisateur', type: 'text', required: true },
        { name: 'password', label: 'Mot de passe', type: 'password', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'role', label: 'Rôle', type: 'select', options: ['user', 'admin'], required: true },
    ],
    items: [
        { name: 'collectionId', label: 'ID Collection', type: 'number', required: true },
        { name: 'name', label: 'Nom', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: false },
        { name: 'image_path', label: 'Chemin de l\'image', type: 'text', required: false },
        { name: 'is_real', label: 'Est réel', type: 'checkbox', required: false },
    ],
    reviews: [
        { name: 'itemId', label: 'ID de l\'Item', type: 'number', required: true },
        { name: 'userId', label: 'ID de l\'Utilisateur', type: 'number', required: true },
        { name: 'content', label: 'Contenu', type: 'textarea', required: true },
    ],
    userItemOwned: [
        // { name: 'id', label: 'ID', type: 'number', required: true },
        { name: 'userId', label: 'ID de l\'Utilisateur', type: 'number', required: true },
        { name: 'itemId', label: 'ID de l\'Item', type: 'number', required: true },
        { name: 'quantity', label: 'Quantité', type: 'number', required: true },
    ],
};
export default entityFields;