import React, { useState, useEffect } from "react";
import axios from "axios";
import GenericForm from "./genericForm/GenericForm";
import entityFields from "./genericForm/entityFields";
import "./AdminPage.css";

function AdminPage() {
  const [bddItems, setbddItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTable, setCurrentTable] = useState("collection");
  const [currentEditingId, setCurrentEditingId] = useState(null);
  const [currentCollectionId, setCurrentCollectionId] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  //Formulaire
  const [formInitialState, setFormInitialState] = useState({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/collection/all")
      .then((response) => {
        setbddItems(response.data); // Correction ici
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the collections!", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>There was an error loading the collections.</div>;
  }

  const handleAddClick = (entityType) => {
    setIsEditing(false);
    setCurrentTable(entityType);
    setFormInitialState({});
    setShowForm(!showForm);
  };

  const handleEditClick = (paramCurrentTable, id, data) => {
    setCurrentEditingId(id);
    setIsEditing(true);
    setCurrentTable(paramCurrentTable);
    setFormInitialState({ ...data });
    setShowForm(!showForm);
  };

  const handleFormSubmit = async (data) => {
    // Utilise `currentTable` pour savoir quelle API appeler

    let endpoint = "add";
    if (currentTable === "users") {
      endpoint = "register";
    }

    if (isEditing) {
      endpoint = currentEditingId;
      const url = `http://localhost:3000/api/${currentTable}/${endpoint}`;
      try {
        await axios.put(url, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        // Rafraîchir les données affichées si nécessaire
        if (currentTable === "items") {
          fetchItemsByCollectionId(currentCollectionId);
        } else {
          fetchAllData(currentTable);
        }
        setShowForm(false);
        setCurrentEditingId(null);
      } catch (error) {
        console.error("There was an error submitting the form: ", error);
      }
    } else {
      // Par exemple :
      const url = `http://localhost:3000/api/${currentTable}/${endpoint}`;
      try {
        await axios.post(url, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        // Rafraîchir les données affichées si nécessaire
        if (currentTable === "items") {
          fetchItemsByCollectionId(currentCollectionId);
        } else {
          fetchAllData(currentTable);
        }
      } catch (error) {
        console.error("There was an error submitting the form: ", error);
      }
    }
  };

  const fetchItemsByCollectionId = (collectionId) => {
    setCurrentCollectionId(collectionId);
    axios
      .get(`http://localhost:3000/api/items/all/${collectionId}`)
      .then((response) => {
        setbddItems(response.data);
        setCurrentTable("items");
      })
      .catch((error) => {
        console.error("There was an error fetching the items!", error);
      });
  };

  const fetchAllData = (param) => {
    setCurrentCollectionId(-1);
    axios
      .get(`http://localhost:3000/api/${param}/all`)
      .then((response) => {
        setCurrentTable(param);
        setbddItems(response.data); // Correction ici
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the collections!", error);
        setError(error);
        setLoading(false);
      });
  };

  const deleteData = (param, id) => {
    axios
      .delete(`http://localhost:3000/api/${param}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        fetchAllData("collection");
      })
      .catch((error) => {
        console.error("There was an error deleting the collection: ", error);
      });
  };

  const updateUser = (id, updatedUser) => {
    axios
      .put(`http://localhost:3000/api/users/${id}`, updatedUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        fetchAllData("users"); // Actualiser la liste après la mise à jour
      })
      .catch((error) => {
        console.error("There was an error updating the user: ", error);
      });
  };

  return (
    <div className="admin-page">
      <h1>Admin CatchIt</h1>
      <div className="naviguate-buttons">
        <button onClick={() => fetchAllData("collection")}>
          Collections {">"}
        </button>
        <button onClick={() => fetchAllData("users")}>Users {">"}</button>
        <button onClick={() => fetchAllData("reviews")}>Reviews {">"}</button>
      </div>
      <button
        className="add-button"
        onClick={() => handleAddClick(currentTable)}
      >
        Ajouter un(e): <p className="current-table">{currentTable}</p>
      </button>
      {showForm && (
        <GenericForm
          initialState={formInitialState}
          onFormSubmit={handleFormSubmit} // Tu devras définir cette fonction
          buttonText={isEditing ? "Valider modifications" : "Valider ajout"}
          fields={entityFields[currentTable]}
        />
      )}
      <h2>Table : {currentTable}</h2>
      {bddItems.map((Item, index) => (
        <div key={index} className="admin-items">
          {Object.entries(Item).map(([key, value]) => (
            <p key={key}>{`${key}: ${value}`}</p>
          ))}
          {"isAdmin" in Item && (
            <button onClick={() => fetchItemsByCollectionId(Item.id)}>
              Afficher les items
            </button>
          )}
          <button
            className="button-modify"
            onClick={() => handleEditClick(currentTable, Item.id, Item)}
          >
            Modifier
          </button>
          <button
            className="button-delete"
            onClick={() => deleteData(currentTable, Item.id)}
          >
            Supprimer
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminPage;
