import React, { useEffect, useState } from 'react';
import '../css/board.css';
import NavMenu from './navMenu';
import { Link } from 'react-router-dom';
import addIcon from '../assets/add.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faHandsHelping } from '@fortawesome/free-solid-svg-icons';

function List() {
    const [entrepots, setEntrepots] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentEntrepot, setCurrentEntrepot] = useState({});
    const [currentStock, setCurrentStock] = useState({});
    const [showMaraudeModal, setShowMaraudeModal] = useState(false);
    const [volunteers, setVolunteers] = useState([]);
    const [dateDebut, setDateDebut] = useState('');
    
    const fetchAvailableVolunteersForTime = async () => {

    
        const url = new URL('http://localhost:8000/api/entrepot/VolunteerAvailable');
        const params = { date: dateDebut.split('T')[0], startTime: dateDebut.split('T')[1]};
        url.search = new URLSearchParams(params).toString();
    
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch available volunteers');
            }
            const data = await response.json();
            setVolunteers(data);
        } catch (error) {
            console.error('Error fetching available volunteers:', error.message);
        }
    };
    
    
    useEffect(() => {
        fetchAvailableVolunteersForTime();
    }, []); // Add dependencies based on when you need to refresh this data
    

    const toggleMaraudeModal = () => {
        setShowMaraudeModal(!showMaraudeModal);
    };

    useEffect(() => {
        fetchEntrepots();
        fetchStocks();
        fetchAvailableVolunteersForTime();


    }, []);

    const fetchStocks = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/entrepot/AllStocks');
            if (!response.ok) throw new Error('Erreur lors de la récupération des stocks');
            const data = await response.json();
            setStocks(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des stocks:', error.message);
        }};

    const fetchEntrepots = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/entrepot/AllEntrepots');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des entrepôts');
            }
            const entrepotsData = await response.json();
            setEntrepots(entrepotsData);
        } catch (error) {
            console.error('Erreur lors de la récupération des entrepôts:', error.message);
        }
    };

    const handleEditStock = (stock) => {
        setCurrentStock(stock);
        document.getElementById('overlayStock').style.display = 'block';
        document.getElementById('popupFormStock').style.display = 'block';
    };
    const handleEditEntrepot = (entrepot) => {
        setCurrentEntrepot(entrepot);
    };
    const handleAddEntrepot = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        const nom = formData.get('nom');
        const adresse = formData.get('adresse');
        const ville = formData.get('ville');
        const codePostal = formData.get('code_postal');
        const capacite = formData.get('capacite');

        if (!nom || !adresse || !ville || !codePostal || !capacite) {
            alert('Veuillez remplir tous les champs du formulaire');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/entrepot/addEntrepot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nom: nom,
                adresse: adresse,
                ville: ville,
                code_postal: codePostal,
                capacite: capacite
            }),
        });


            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout de l\'entrepôt');
            }

            alert('Entrepôt ajouté avec succès!');
            fetchEntrepots(); // Rafraîchit la liste des entrepôts après l'ajout
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'entrepôt:', error.message);
            alert(`Erreur lors de l'ajout de l'entrepôt: ${error.message}`);
        }
    };
  

    const handleUpdateEntrepot = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        const nom = formData.get('nom');
        const adresse = formData.get('adresse');
        const ville = formData.get('ville');
        const codePostal = formData.get('code_postal');
        const capacite = formData.get('capacite');


        try {
            const response = await fetch(`http://localhost:8000/api/entrepot/updateEntrepot/${currentEntrepot.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nom: nom,
                    adresse: adresse,
                    ville: ville,
                    code_postal: codePostal,
                    capacite: capacite
                }),
            });
            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour de l\'entrepôt');
            }
            alert('Entrepôt mis à jour avec succès!');
            fetchEntrepots(); 
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'entrepôt:', error.message);
            alert(`Erreur lors de la mise à jour de l'entrepôt: ${error.message}`);
        }
    };
    const handleDeleteEntrepot = async (entrepotId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/entrepot/deleteEntrepot/${entrepotId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Erreur lors de la suppression de l\'entrepôt');
            }
            alert('Entrepôt supprimé avec succès!');
            fetchEntrepots();
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'entrepôt:', error.message);
            alert(`Erreur lors de la suppression de l'entrepôt: ${error.message}`);
        }
    };
    const MaraudeModal = () => (
        <div className="modal" style={{ display: showMaraudeModal + "modal" ? 'block' : 'none' }}>
            <div className="modal-content">
                <span className="close" onClick={toggleMaraudeModal}>&times;</span>
                <h2>Create New Maraude</h2>
                <form onSubmit={handleMaraudeFormSubmit}>
                    <div className="scrollable-content">
                        <label htmlFor="nom">Nom:</label>
                        <input type="text" id="nom" name="nom" required />
    
                        <label htmlFor="lieuDepart">Lieu de départ:</label>
                        <input type="text" id="lieuDepart" name="lieuDepart" required />
    
                        <label htmlFor="lieuArrivee">Lieu d'arrivée:</label>
                        <input type="text" id="lieuArrivee" name="lieuArrivee" required />
    
                        <label htmlFor="dateDebut">Date de début:</label>
                        <input type="datetime-local" id="dateDebut" name="dateDebut" value={dateDebut} onChange={e => setDateDebut(e.target.value)} required />

                        
                        <button type="button" onClick={fetchAvailableVolunteersForTime}>Check Availability</button>

                        <label htmlFor="description">Description:</label>
                        <textarea id="description" name="description" required />
    
                        <label htmlFor="chauffeurID">Chauffeur:</label>
                        <select id="chauffeurID" name="chauffeurID" required>
                            {volunteers.map((volunteer) => (
                                <option key={volunteer.id} value={volunteer.id}>
                                    {volunteer.prenom} {volunteer.nom}
                                </option>
                            ))}
                        </select>

    
                        <label htmlFor="stockID">Stock ID:</label>
                        <input type="number" id="stockID" name="stockID" required />
    
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
    const handleMaraudeFormSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const maraudeData = {
            nom: formData.get('nom'),
            lieuDepart: formData.get('lieuDepart'),
            lieuArrivee: formData.get('lieuArrivee'),
            dateDebut: formData.get('dateDebut'),
            description: formData.get('description'),
            chauffeurID: formData.get('chauffeurID'),
            stockID: formData.get('stockID')
        };
    
        try {
            const response = await fetch('http://localhost:8000/api/entrepot/addMaraude', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(maraudeData)
            });
            if (!response.ok) throw new Error('Failed to create maraude');
            alert('Maraude created successfully!');
            toggleMaraudeModal(); // Close modal on successful creation
        } catch (error) {
            console.error('Error creating maraude:', error.message);
            alert(`Failed to create maraude: ${error.message}`);
        }
    };
    
    

    return (
        <>
            <NavMenu />
            <section className="content">
                <section className="lists">
                    <div className="table-header">
                        <h3 className="title_dashboard">Liste des Entrepôts</h3>
                        <div className="add_user">
                            <Link id="add_link" to="#" className="view-all" onClick={() => {
                                document.getElementById('overlay').style.display = 'block';
                                document.getElementById('popupForm').style.display = 'block';
                            }}>
                                <img style={{ paddingRight: "10px" }} className="voir-all-icon" height="15px" width="17px" src={addIcon} alt="Ajouter" />
                                Ajouter
                            </Link>
                        </div>
                    </div>
                    <div className="table_bnv">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Adresse</th>
                                    <th>Ville</th>
                                    <th>Code Postal</th>
                                    <th>Capacité</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entrepots.map((entrepot) => (
                                    <tr key={entrepot.id}>
                                        <td>{entrepot.nom}</td>
                                        <td>{entrepot.adresse}</td>
                                        <td>{entrepot.ville}</td>
                                        <td>{entrepot.code_postal}</td>
                                        <td>{entrepot.capacite}</td>
                                        <td>
                                        <Link  id="edit" onClick={() => {
                                                document.getElementById('overlay2').style.display = 'block';
                                                document.getElementById('popupForm2').style.display = 'block';
                                                handleEditEntrepot(entrepot);

                                            }}><FontAwesomeIcon icon={faEdit} /> 

                                            </Link>
                                            <Link  id="trash">
                                            <FontAwesomeIcon icon={faTrash}onClick={() => handleDeleteEntrepot(entrepot.id)} /> 
                                        </Link> 
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div id="overlay" style={{ display: 'none' }}></div>
                    <div id="popupForm" style={{ display: 'none' }}>
                        <button className="close-btn" onClick={() => {
                            document.getElementById('overlay').style.display = 'none';
                            document.getElementById('popupForm').style.display = 'none';
                        }}>
                            <span aria-hidden="true">×</span>
                        </button>
                        <form onSubmit={handleAddEntrepot}>
                            <div className="scrollable-content">
                                <label htmlFor="nom">Nom :</label>
                                <input type="text" id="nom" name="nom" required />

                                <label htmlFor="adresse">Adresse :</label>
                                <input type="text" id="adresse" name="adresse" required />

                                <label htmlFor="ville">Ville :</label>
                                <input type="text" id="ville" name="ville" required />

                                <label htmlFor="code_postal">Code Postal :</label>
                                <input type="text" id="code_postal" name="code_postal" required />

                                <label htmlFor="capacite">Capacité :</label>
                                <input type="number" id="capacite" name="capacite" min="1" required />
                            </div>
                            <input className="btn_event" type="submit" value="Ajouter" />
                        </form>
                    </div>
                    <div id="overlay2" style={{ display: 'none' }}></div>
                    <div id="popupForm2" style={{ display: 'none' }}>
                    <form onSubmit={handleUpdateEntrepot}>
                                    <div className="scrollable-content">
                                        <label htmlFor="nom">Nom :</label>
                                        <input type="text" id="nom" name="nom" defaultValue={currentEntrepot.nom} required />
                                    
                                        <label htmlFor="adresse">Adresse :</label>
                                        <input type="text" id="adresse" name="adresse" defaultValue={currentEntrepot.adresse} required />
                                    
                                        <label htmlFor="ville">Ville :</label>
                                        <input type="text" id="ville" name="ville" defaultValue={currentEntrepot.ville} required />
                                    
                                        <label htmlFor="code_postal">Code Postal :</label>
                                        <input type="text" id="code_postal" name="code_postal" defaultValue={currentEntrepot.code_postal} required />
                                    
                                        <label htmlFor="capacite">Capacité :</label>
                                        <input type="number" id="capacite" name="capacite" defaultValue={currentEntrepot.capacite} min="1" required />
                                    </div>
                                    <input className="btn_event" type="submit" value="Mettre à jour" />
                                </form>
                    </div>
                </section>
                
            </section>
            <section className="content">
                <section className="lists"> 
                <div className="table-header">
                        <h3 className="title_dashboard">Liste des stocks</h3>
                        <div className="add_user">
                            <Link id="add_link" to="#" className="view-all" onClick={() => {
                                document.getElementById('overlay').style.display = 'block';
                                document.getElementById('popupForm').style.display = 'block';
                            }}>
                                <img style={{ paddingRight: "10px" }} className="voir-all-icon" height="15px" width="17px" src={addIcon} alt="Ajouter" />
                                Ajouter
                            </Link>
                        </div>
                       
                    </div>
                    <div className="table_bnv">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Catégorie</th>
                                    <th>Quantité</th>
                                    <th>Date Collecte</th>
                                    <th>Entrepot</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stocks.map((stock) => (
                                    <tr key={stock.ID_Stock}>
                                        <td>{stock.denree.nom}</td>
                                        <td>{stock.denree.categorie}</td>
                                        <td>{stock.denree.quantite}</td>
                                        <td>{new Date(stock.date_collecte).toLocaleDateString()}</td>
                                        <td>{stock.entrepot.nom}</td>
                                        <td>

                                        <Link id="edit" onClick={() => handleEditStock(stock)}>
                                            <FontAwesomeIcon icon={faEdit} /> 
                                        </Link>
                                        <Link  id="trash">
                                            <FontAwesomeIcon icon={faTrash} /> 
                                        </Link> 
                                        <Link id="maraude" onClick={toggleMaraudeModal}>
                <FontAwesomeIcon icon={faHandsHelping} />
            </Link>
            {showMaraudeModal && <MaraudeModal />}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                  
                </section>

                </section>
        </>
    );
}

export default List;