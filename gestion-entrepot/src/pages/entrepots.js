import React, { useEffect, useState } from 'react';
import '../css/board.css';
import NavMenu from './navMenu';
import { Link } from 'react-router-dom';
import addIcon from '../assets/add.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit,faSearch , faTrash, faHandsHelping } from '@fortawesome/free-solid-svg-icons';
import { LoadScript, GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
function List() {
    const [entrepots, setEntrepots] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentEntrepot, setCurrentEntrepot] = useState({});
    const [currentStock, setCurrentStock] = useState({});
    const [showMaraudeModal, setShowMaraudeModal] = useState(false);
    const [volunteers, setVolunteers] = useState([]);
    const [dateDebut, setDateDebut] = useState('');
    const [selectedStockId, setSelectedStockId] = useState(null);
    const [itineraryData, setItineraryData] = useState(null);
    const [showMap, setShowMap] = useState(false);

    const [selectedStock, setSelectedStock] = useState(null);


const toggleMaraudeModal = (stock) => {
    setSelectedStock(stock);

    setShowMaraudeModal(!showMaraudeModal);
};

    
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
    }, []); 
    

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
            
                <h2>Ajouter une nouvelle maraude</h2>
                <form onSubmit={handleMaraudeFormSubmit}>
                    <div className="scrollable-content">
                    <label htmlFor="dateDebut">Date:</label>
                    <input type="datetime-local" id="dateDebut" name="dateDebut" value={dateDebut} onChange={e => setDateDebut(e.target.value)} required />

                    <Link type="button" onClick={fetchAvailableVolunteersForTime}>
                    <FontAwesomeIcon icon={faSearch }className="square-icon" /> 
                </Link>
                    <label htmlFor="chauffeurID">Chauffeur:</label>
                        <select id="chauffeurID" name="chauffeurID" required>
                            <option>Séléctionner unn bénévole disponible</option>
                            {volunteers.map((volunteer) => (
                                <option key={volunteer.id} value={volunteer.id}>
                                    {volunteer.prenom} {volunteer.nom} {volunteer.id}
                                </option>
                            ))}
                        </select>

                        <br></br>
                        <label htmlFor="nom">Nom:</label>
                        <input type="text" id="nom" name="nom" required />
    
                        <label htmlFor="lieuDepart">Lieu de départ :</label>
                <input
                    type="text"
                    id="lieuDepart"
                    name="lieuDepart"
                    value={
                        selectedStock &&
                        `${selectedStock.entrepot.adresse}, ${selectedStock.entrepot.code_postal} ${selectedStock.entrepot.ville}`
                    }
                    required
                />    
                        <label htmlFor="lieuArrivee">Lieu d'arrivée:</label>
                        <input type="text" id="lieuArrivee" name="lieuArrivee" required />
    
                      
                        

                        <label htmlFor="description">Description:</label>
                        <textarea id="description" name="description" required />
    
                        

    
                        <button type="submit">Submit</button>
                        {showMap && itineraryData && (
                            <div style={{ position: 'relative', width: '100%', height: '400px' }}>
                                <MapComponent itineraryData={itineraryData} />
                                <button onClick={() => setShowMap(false)} style={{ position: 'absolute', top: 10, right: 10 }}>Close Map</button>
                            </div>
                                )}
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
            stockID: selectedStock.ID_Stock,
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
            const maraude = await response.json();
    
            // Assuming itinerary needs only start and end location
            await fetchItinerary([maraudeData.lieuDepart, maraudeData.lieuArrivee]);
    
        } catch (error) {
            console.error('Error creating maraude:', error.message);
            alert(`Failed to create maraude: ${error.message}`);
        }
    };
    
 // Fetching itinerary data
const fetchItinerary = async (locations) => {
    try {
        const response = await fetch('http://localhost:8000/api/entrepot/itinerary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ addresses: locations })
        });

        if (!response.ok) {
            const errorDetail = await response.text();  // Assuming the error details are returned as plain text
            throw new Error(`Failed to generate itinerary: ${errorDetail}`);
        }

        const data = await response.json();

        setItineraryData(data);
        setShowMap(true);

    } catch (error) {
        console.error('Error generating itinerary:', error);
        alert(`Failed to generate itinerary: ${error.message}`);
    }
};


const MapComponent = ({ itineraryData }) => {
    const [response, setResponse] = useState(null);
    const [directionsError, setDirectionsError] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [map, setMap] = useState(null); // State pour stocker l'objet Google Map
    const [center, setCenter] = useState({ lat: 48.8588443, lng: 2.2943506 }); // Centre initial

    const originCoordinates = itineraryData.startAddress;
    const destinationCoordinates = itineraryData.destinationAddress;

    useEffect(() => {
        const directionsService = window.google ? new window.google.maps.DirectionsService() : null;

        if (directionsService && mapLoaded && map && originCoordinates && destinationCoordinates) {
            const request = {
                origin: originCoordinates,
                destination: destinationCoordinates,
                travelMode: 'DRIVING'
            };

            directionsService.route(request, (result, status) => {
                if (status === 'OK') {
                    setResponse(result);
                    setDirectionsError(null);
                } else {
                    setResponse(null);
                    setDirectionsError(`Erreur de chargement de l'itinéraire: ${status}`);
                }
            });
        }
    }, [mapLoaded, map, originCoordinates, destinationCoordinates]);

    const onLoad = (loadedMap) => {
        console.log('Google Maps chargé avec succès');
        setMap(loadedMap); 
        setMapLoaded(true);
    };


const handleDownloadPDF = () => {
    const mapContainer = document.getElementById('map-container');

    if (mapContainer) {
        html2canvas(mapContainer).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgHeightMM = canvas.height * 0.264583; // Convertir en millimètres (1px = 0.264583mm)
            const imgWidthMM = canvas.width * 0.264583; // Convertir en millimètres (1px = 0.264583mm)

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidthMM, imgHeightMM);
            pdf.save('route.pdf');
        });
    }
};
    return (
        <div id="map-container">
        {itineraryData && (
            <p style={{marginTop:"20px", marginBottom:"20px"}}>Temps de trajet estimé en voiture : {itineraryData.estimatedCarTime.hours} heures et {itineraryData.estimatedCarTime.minutes} minutes</p>
        )}
        <button onClick={handleDownloadPDF}>Télécharger en PDF</button>

        <LoadScript googleMapsApiKey={'AIzaSyB3KofdS-3nitMbrTB0JVftrZXYU5WYxt4'}>
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100vh' }}
                zoom={8}
                center={center}
                onLoad={onLoad}
            >
                {directionsError && <p>{directionsError}</p>}
                {response && (
                    <DirectionsRenderer
                        options={{
                            directions: response,
                            polylineOptions: {
                                strokeColor: '#FF0000',
                                strokeOpacity: 1.0,
                                strokeWeight: 4
                            }
                        }}
                    />
                )}
            </GoogleMap>
        </LoadScript>

        </div>

    );
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
                                        <Link id="maraude" onClick={() => toggleMaraudeModal(stock)}>
                                                <FontAwesomeIcon icon={faHandsHelping} />
                                            </Link>

        
                                    {showMaraudeModal && <MaraudeModal selectedStock={selectedStock}/>}

                                    

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