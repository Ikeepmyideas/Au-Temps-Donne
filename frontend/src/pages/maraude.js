import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import NavMenu from './navMenu';

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
        <button onClick={onRequestClose}>Fermer</button>
      </div>
    </Modal>
  );
};

const FutureMaraudes = () => {
  const [futureMaraudes, setFutureMaraudes] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedStocks, setSelectedStocks] = useState([]);

  const fetchFutureMaraudes = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/entrepot/entrepot/maraudes');
      console.log('Maraudes récupérées:', response.data.maraudes);
      setFutureMaraudes(response.data.maraudes);
    } catch (error) {
      console.error('Erreur lors de la récupération des maraudes à venir:', error);
    }
  };

  useEffect(() => {
    fetchFutureMaraudes();
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
                    <button onClick={() => openPopup(maraude.Stocks || [])}>Voir les stocks</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <StockPopup isOpen={isPopupOpen} onRequestClose={closePopup} stocks={selectedStocks} />
    </div>
    </>

  );
};

export default FutureMaraudes;
