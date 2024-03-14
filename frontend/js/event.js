document.getElementById('privateEventForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = {
        titre: document.getElementById('titre').value,
        description: document.getElementById('description').value,
        date_activite: document.getElementById('date_activite').value,
        heure_debut: document.getElementById('heure_debut').value,
        heure_fin: document.getElementById('heure_fin').value,
        type: document.getElementById('type').value,
        nom_service: document.getElementById('nom_service').value,
        adresseComplete: document.getElementById('adresseComplete').value,
        ville: document.getElementById('ville').value,
        code_postal: document.getElementById('code_postal').value,
    };

    fetch('http://127.0.0.1:8000/api/admin/addActivityPrive', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('La requête a échoué');
        }
        return response.json();
    })
    .then(data => {
        console.log('Événement ajouté avec succès:', data);
    })
    .catch(error => {
        console.error('Erreur lors de l\'ajout de l\'événement:', error);
    });
});
document.getElementById('privateEventForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const selectedVolunteer = document.getElementById('volunteerSelect').value;
    const selectedBeneficiary = document.getElementById('beneficiarySelect').value;

    try {
        const benevoleId = await getBenevoleIdByNomPrenom(selectedVolunteer); // Implémentez cette fonction
        const beneficiaireId = await getBeneficiaireIdByNomPrenom(selectedBeneficiary); // Implémentez cette fonction

        const formData = {
            id_benevole: benevoleId,
            id_beneficiaire: beneficiaireId,
            titre: document.getElementById('titre').value,
            description: document.getElementById('activityDesc').value,
            date_activite: document.getElementById('activityDate').value,
            heure_debut: document.getElementById('activityTimeStart').value,
            heure_fin: document.getElementById('activityTimeEnd').value,
            type: document.getElementById('type').value,
            nom_service: document.getElementById('privateActivityType').value,
            adresseComplete: document.getElementById('activityAddress').value,
            ville: document.getElementById('activityCity').value,
            code_postal: document.getElementById('activityPostalCode').value,
        };


        const response = await fetch('http://127.0.0.1:8000/api/admin/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error('La requête a échoué');
        }

        const data = await response.json();
        console.log('Événement ajouté avec succès:', data);
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'événement:', error);
    }
});
