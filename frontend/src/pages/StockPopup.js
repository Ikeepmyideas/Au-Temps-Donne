import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const StockPopup = ({ isOpen, onRequestClose, stocks }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Informations des denrées"
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Informations des denrées</h2>
      <ul>
        {stocks.map((stock) => (
          <li key={stock.ID_Stock}>
            <strong>{stock.nom}</strong><br />
            Quantité: {stock.quantite}<br />
            Date de péremption: {new Date(stock.date_peremption).toLocaleDateString('fr-FR')}
          </li>
        ))}
      </ul>
      <button onClick={onRequestClose}>Fermer</button>
    </Modal>
  );
};

export default StockPopup;
