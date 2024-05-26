import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NavMenu from './navMenu';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSearch, faTrash, faHandsHelping } from '@fortawesome/free-solid-svg-icons';
import { LoadScript, GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
import Modal from 'react-modal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function StocksList() {
  const { id } = useParams();
  const [stocks, setStocks] = useState([]);
  const [selectedDenrees, setSelectedDenrees] = useState([]);
  const [showExpiringSoon, setShowExpiringSoon] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState('');
  const [showCollected, setShowCollected] = useState('all');
  const [selectAll, setSelectAll] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [destination, setDestination] = useState('');
  const [volunteers, setVolunteers] = useState([]);
  const [dateCircuit, setDateCircuit] = useState('');
  const [selectedRayon, setSelectedRayon] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState({
    startAddress: '',
    endAddress: '',
    waypoints: [],
    groupedByPartner: {}
  });
  const [showMap, setShowMap] = useState(false);
  const [itineraryData, setItineraryData] = useState(null);
  const destinationAddressRef = useRef();
  const [entrepotAddress, setEntrepotAddress] = useState({
    adresse: '',
    ville: '',
    code_postal: ''
  });

  const fetchAvailableVolunteersForTime = async () => {
    const url = new URL('http://localhost:8000/api/volunteer/VolunteerAvailable');
    const params = { date: dateCircuit.split('T')[0], startTime: dateCircuit.split('T')[1] };
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
    if (dateCircuit) {
      fetchAvailableVolunteersForTime();
    }
  }, [dateCircuit]);

  useEffect(() => {
    const fetchEntrepotAddress = async (idEntrepot) => {
      try {
        const response = await axios.get(`http://localhost:8000/api/entrepot/${idEntrepot}`);
        setEntrepotAddress({
          adresse: response.data.adresse,
          ville: response.data.ville,
          code_postal: response.data.code_postal
        });
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'adresse de l\'entrepôt:', error);
      }
    };

    const fetchStocks = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/entrepot/${id}/stocks`);
        setStocks(response.data);
        if (response.data.length > 0) {
          await fetchEntrepotAddress(id);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des stocks:', error);
      }
    };

    fetchStocks();
  }, [id]);

  const isDateExpiringSoon = (date) => {
    const currentDate = new Date();
    const expirationDate = new Date(date);
    const differenceInTime = expirationDate - currentDate;
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays <= 7 && differenceInDays >= 0;
  };

  const handleStockSelection = (id) => {
    setSelectedDenrees((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((ID_Stock) => ID_Stock !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedDenrees([]);
    } else {
      const allIds = stocks.map((stock) => stock.ID_Stock);
      setSelectedDenrees(allIds);
    }
    setSelectAll(!selectAll);
  };

  const handleFilterChange = (filter, value) => {
    switch (filter) {
      case 'showExpiringSoon':
        setShowExpiringSoon(value);
        break;
      case 'selectedPartner':
        setSelectedPartner(value);
        break;
      case 'showCollected':
        setShowCollected(value);
        break;
      default:
        break;
    }
  };

  const handleAddMaraude = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    const form = event.target;
    const departAddress = form.departAddress.value;
    const destinationAddress = form.destination.value;
    const nomMaraude = form.nomMaraude.value;
    const description = form.description.value;
    const chauffeurID = form.chauffeurID.value;
  
    if (selectedDenrees.length === 0) {
      alert('Veuillez sélectionner au moins une denrée.');
      return;
    }
  
    if (!volunteers.find((volunteer) => volunteer.id.toString() === chauffeurID)) {
      alert('Chauffeur non trouvé.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:8000/api/entrepot/addMaraude', {
        Nom: nomMaraude,
        LieuDepart: departAddress,
        LieuArrivee: destinationAddress,
        DateDebut: dateCircuit,
        Description: description,
        ChauffeurID: parseInt(chauffeurID, 10),
        StockIDs: selectedDenrees // Envoyer plusieurs IDs de stocks
      });
      setShowPopup(false);
      alert('Maraude ajoutée avec succès!');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la maraude:', error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Erreur lors de l'ajout de la maraude : ${error.response.data.message}`);
      } else {
        alert('Erreur lors de l\'ajout de la maraude.');
      }
    }
  };

  const filteredStocks = stocks.filter((stock) => {
    if (showExpiringSoon && !isDateExpiringSoon(stock.denree.date_peremption)) {
      return false;
    }
    if (showExpiringSoon && !isDateExpiringSoon(stock.denree.date_peremption)) {
      return false;
    }
    if (selectedRayon && stock.rayons !== selectedRayon) {
      return false;
    }
    return true;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDepotFormSubmit = async (event) => {
    event.preventDefault();

    const selectedDenreesDetails = selectedDenrees.map((denreeId) => stocks.find((d) => d.ID_Stock === denreeId));

    if (selectedDenreesDetails.length === 0) {
      alert('Veuillez sélectionner au moins une denrée.');
      return;
    }

    const departAddress = `${entrepotAddress.adresse}, ${entrepotAddress.ville}, ${entrepotAddress.code_postal}`;
    const destinationAddress = destinationAddressRef.current.value;
    const locations = [departAddress, destinationAddress];

    const newAdditionalInfo = {
      startAddress: locations[0],
      endAddress: locations[locations.length - 1],
      waypoints: [],
      groupedByPartner: {}
    };

    setAdditionalInfo(newAdditionalInfo);
    await fetchItinerary(locations, newAdditionalInfo);
  };

  const fetchItinerary = async (locations, additionalInfo) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/entrepot/itinerary',
        { addresses: locations },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      setItineraryData({ ...response.data, additionalInfo });
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

    const canvas = await html2canvas(mapContainer, {
      useCORS: true
    });

    elementsToHide.forEach(el => el.classList.remove('hide-for-pdf'));

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();

    pdf.text('Plan de la route', 10, 10);
    let yPosition = 20;

    if (additionalInfo) {
      pdf.text(`Départ: ${additionalInfo.startAddress}`, 10, yPosition);
      yPosition += 10;
      if (additionalInfo.waypoints) {
        additionalInfo.waypoints.forEach((waypoint, index) => {
          pdf.text(`Étape ${index + 1}: ${waypoint}`, 10, yPosition);
          yPosition += 10;
        });
      }
      pdf.text(`Arrivée: ${additionalInfo.endAddress}`, 10, yPosition);
      yPosition += 10;
    }

    pdf.addImage(imgData, 'PNG', 10, yPosition, 180, 160);
    pdf.save('route.pdf');
  };

  const MapComponent = ({ itineraryData, showMap, handleCloseModal }) => {
    const [responses, setResponses] = useState([]);
    const [directionsError, setDirectionsError] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [map, setMap] = useState(null);
    const [center, setCenter] = useState({ lat: 48.8588443, lng: 2.2943506 });

    useEffect(() => {
      const directionsService = window.google ? new window.google.maps.DirectionsService() : null;

      if (directionsService && mapLoaded && map && itineraryData) {
        const { startAddress, endAddress, waypoints } = itineraryData.additionalInfo;

        if (waypoints.length === 0) {
          const request = {
            origin: startAddress,
            destination: endAddress,
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
          const waypoints1 = [{ location: waypoints[0], stopover: true }];
          const waypoints2 = waypoints.slice(1).map((address) => ({ location: address, stopover: true }));

          const request1 = {
            origin: startAddress,
            destination: waypoints[0],
            travelMode: 'DRIVING',
            waypoints: []
          };

          const request2 = {
            origin: waypoints[0],
            destination: endAddress,
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

    return (
      <div id="map-container">
        {itineraryData && (
          <div>
            <p style={{ marginTop: '20px', marginBottom: '20px' }}>
              Temps de trajet estimé en voiture : {itineraryData.estimatedCarTime.hours} heures et {itineraryData.estimatedCarTime.minutes} minutes
            </p>
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
      </div>
    );
  };

  return (
    <>
      <NavMenu />
      <section className="content">
        <section className="lists">
          <div className="table-header">
            <h3 className="title_dashboard">Liste des Stocks</h3>
            <div>
  
          </div>

          <label  htmlFor="filterRayon">Filtrer par rayon:</label>
                <select 
                  id="filterRayon"
                  value={selectedRayon}
                  onChange={(e) => setSelectedRayon(e.target.value)}
                >
                  <option value="">Tous les rayons</option>
                  <option value="Produits alimentaires">Produits alimentaires</option>
                  <option value="Fruits et légumes">Fruits et légumes</option>
                  <option value="Produits surgelés">Produits surgelés</option>
                  <option value="Produits laitiers">Produits laitiers</option>
                  <option value="Produits hygiène">Produits hygiène</option>
                  <option value="Autre">Autre</option>
                </select>
                <label>
                <input
                  type="checkbox"
                  checked={showExpiringSoon}
                  onChange={(e) => handleFilterChange('showExpiringSoon', e.target.checked)}
                />
                Afficher seulement les denrées expirant dans les 7 jours
              </label>
            </div>
          <div className="table_bnv">
            <table>
              <thead>
                <tr>
                  <th>Date Collecte</th>
                  <th>Date Peremption</th>
                  <th>Nom</th>
                  <th>Quantité</th>
                  <th>Rayons</th>
                  <th>Étages</th>
                  <th>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                      Tout sélectionner
                    </label>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStocks.map((stock) => (
                  <tr key={stock.ID_Stock}>
                    <td>{stock.date_collecte}</td>
                    <td className={isDateExpiringSoon(stock.denree.date_peremption) ? 'red-text' : ''}>
                      {formatDate(stock.denree.date_peremption)}
                    </td>
                    <td>{stock.denree.nom}</td>
                    <td>{stock.denree.quantite}</td>
                    <td>{stock.rayons}</td>
                    <td>{stock.etages}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedDenrees.includes(stock.ID_Stock)}
                        onChange={() => handleStockSelection(stock.ID_Stock)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button style={{marginBottom:"20px"}} className="btn_event" onClick={handleAddMaraude}>Ajouter une maraude</button>
        </section>
      </section>
      {showPopup && (

          <div className="modal">
          <div className="modal-content">
            <div className="scrollable-content">
              <span className="close" onClick={handleClosePopup}>&times;</span>
              <h3>Ajouter une Maraude</h3>
              <form onSubmit={handleFormSubmit}>
                <div id="div-stock">
                  <label htmlFor="date_circuit">Date:</label>
                  <input
                    type="datetime-local"
                    id="dateCircuit"
                    name="date_circuit"
                    value={dateCircuit}
                    onChange={(e) => setDateCircuit(e.target.value)}
                    required
                  />
                  <Link type="button" onClick={fetchAvailableVolunteersForTime}>
                    <FontAwesomeIcon icon={faSearch} className="square-icon" style={{ marginTop: '20px' }} />
                  </Link>
                  <label htmlFor="chauffeurID">Chauffeur:</label>
                  <select id="chauffeurID" name="chauffeurID" required>
                    <option value="">Sélectionner un bénévole disponible</option>
                    {volunteers.map((volunteer) => (
                      <option key={volunteer.id} value={volunteer.id}>
                        {volunteer.prenom} {volunteer.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <p>Adresse de départ : {`${entrepotAddress.adresse}, ${entrepotAddress.ville}, ${entrepotAddress.code_postal}`}</p>
                <label htmlFor="departAddress">Adresse de départ:</label>
                <input
                  type="text"
                  id="departAddress"
                  name="departAddress"
                  defaultValue={`${entrepotAddress.adresse}, ${entrepotAddress.ville}, ${entrepotAddress.code_postal}`}
                  required
                />
                <label htmlFor="destination">Adresse de destination:</label>
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  value={destination}
                  ref={destinationAddressRef}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
                
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  required
                />
                <div>
                  <h4>Stocks sélectionnés:</h4>
                  <ul>
                    {selectedDenrees.map((id) => {
                      const stock = stocks.find((s) => s.ID_Stock === id);
                      return (
                        <li key={id}>
                          {stock.denree.nom} - Quantité: {stock.denree.quantite} - (Rayon : {stock.rayons} - Etage: {stock.etages})
                        </li>
                      );
                    })}
                  </ul>
                </div>
                {showMap && (
                <MapComponent
                  itineraryData={itineraryData}
                  showMap={showMap}
                  handleCloseModal={handleCloseModal}
                />
              )}
                <button className="btn_event" type="button" onClick={handleDepotFormSubmit}>Voir la route</button>
                <button className="btn_event" type="submit">Créer une maraude</button>
                <button className="btn_event" type="button" onClick={downloadPDF}>Télécharger le plan en PDF</button>
                <button className="btn_event" type="button" onClick={handleClosePopup}>Annuler</button>
              </form>
              
            </div>
          </div>
          </div>

      )}
    </>
  );
}

export default StocksList;
