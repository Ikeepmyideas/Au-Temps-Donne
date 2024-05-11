import React, { useEffect, useState } from 'react';
import '../css/board.css';
import NavMenu from './navMenu';
import view from '../assets/voir_all.png';

function Stocks() {
  const [denrees, setDenrees] = useState([]);
  const [loading, setLoading] = useState(true);

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
          <td>{denree.date_peremption}</td>
          <td>{denree.commercant && denree.commercant.nom}</td>
          <td className={denree.ID_Stock === null ? 'red-text' : 'green-text'}>
            {denree.ID_Stock === null ? 'Non collecté' : 'Collecté'}
          </td>        </tr>
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
