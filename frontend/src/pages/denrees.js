import React, { useEffect, useState } from 'react';
import '../css/admin.css';
import NavMenu from './navMenu';
import view from '../assets/voir_all.png';
import { Link } from 'react-router-dom';
import addIcon from '../assets/add.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSearch, faTrash, faHandsHelping } from '@fortawesome/free-solid-svg-icons';
import { LoadScript, GoogleMap, DirectionsRenderer } from '@react-google-maps/api';

function Stocks() {
  const [denrees, setDenrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [entrepots, setEntrepots] = useState([]);
  const [date_collecte, setDateDebut] = useState('');
  const [showCollecteModal, setShowCollecteModal] = useState(false);

  const fetchAvailableVolunteersForTime = async () => {
    const url = new URL('http://localhost:8000/api/entrepot/VolunteerAvailable');
    const params = { date: date_collecte.split('T')[0], startTime: date_collecte.split('T')[1] };
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

  useEffect(() => {
    fetchAvailableVolunteersForTime();
    fetchEntrepots();
  }, []);

  useEffect(() => {
    const fetchDenrees = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/entrepot/AllDenrees');
        if (!response.ok) {
          throw new Error('Failed to fetch denrees');
        }
        const data = await response.json();
        const latestDenrees = data.slice(-5);
        setDenrees(latestDenrees);
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

  const toggleCollecteModal = (denree) => {
    setSelected(denree);
    setShowCollecteModal(!showCollecteModal);
  };

  const CollecteModal = () => (
    <div className="modal" style={{ display: showCollecteModal ? 'block' : 'none' }}>
      <div className="modal-content">
        <span className="close" onClick={toggleCollecteModal}>&times;</span>
        <h2>Ajouter une nouvelle maraude</h2>
        <form onSubmit={handlecollecteFormSubmit}>
          <div className="scrollable-content">
            <label htmlFor="date_collecte">Date:</label>
            <input type="datetime-local" id="date_collecte" name="date_collecte" value={date_collecte} onChange={e => setDateDebut(e.target.value)} required />
            <Link type="button" onClick={fetchAvailableVolunteersForTime}>
              <FontAwesomeIcon icon={faSearch} className="square-icon" />
            </Link>
            <label htmlFor="id_chauffeur">Chauffeur:</label>
            <select id="id_chauffeur" name="id_chauffeur" required>
              <option>Séléctionner unn bénévole disponible</option>
              {volunteers.map((volunteer) => (
                <option key={volunteer.id} value={volunteer.id}>
                  {volunteer.prenom} {volunteer.nom} {volunteer.id}
                </option>
              ))}
            </select>
            <br></br>
            <label htmlFor="LieuDepart">Lieu de départ :</label>
            <input
              type="text"
              id="LieuDepart"
              name="LieuDepart"
              value={
                selected &&
                `${selected.commercant.adresse}, ${selected.commercant.code_postal} ${selected.commercant.ville}`
              }
              required
            />
            <label htmlFor="LieuArrivee">Lieu d'arrivée:</label>
            <select id="LieuArrivee" name="LieuArrivee" required>
              <option>Séléctionner un entrepot </option>
              {entrepots.map((entrepot) => (
                <option key={entrepot.adresse} value={entrepot.adresse}>
                  {entrepot.adresse}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );

  const handlecollecteFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const collecteData = {
      date_collecte: formData.get('date_collecte'),
      LieuDepart: formData.get('LieuDepart'),
      LieuArrivee: formData.get('LieuArrivee'),
      id_chauffeur: formData.get('id_chauffeur'),
      id_denree: selected.ID_Denree
    };

    try {
      const response = await fetch('http://localhost:8000/api/entrepot/addCollecte', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(collecteData)
      });

      if (!response.ok) {
        throw new Error('Failed to create maraude');
      }

      alert('Maraude created successfully!');

      const generateItineraryResponse = await fetch('AIzaSyB3KofdS-3nitMbrTB0JVftrZXYU5WYxt4', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(collecteData)
      });

      if (generateItineraryResponse.ok) {
        const itineraryData = await generateItineraryResponse.json();
        console.log('Itinerary generated:', itineraryData);
      } else {
        throw new Error('Failed to generate itinerary');
      }

    } catch (error) {
      console.error('Error creating maraude:', error.message);
      alert(`Failed to create maraude: ${error.message}`);
    }
  };

  const isDateExpiringSoon = (date) => {
    const currentDate = new Date();
    const expirationDate = new Date(date);
    const differenceInTime = expirationDate - currentDate;
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays <= 7 && differenceInDays >= 0;
  };

  return (
    <body className="adminbody">
      <NavMenu />
      <section className="content">
        <section className="tables">
          <div className="main_table">
            <div className="table-header">
              <h3 className="title_dashboard">Denrées</h3>
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
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {denrees.map((denree) => (
                    <tr key={denree.ID_Denree}>
                      <td>{denree.nom}</td>
                      <td>{denree.categorie}</td>
                      <td>{denree.quantite}</td>
                      <td className={isDateExpiringSoon(denree.date_peremption) ? 'red-text' : ''}>
                        {formatDate(denree.date_peremption)}
                      </td>
                      <td>{denree.commercant && denree.commercant.nom}</td>
                      <td className={denree.ID_Stock === null ? 'red-text' : 'green-text'}>
                        {denree.ID_Stock === null ? 'Non collecté' : 'Collecté'}
                      </td>
                      <td>
                        <button id="collecte" onClick={() => toggleCollecteModal(denree)}>
                          Ajouter
                        </button>
                        {showCollecteModal && <CollecteModal selectedStock={selected} />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {loading && <p>Chargement en cours...</p>}
            </div>
          </div>
        </section>
      </section>
    </body>
  );
}

export default Stocks;
