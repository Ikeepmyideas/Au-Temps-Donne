import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../css/admin.css';
import NavMenu from './navMenu';
import retour from '../assets/retour.png';

function ParticipantsList() {
    const { eventId } = useParams();
    const [participants, setParticipants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchParticipants = () => {
            fetch(`http://127.0.0.1:8000/api/admin/activites/registrations/${eventId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch participants');
                    }
                    return response.json();
                })
                .then(data => {
                    if (isMounted) {
                        setParticipants(data);
                        setIsLoading(false);
                    }
                })
                .catch(error => {
                    if (isMounted) {
                        console.error('Error fetching participants:', error);
                        setError(error.message);
                        setIsLoading(false);
                    }
                });
        };

        fetchParticipants();

        return () => {
            isMounted = false;
        };
    }, [eventId]);  

    const handleDelete = (ID_Benevole) => {
        fetch(`http://127.0.0.1:8000/api/admin/activites/registrations/${eventId}/volunteers/${ID_Benevole}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert("Participant removed successfully.");
                setParticipants(prevParticipants =>
                    prevParticipants.filter(participant => participant.ID_Benevole !== ID_Benevole)
                );
            } else {
                alert("Failed to remove participant.");
            }
        })
        .catch(error => {
            console.error('Error removing participant:', error);
            alert("Error removing participant.");
        });
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <NavMenu />
            <section className="content">
                <div className="lists">
                    <div className="header">
                        <Link to="/allEvents">
                            <img id="retour" height="20px" width="20px" src={retour} alt="Retour" />
                        </Link>
                        <h3>Bénévoles</h3>
                    </div>
                    <div className="box-container">
                        <div className="elm_boxdetails">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nom complet</th>
                                        <th>Date d'inscription</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {participants.map(participant => (
                                        <tr key={participant.ID_Benevole}>
                                            <td>{participant.volunteer.nom} {participant.volunteer.prenom}</td>
                                            <td>{new Date(participant.Date_Inscription).toLocaleDateString()}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleDelete(participant.ID_Benevole)}
                                                    className="btn-link"
                                                >
                                                    Supprimer
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ParticipantsList;
