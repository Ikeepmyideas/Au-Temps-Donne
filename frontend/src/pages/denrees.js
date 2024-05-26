import React, { useEffect, useState } from 'react';
import '../css/admin.css';
import NavMenu from './navMenu';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSearch, faTrash, faHandsHelping } from '@fortawesome/free-solid-svg-icons';
import { LoadScript, GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
import Modal from 'react-modal';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

Modal.setAppElement('#root');

function Stocks() {
  const [denrees, setDenrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [date_circuit, setDateDebut] = useState('');
  const [entrepots, setEntrepots] = useState([]);
  const [showCollecteModal, setShowCollecteModal] = useState(false);
  const [showExpiringSoon, setShowExpiringSoon] = useState(false);
  const [selectedDenrees, setSelectedDenrees] = useState([]);
  const [showDepotForm, setShowDepotForm] = useState(false);
  const [selectedEntrepot, setSelectedEntrepot] = useState('');
  const [selectedRayon, setSelectedRayon] = useState('');
  const [selectedEtage, setSelectedEtage] = useState('');
  const [selectedPartner, setSelectedPartner] = useState('');
  const [itineraryData, setItineraryData] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState({});
  const [stocks, setStocks] = useState([]);
  const [showCollected, setShowCollected] = useState('all'); // New state for filtering collected status

  const fetchStocks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/entrepot/AllStocks');
      setStocks(response.data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  const fetchAvailableVolunteersForTime = async () => {
    const url = new URL('http://localhost:8000/api/volunteer/VolunteerAvailable');
    const params = { date: date_circuit.split('T')[0], startTime: date_circuit.split('T')[1] };
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
    fetchStocks();
  }, []);

  const fetchEntrepots = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/entrepot/AllEntrepots');
      setEntrepots(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des entrepôts:', error.message);
    }
  };

  useEffect(() => {
    fetchEntrepots();
  }, []);

  useEffect(() => {
    const fetchDenrees = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/entrepot/AllDenrees');
        setDenrees(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching denrees:', error);
        setLoading(false);
      }
    };

    fetchDenrees();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleValidation = async () => {
    const collecteRequests = [];

    Object.entries(additionalInfo.groupedByPartner).forEach(([partner, info]) => {
      info.denrees.forEach((denree) => {
        collecteRequests.push({
          date_collecte: date_circuit,
          LieuDepart: info.adresse,
          LieuArrivee: additionalInfo.endAddress,
          ID_Entrepot: selectedEntrepot.id, // Utiliser l'ID de l'entrepôt
          id_chauffeur: document.getElementById('chauffeurID').value,
          id_denree: denree.ID_Denree,
          rayons: denree.rayon,
          etages: denree.etage
        });
      });
    });

    try {
      await axios.post('http://localhost:8000/api/entrepot/addCollecte', { collecteRequests }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      alert('Collectes enregistrées avec succès !');
      setShowMap(false);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des collectes:', error.message);
      alert(`Échec de l'enregistrement des collectes : ${error.message}`);
    }
  };

  const isDateExpiringSoon = (date) => {
    const currentDate = new Date();
    const expirationDate = new Date(date);
    const differenceInTime = expirationDate - currentDate;
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays <= 7 && differenceInDays >= 0;
  };

  const handleDenreeSelection = (id) => {
    setSelectedDenrees(prevSelected => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(denreeId => denreeId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const isDenreeCollected = (denreeId) => {
    return stocks.some(stock => stock.ID_Denree === denreeId);
  };

  const filteredDenrees = denrees.filter((denree) => {
    if (showExpiringSoon && !isDateExpiringSoon(denree.date_peremption)) {
      return false;
    }
    if (selectedPartner && denree.commercant.nom !== selectedPartner) {
      return false;
    }
    if (showCollected === 'collected' && !isDenreeCollected(denree.ID_Denree)) {
      return false;
    }
    if (showCollected === 'not_collected' && isDenreeCollected(denree.ID_Denree)) {
      return false;
    }
    return true;
  });

  const handleDepotFormSubmit = async (event) => {
    event.preventDefault();
    const selectedDenreesDetails = selectedDenrees.map(denreeId => denrees.find(d => d.ID_Denree === denreeId));

    if (selectedDenreesDetails.length === 0) {
      alert("Veuillez sélectionner au moins une denrée.");
      return;
    }

    const groupedByPartner = selectedDenreesDetails.reduce((acc, denree) => {
      const partnerName = denree.commercant.nom;
      if (!acc[partnerName]) {
        acc[partnerName] = {
          adresse: `${denree.commercant.adresse}, ${denree.commercant.code_postal} ${denree.commercant.ville}`,
          denrees: []
        };
      }
      acc[partnerName].denrees.push(denree);
      return acc;
    }, {});

    const locations = Object.values(groupedByPartner).map(partner => partner.adresse);
    locations.push(selectedEntrepot.adresse);

    const additionalInfo = {
      startAddress: locations[0],
      endAddress: locations[locations.length - 1],
      waypoints: locations.slice(1, locations.length - 1),
      groupedByPartner
    };
    setAdditionalInfo(additionalInfo);

    await fetchItinerary(locations);
  };

  const fetchItinerary = async (locations) => {
    try {
      const response = await axios.post('http://localhost:8000/api/entrepot/itinerary', { addresses: locations }, {
        headers: { 'Content-Type': 'application/json' }
      });

      setItineraryData(response.data);
      setShowMap(true);
    } catch (error) {
      console.error('Erreur lors de la génération de l\'itinéraire:', error);
      alert(`Échec de la génération de l'itinéraire : ${error.message}`);
    }
  };

  const handleCloseModal = () => {
    setShowMap(false);
  };

  const downloadPDF = async () => {
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) {
      console.error('Element with id "map-container" not found');
      return;
    }
  
    const elementsToHide = document.querySelectorAll('.btn_event, input, select, .close');
    elementsToHide.forEach(el => el.classList.add('hide-for-pdf'));
  
    // Capture the canvas
    const canvas = await html2canvas(mapContainer, {
      useCORS: true
    });
  
    // Show the elements again after capture
    elementsToHide.forEach(el => el.classList.remove('hide-for-pdf'));
  
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
  
    // Add additional information to the PDF
    pdf.text('Plan de la route', 10, 10);
    let yPosition = 20;
  
    if (additionalInfo) {
      pdf.text(`Départ: ${additionalInfo.startAddress}`, 10, yPosition);
      yPosition += 10;
      additionalInfo.waypoints.forEach((waypoint, index) => {
        pdf.text(`Étape ${index + 1}: ${waypoint}`, 10, yPosition);
        yPosition += 10;
      });
      pdf.text(`Arrivée: ${additionalInfo.endAddress}`, 10, yPosition);
      yPosition += 10;
    }
  
    pdf.addImage(imgData, 'PNG', 10, yPosition, 180, 160);
    pdf.save('route.pdf');
  };
  

  const MapComponent = ({ itineraryData, showMap, handleCloseModal, additionalInfo }) => {
    const [responses, setResponses] = useState([]);
    const [directionsError, setDirectionsError] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [map, setMap] = useState(null);
    const [center, setCenter] = useState({ lat: 48.8588443, lng: 2.2943506 });

    useEffect(() => {
      const directionsService = window.google ? new window.google.maps.DirectionsService() : null;

      if (directionsService && mapLoaded && map && itineraryData) {
        const { startAddress, destinationAddress, waypointsAddresses } = itineraryData;

        if (waypointsAddresses.length === 0) {
          const request = {
            origin: startAddress,
            destination: destinationAddress,
            travelMode: 'DRIVING',
            waypoints: []
          };

          directionsService.route(request, (result, status) => {
            if (status === 'OK') {
              setResponses([result]);
              setDirectionsError(null);
            } else {
              setResponses([]);
              setDirectionsError(`Erreur de chargement de l'itinéraire: ${status}`);
            }
          });
        } else {
          const waypoints1 = [{ location: waypointsAddresses[0], stopover: true }];
          const waypoints2 = waypointsAddresses.slice(1).map(address => ({ location: address, stopover: true }));

          const request1 = {
            origin: startAddress,
            destination: waypointsAddresses[0],
            travelMode: 'DRIVING',
            waypoints: []
          };

          const request2 = {
            origin: waypointsAddresses[0],
            destination: destinationAddress,
            travelMode: 'DRIVING',
            waypoints: waypoints2
          };

          directionsService.route(request1, (result1, status1) => {
            if (status1 === 'OK') {
              directionsService.route(request2, (result2, status2) => {
                if (status2 === 'OK') {
                  setResponses([result1, result2]);
                  setDirectionsError(null);
                } else {
                  setResponses([]);
                  setDirectionsError(`Erreur de chargement de l'itinéraire: ${status2}`);
                }
              });
            } else {
              setResponses([]);
              setDirectionsError(`Erreur de chargement de l'itinéraire: ${status1}`);
            }
          });
        }
      }
    }, [mapLoaded, map, itineraryData]);

    const onLoad = (loadedMap) => {
      console.log('Google Maps chargé avec succès');
      setMap(loadedMap);
      setMapLoaded(true);
    };

    const [denreesInfo, setDenreesInfo] = useState(additionalInfo.groupedByPartner);

    
    const handleInputChange = (partner, idx, field, value) => {
      const updatedInfo = { ...denreesInfo };
      updatedInfo[partner].denrees[idx][field] = value;
      setDenreesInfo(updatedInfo);
    };

    return (
      <div className="modal" style={{ display: showMap ? 'block' : 'none' }}>
        <div className="modal-content">
          <div className="scrollable-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <div id="map-container">
              {itineraryData && (
                <div>
                  <p style={{ marginTop: "20px", marginBottom: "20px" }}>Temps de trajet estimé en voiture : {itineraryData.estimatedCarTime.hours} heures et {itineraryData.estimatedCarTime.minutes} minutes</p>
                  <div id="div-stock">
                  <label htmlFor="date_circuit">Date:</label>
                    <input type="datetime-local" id="dateDebut" name="date_circuit" value={date_circuit} onChange={(e) => setDateDebut(e.target.value)} required />

                    <Link type="button" onClick={fetchAvailableVolunteersForTime}>
                      <FontAwesomeIcon icon={faSearch} className="square-icon" style={{marginTop:"20px"}} />
                    </Link>
                    <label htmlFor="chauffeurID">Chauffeur:</label>
                    <select id="chauffeurID" name="chauffeurID" required>
                      <option>Sélectionner un bénévole disponible</option>
                      {volunteers.map((volunteer) => (
                        <option key={volunteer.id} value={volunteer.id}>
                          {volunteer.prenom} {volunteer.nom} {volunteer.id}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <h3>Adresses et Denrées à récupérer</h3>
                    {Object.entries(denreesInfo).map(([partner, info], index) => (
                      <div key={index}>
                        <p><strong>Étape {index + 1} :</strong> {info.adresse}</p>
                        <ul>
                          {info.denrees.map((denree, idx) => (
                            <li key={idx}>
                              {denree.nom} - {denree.quantite} (Rayon : {denree.rayon || ''}, Étage : {denree.etage || ''})
                              <br />
                              <div id="div-stock">
                              <label htmlFor={`rayon-${partner}-${idx}`}>Rayon:</label>
                              <select
                                id={`rayon-${partner}-${idx}`}
                                value={denree.rayon || ''}
                                onChange={(e) => handleInputChange(partner, idx, 'rayon', e.target.value)}
                                required
                              >
                                <option value="">Sélectionner un rayon</option>
                                <option value="Produits alimentaires">Produits alimentaires</option>
                                <option value="Fruits et légumes">Fruits et légumes</option>
                                <option value="Produits surgelés">Produits surgelés</option>
                                <option value="Produits laitiers">Produits laitiers</option>
                                <option value="Produits hygiène">Produits hygiène</option>
                                <option value="Autre">Autre</option>
                              </select>
                              <label htmlFor={`etage-${partner}-${idx}`}>Étage:</label>
                              <select
                                id={`etage-${partner}-${idx}`}
                                value={denree.etage || ''}
                                onChange={(e) => handleInputChange(partner, idx, 'etage', e.target.value)}
                                required
                              >
                                <option value="">Sélectionner un étage</option>
                                {[...Array(10).keys()].map(n => (
                                  <option key={n + 1} value={n + 1}>{n + 1}</option>
                                ))}
                              </select>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <p><strong>Arrivée :</strong> {additionalInfo.endAddress}</p>
                   
                    <br></br>
                  </div>
                </div>
              )}
              <LoadScript googleMapsApiKey={'AIzaSyB3KofdS-3nitMbrTB0JVftrZXYU5WYxt4'}>
                <GoogleMap
                  mapContainerStyle={{ position: 'relative', width: '100%', height: '400px' }}
                  zoom={8}
                  center={center}
                  onLoad={onLoad}
                >
                  {directionsError && <p>{directionsError}</p>}
                  {responses.map((response, index) => (
                    <DirectionsRenderer
                      key={index}
                      options={{
                        directions: response,
                        polylineOptions: {
                          strokeColor: responses.length === 1 || index === 0 ? '#FF0000' : '#0000FF',
                          strokeOpacity: 1.0,
                          strokeWeight: 4
                        }
                      }}
                    />
                  ))}
                </GoogleMap>
              </LoadScript>

              <button className="btn_event" type="button" onClick={handleValidation}>Valider</button>
              <button className="btn_event" type="button" onClick={downloadPDF}>Télécharger le plan en PDF</button>

            </div>
          </div>
        </div>
      </div>
    );
  };

  const selectAllDenrees = () => {
    if (selectedDenrees.length === denrees.length) {
      setSelectedDenrees([]);
    } else {
      const allDenreeIds = denrees.map(denree => denree.ID_Denree);
      setSelectedDenrees(allDenreeIds);
    }
  };

  return (
    <div className="adminbody">
      <NavMenu />
      <section className="content">
        <section className="tables">
          <div className="main_table">
            <div className="table-header">
              <h3 className="title_dashboard">Denrées</h3>
              <label>
                <input
                  type="checkbox"
                  checked={showExpiringSoon}
                  onChange={() => setShowExpiringSoon(!showExpiringSoon)}
                />
                Afficher seulement les denrées expirant dans les 7 jours
              </label>
              <label>
                Partenaire:
                <select value={selectedPartner} onChange={(e) => setSelectedPartner(e.target.value)}>
                  <option value="">Tous</option>
                  {[...new Set(denrees.map(denree => denree.commercant.nom))].map((partner, index) => (
                    <option key={index} value={partner}>
                      {partner}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Statut:
                <select value={showCollected} onChange={(e) => setShowCollected(e.target.value)}>
                  <option value="all">Tous</option>
                  <option value="collected">Collecté</option>
                  <option value="not_collected">Non Collecté</option>
                </select>
              </label>
              <button onClick={selectAllDenrees}>Sélectionner tout</button>
            </div>
            <div className="table_bnv">
              <table>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Catégorie</th>
                    <th>Quantité</th>
                    <th>Date de péremption</th>
                    <th>Partenaire</th>
                    <th>Statut</th>
                    <th>Sélectionner</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDenrees.map((denree) => (
                    <tr key={denree.ID_Denree}>
                      <td>{denree.nom}</td>
                      <td>{denree.categorie}</td>
                      <td>{denree.quantite}</td>
                      <td className={isDateExpiringSoon(denree.date_peremption) ? 'red-text' : ''}>
                        {formatDate(denree.date_peremption)}
                      </td>
                      <td>{denree.commercant && denree.commercant.nom}</td>
                      <td className={isDenreeCollected(denree.ID_Denree) ? 'green-text' : 'red-text'}>
                        {isDenreeCollected(denree.ID_Denree) ? 'Collecté' : 'Non collecté'}
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedDenrees.includes(denree.ID_Denree)}
                          onChange={() => handleDenreeSelection(denree.ID_Denree)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {loading && <p>Chargement en cours...</p>}
              <button onClick={() => setShowDepotForm(true)}>Sélectionner Entrepôt</button>
            </div>
          </div>
        </section>
        {showDepotForm && (
          <section className="depot-form">
            <h3>Choisissez l'entrepôt pour les denrées sélectionnées</h3>
            <form onSubmit={handleDepotFormSubmit}>
              <label htmlFor="entrepot">Entrepôt:</label>
              <select
                id="entrepot"
                value={JSON.stringify(selectedEntrepot)}
                onChange={(e) => setSelectedEntrepot(JSON.parse(e.target.value))}
                required
              >
                <option value="">Sélectionner un entrepôt</option>
                {entrepots.map((entrepot) => (
                  <option key={entrepot.id} value={JSON.stringify({ id: entrepot.id, adresse: entrepot.adresse })}>
                    {entrepot.adresse}, {entrepot.ville}, {entrepot.code_postal}
                  </option>
                ))}
              </select>
              <button type="submit">Soumettre</button>
            </form>
          </section>
        )}
        <Modal
          isOpen={showMap}
          onRequestClose={handleCloseModal}
          contentLabel="Map Modal"
          className="map-modal"
          overlayClassName="map-modal-overlay"
        >
          <div className="scrollable-content">
            {itineraryData && <MapComponent itineraryData={itineraryData} showMap={showMap} handleCloseModal={handleCloseModal} additionalInfo={additionalInfo} />}
            <button onClick={handleCloseModal}>Fermer</button>
          </div>
        </Modal>
      </section>
    </div>
  );
}

export default Stocks;
