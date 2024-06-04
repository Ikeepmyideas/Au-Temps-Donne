import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import NavMenu from './navMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash,faEye, faMap } from '@fortawesome/free-solid-svg-icons';
import { LoadScript, GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const StockPopup = ({ isOpen, onRequestClose, stocks }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div className="modal-content">
        <h2>Informations des denrées</h2>
        <ul>
          {stocks.map((stock) => (
            <li key={stock.ID_Stock}>
              <strong>{stock.denree.nom}</strong><br />
              Quantité: {stock.denree.quantite}<br />
              Date de péremption: {new Date(stock.denree.date_peremption).toLocaleDateString('fr-FR')}
            </li>
          ))}
        </ul>
        <button style={{ marginBottom: "20px" }} className="btn_event" onClick={onRequestClose}>Fermer</button>
      </div>
    </Modal>
  );
};




const FutureMaraudes = () => {
  const [futureMaraudes, setFutureMaraudes] = useState([]);
  const [collectes, setCollectes] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itineraryData, setItineraryData] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState({});


  const fetchFutureMaraudes = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/entrepot/entrepot/maraudes');
      console.log('Maraudes récupérées:', response.data.maraudes);
      setFutureMaraudes(response.data.maraudes);
    } catch (error) {
      console.error('Erreur lors de la récupération des maraudes à venir:', error);
    }
  };

  const fetchCollectes = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/entrepot/entrepot/collectes');
      console.log('Collectes récupérées:', response.data);
      setCollectes(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des collectes:', error);
    }
  };

  useEffect(() => {
    fetchFutureMaraudes();
    fetchCollectes();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const openPopup = (stocks) => {
    console.log('Stocks sélectionnés:', stocks);
    setSelectedStocks(stocks);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedStocks([]);
  };

  const fetchItinerary = async (locations) => {
    try {
      const response = await fetch('http://localhost:8000/api/entrepot/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses: locations })
      });

      if (!response.ok) {
        throw new Error('Failed to generate itinerary');
      }

      const data = await response.json();
      setItineraryData(data);
      setShowMap(true);
    } catch (error) {
      console.error('Error generating itinerary:', error);
      alert(`Failed to generate itinerary: ${error.message}`);
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
  
    elementsToHide.forEach(el => el.classList.remove('hide-for-pdf'));
  
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
  
    pdf.text('Plan de la route', 10, 10);
    let yPosition = 20;
  
  
    pdf.addImage(imgData, 'PNG', 10, yPosition, 180, 160);
    pdf.save('route.pdf');
  };
  const MapComponent = ({ itineraryData }) => {
    const [response, setResponse] = useState(null);
    const [directionsError, setDirectionsError] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [map, setMap] = useState(null);
    const [center, setCenter] = useState({ lat: 48.8588443, lng: 2.2943506 });

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

 
    return (
      <div className="modal" style={{ display: showMap ? 'block' : 'none' }}>
        <div className="modal-content">
          <span className="close" onClick={handleCloseModal}>&times;</span>
          <div id="map-container">
            {itineraryData && (
              <p style={{ marginTop: "20px", marginBottom: "20px" }}>
                Temps de trajet estimé en voiture : {itineraryData.estimatedCarTime.hours} heures et {itineraryData.estimatedCarTime.minutes} minutes
              </p>
            )}
            <LoadScript googleMapsApiKey={'AIzaSyB3KofdS-3nitMbrTB0JVftrZXYU5WYxt4'}>
              <GoogleMap
                  mapContainerStyle={{ position: 'relative', width: '100%', height: '400px' }}
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
          <button className="btn_event" type="button" onClick={downloadPDF}>Télécharger le plan en PDF</button>

        </div>
      </div>
      
    );
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
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'entrepôt:', error.message);
      alert(`Erreur lors de la suppression de l'entrepôt: ${error.message}`);
    }
  };

  return (
    <>
      <NavMenu />
      <div className="content">
        <section className="lists">
          <div className="table-header">
            <h3 className="title_dashboard">Maraudes à venir</h3>
          </div>
          <div className="table_bnv">
            <table>
              <thead>
                <tr>
                  <th>Date Début</th>
                  <th>Lieu Départ</th>
                  <th>Lieu Arrivée</th>
                  <th>Description</th>
                  <th>Chauffeur</th>
                  <th>Stocks</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {futureMaraudes.map((maraude) => (
                  <tr key={maraude.ID}>
                    <td>{formatDate(maraude.DateDebut)}</td>
                    <td>{maraude.LieuDepart}</td>
                    <td>{maraude.LieuArrivee}</td>
                    <td>{maraude.Description}</td>
                    <td>{maraude.Chauffeur ? `${maraude.Chauffeur.prenom} ${maraude.Chauffeur.nom}` : 'N/A'}</td>
                    <td>
                      <button onClick={() => openPopup(maraude.Stocks || [])}>
                        <FontAwesomeIcon icon={faEye} style={{ color: 'blue' }} />
                      </button>
                    </td>
                    <td>
                      <button onClick={() => fetchItinerary([maraude.LieuDepart, maraude.LieuArrivee])}>
                        <FontAwesomeIcon icon={faMap} style={{ color: 'orange', paddingLeft: '5px' }} />
                      </button>
                      <button id="trash">
                        <FontAwesomeIcon icon={faTrash} onClick={() => handleDeleteEntrepot(maraude.id)} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <StockPopup isOpen={isPopupOpen} onRequestClose={closePopup} stocks={selectedStocks} />
        {itineraryData && <MapComponent itineraryData={itineraryData} />}
      </div>
      <div className="content">
  <section className="lists">
    <div className="table-header">
      <h3 className="title_dashboard">Collectes</h3>
    </div>
    <div className="table_bnv">
      <table>
        <thead>
          <tr>
            <th>Date Collecte</th>
            <th>Première Adresse </th>
            <th>Deuxième Adresse</th>
            <th>Adresse Arrivée</th>
            <th>Chauffeur</th>
            <th>Denrées</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {collectes.map((collecte) => (
            <tr key={collecte.date_collecte}>
              <td>{formatDate(collecte.date_collecte)}</td>
              <td>{collecte.adressesDepart.length > 0 ? collecte.adressesDepart[0] : '-'}</td>
              <td>{collecte.adressesDepart.length > 1 ? collecte.adressesDepart[1] : '-'}</td>
              <td>{collecte.adressesArrivee.length > 0 ? collecte.adressesArrivee[0] : '-'}</td>
              <td>{collecte.chauffeur ? `${collecte.chauffeur.prenom} ${collecte.chauffeur.nom}` : 'N/A'}</td>
              <td>
                <button onClick={() => openPopup(collecte.denrees || [])}>
                  <FontAwesomeIcon icon={faEye} style={{ color: 'blue' }} />
                </button>
              </td>
              <td>
                <button onClick={() => fetchItinerary([
                  collecte.adressesDepart[0], 
                  collecte.adressesArrivee[0], 
                  collecte.adressesDepart.length > 1 ? collecte.adressesDepart[1] : collecte.adressesArrivee.length > 1 ? collecte.adressesArrivee[0] : null
                ].filter(address => address))}>
                  <FontAwesomeIcon icon={faMap} style={{ color: 'orange', paddingLeft: '5px' }} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
          </div>
        </section>
      </div>
    </>
  );
};

export default FutureMaraudes;
