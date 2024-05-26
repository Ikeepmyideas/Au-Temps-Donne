import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NavMenu from './navMenu';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSearch, faTrash, faHandsHelping } from '@fortawesome/free-solid-svg-icons';
import { LoadScript, GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
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
  const [date_circuit, setDateDebut] = useState('');
  const [entrepotAddress, setEntrepotAddress] = useState({
    adresse: '',
    ville: '',
    code_postal: ''
  });

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
  }, []);

  
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
          const idEntrepot = id;
          await fetchEntrepotAddress(idEntrepot);
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
    setSelectedDenrees(prevSelected => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(ID_Stock => ID_Stock !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedDenrees([]);
    } else {
      const allIds = stocks.map(stock => stock.ID_Stock);
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

  const handleSubmitMaraude = async () => {
    try {
      await axios.post('http://localhost:8000/api/maraude', {
        entrepot: `${entrepotAddress.adresse}, ${entrepotAddress.ville}, ${entrepotAddress.codePostal}`,
        destination,
        stocks: selectedDenrees
      });
      setShowPopup(false);
      alert('Maraude ajoutée avec succès!');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la maraude:', error);
    }
  };

  const filteredStocks = stocks.filter((stock) => {
    if (showExpiringSoon && !isDateExpiringSoon(stock.denree.date_peremption)) {
      return false;
    }
    return true;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };


  return (
    <>
      <NavMenu />
      <section className="content">
        <section className="lists">
          <div className="table-header">
            <h3 className="title_dashboard">Liste des Stocks</h3>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={showExpiringSoon}
                  onChange={(e) => handleFilterChange('showExpiringSoon', e.target.checked)}
                />
                Afficher seulement les denrées expirant dans les 7 jours
              </label>
            </div>
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
          <button onClick={handleAddMaraude}>Ajouter une maraude</button>
        </section>
      </section>
      {showPopup && (
        
        <div className="modal" >
        <div className="modal-content">
          <div className="scrollable-content">
            <span className="close" >&times;</span>
       
            <h3>Ajouter une Maraude</h3>
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
            <p>Adresse de départ : {`${entrepotAddress.adresse}, ${entrepotAddress.ville}, ${entrepotAddress.code_postal}`}</p>
            <label>
              Adresse de destination:
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </label>
            <button onClick={handleSubmitMaraude}>Soumettre</button>
            <button onClick={handleClosePopup}>Annuler</button>
          </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StocksList;
