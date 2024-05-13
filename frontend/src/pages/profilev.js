function Profileb() {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [availabilityData, setAvailabilityData] = useState({
    jour: null,
    heure_debut: '',
    heure_fin: ''
  });
  const [selectedDateAvailability, setSelectedDateAvailability] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAvailabilityId, setSelectedAvailabilityId] = useState(null);

  // Fonction pour déconnecter l'utilisateur
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

  // Fonction pour récupérer les informations utilisateur
  const fetchUserInfo = async () => {
    try {
      const response = await fetch('https://au-temps-donne-api.onrender.com/api/volunteer/userinfo', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUserInfo(data.volunteer);
      } else {
        throw new Error('Failed to fetch user info');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      setError('Failed to fetch user info');
    }
  };

  // Fonction pour récupérer les disponibilités
  const fetchAvailability = async () => {
    try {
      const response = await fetch('https://au-temps-donne-api.onrender.com/api/volunteer/availability', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setAvailability(data);
      } else {
        console.error('Failed to fetch availability:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  // Effet pour charger les informations utilisateur et les disponibilités au montage
  useEffect(() => {
    fetchUserInfo();
    fetchAvailability();
  }, []);

  // Fonction pour gérer le clic sur une date dans le calendrier
  const handleDateClick = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    const availForDate = availability.find(avail => new Date(avail.jour).toISOString().split('T')[0] === formattedDate);
    setSelectedDateAvailability(availForDate);
  };

  // Fonction pour ajouter ou mettre à jour une disponibilité
  const handleAddOrUpdateAvailability = async (e) => {
    e.preventDefault();
    const url = isEditing
      ? `https://au-temps-donne-api.onrender.com/api/volunteer/updateAvailability/${selectedAvailabilityId}`
      : 'https://au-temps-donne-api.onrender.com/api/volunteer/add-to-availability';

    const method = isEditing ? 'PUT' : 'POST';

    const formattedData = {
      ...availabilityData,
      jour: availabilityData.jour.toISOString().split('T')[0]
    };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formattedData)
      });

      if (response.ok) {
        console.log(`Availability ${isEditing ? 'updated' : 'created'} successfully`);
        fetchAvailability();
      } else {
        console.error(`Failed to ${isEditing ? 'update' : 'create'} availability:`, response.statusText);
      }
    } catch (error) {
      console.error('Error adding/updating availability:', error);
    }
  };

  // Fonction pour supprimer une disponibilité
  const handleDeleteAvailability = async (id) => {
    try {
      const response = await fetch(`https://au-temps-donne-api.onrender.com/api/volunteer/deleteAvailability/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        console.log('Availability deleted successfully');
        fetchAvailability();
      } else {
        console.error('Failed to delete availability:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting availability:', error);
    }
  };

  // Rendu du composant
  return (
    <>
      <NavMenu />
      <div className="profilebbody">
        {/* Section des informations utilisateur */}
        <section>
          <div className="user-info">
            <h2>Informations de l'utilisateur :</h2>
            {/* Affichage des informations utilisateur */}
            <p><strong>Nom :</strong> {userInfo ? `${userInfo.nom} ${userInfo.prenom}` : ''}</p>
            {/* Afficher d'autres informations utilisateur de la même manière */}
          </div>
        </section>
        {/* Section des disponibilités */}
        <section>
          <div>
            <h2>Disponibilités :</h2>
            {/* Calendrier des disponibilités */}
            <Calendar
              onClickDay={handleDateClick}
              tileContent={({ date }) => {
                const formattedDate = date.toISOString().split('T')[0];
                const hasAvailability = availability.some(avail => new Date(avail.jour).toISOString().split('T')[0] === formattedDate);
                return hasAvailability ? <p>Disponible</p> : null;
              }}
            />
            {/* Afficher les détails de la disponibilité sélectionnée */}
            {selectedDateAvailability && (
              <div>
                <p>Date : {selectedDateAvailability.jour}</p>
                <p>Heure de début : {selectedDateAvailability.heure_debut}</p>
                <p>Heure de fin : {selectedDateAvailability.heure_fin}</p>
                {/* Boutons pour modifier ou supprimer la disponibilité */}
                <button onClick={() => setIsEditing(true)}>Modifier</button>
                <button onClick={() => handleDeleteAvailability(selectedDateAvailability.id)}>Supprimer</button>
              </div>
            )}
            {/* Formulaire pour ajouter ou modifier une disponibilité */}
            <form onSubmit={handleAddOrUpdateAvailability}>
              <DatePicker
                selected={availabilityData.jour}
                onChange={(date) => setAvailabilityData({ ...availabilityData, jour: date })}
              />
              <input
                type="text"
                value={availabilityData.heure_debut}
                onChange={(e) => setAvailabilityData({ ...availabilityData, heure_debut: e.target.value })}
                placeholder="Heure de début"
              />
              <input
                type="text"
                value={availabilityData.heure_fin}
                onChange={(e) => setAvailabilityData({ ...availabilityData, heure_fin: e.target.value })}
                placeholder="Heure de fin"
              />
              <button type="submit">{isEditing ? 'Modifier' : 'Ajouter'}</button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}

export default Profileb;
