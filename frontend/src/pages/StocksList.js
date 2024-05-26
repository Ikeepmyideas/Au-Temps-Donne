import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NavMenu from './navMenu';

function StocksList() {
  const { id } = useParams();
  const [stocks, setStocks] = useState([]);
  const [denrees, setDenrees] = useState([]);
  const [selectedDenrees, setSelectedDenrees] = useState([]);
  const [showExpiringSoon, setShowExpiringSoon] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState('');
  const [showCollected, setShowCollected] = useState('all');

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/entrepot/${id}/stocks`);
        setStocks(response.data);
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
                  <th>Sélectionner</th>
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
        </section>
      </section>
    </>
  );
}

export default StocksList;
