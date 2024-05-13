import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import '../css/profileb.css';
import '../css/admin.css';

import NavMenu from './navMenuVolunteer';
import { registerLocale } from 'react-datepicker';
import fr from 'date-fns/locale/fr'; // Import French locale

function Profileb() {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  const logout = async () => {
    try {
      const response = await fetch('https://au-temps-donne-api.onrender.com/api/beneficiary/logout', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        window.location.href = '/loginb';
      } else {
        console.error('Logout failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const volunteerInfoResponse = await fetch('https://au-temps-donne-api.onrender.com/api/volunteer/userinfo', {
        method: 'GET',
        credentials: 'include'
      });

      if (volunteerInfoResponse.ok) {
        const volunteerData = await volunteerInfoResponse.json();
        setUserInfo(volunteerData.volunteer);
      } else {
        throw new Error('Failed to fetch user info');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      setError('Failed to fetch user info');
    }
  };

  registerLocale('fr', fr);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <NavMenu />
      <div className="profilebbody">
        <section id="bigpieces">
          <div className="user-info">
            <h2 className="title-profile">Information de l'utilisateur :</h2>
            {/* Render user info here */}
            {/* Example: */}
            <p><strong>Nom :</strong> {userInfo?.nom} {userInfo?.prenom}</p>
            {/* Render other user info fields similarly */}
            <div className="btn-p">
              <button className="btn_profile" onClick={handleDeleteAccount}>Supprimer le compte</button>
              <button className="btn_profile" onClick={handleExportPDF}>Exporter en PDF</button>
              <Link to="/updateUserInfo">
                <button className="btn_profile">Mettre à jour les informations</button>
              </Link>
            </div>
          </div>
        </section>
        <section id="bigpieces">
          {/* Render availability section */}
          {/* Example: */}
          <div>
            <h2 className="title-profile">Disponibilités :</h2>
            <Calendar
              value={new Date()} // Default calendar value
              onClickDay={handleDateClick} // Handle day click
              tileContent={({ date }) => {
                // Custom tile content logic
                return null;
              }}
            />
            {/* Render selected availability details if available */}
            {/* Example: */}
            {selectedDateAvailability && (
              <div className="selected-availability">
                <p>{selectedDateAvailability.jour.toLocaleDateString()} de {selectedDateAvailability.heure_debut} - {selectedDateAvailability.heure_fin}</p>
                <div className="btn-p">
                  <button className="btn_profile" onClick={() => handleEditAvailability(selectedDateAvailability.id_disponibilite)}>Modifier</button>
                  <button className="btn_profile" onClick={() => handleDeleteAvailability(selectedDateAvailability.id_disponibilite)}>Supprimer</button>
                </div>
              </div>
            )}
          </div>
          {/* Render availability form */}
          {/* Example: */}
          <div className="availability-form">
            <h3 className="title-profile">{isEditing ? 'Modifier la disponibilité' : 'Ajouter une disponibilité'}</h3>
            <form onSubmit={handleAddOrUpdateAvailability}>
              {/* Form fields for adding or updating availability */}
            </form>
          </div>
        </section>
      </div>
    </>
  );
}

export default Profileb;
