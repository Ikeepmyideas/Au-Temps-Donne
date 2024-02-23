<?php 
$title = 'Statut à Valider';
include('includes/header-admin.php');
?>
<section id="horiz">
<div class="nav_img">
    <img src="assets/admin/fatrows.png" alt="">
    <a class="nav-link" style="text-decoration: none; color: #94A3B8;font-size: 18px; "href="accueil-admin.php">Board</a>
</div>
<div class="nav_img">
    <img src="assets/admin/1fatrows.png" alt="">
    <a class="nav-link" style="text-decoration: none; color: #94A3B8;font-size: 18px; "href="list.php">List</a>
</div>

<div class="nav_img">
    <img src="assets/admin/calendar-light.png" alt="">
    <a class="nav-link" style="text-decoration: none; color: #94A3B8;font-size: 18px; " href="calender.html">calendar</a>
</div>
<div class="search-container">
    <input type="text" placeholder="Search...">
    <img src="assets/admin/search-normal.png" alt="Icone Recherche">
</div>

<div id="right1"><img src="assets/admin/Chat.png" alt=""></div>
<div id="right2"><img src="assets/admin/notification.png" alt=""></div>
<div class="circle">
    <img src="assets/admin/gojo.jpg" alt="Your Image">
</div>
</section>
<section class="content">
    <div class="table_statut">
        <div class="table-header">
            <h2>Status Candidats</h2>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Nom Complet</th>
                    <th>Email</th>
                    <th>Statut</th>
                    <th>Action</th> 
                    <th></th>
                </tr>
            </thead>
            <tbody>
            
                <tr>
                    <td>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</section>
<script src="js/script.js"></script>
<script>
  
  document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname.replace(/\/$/, ""); // Normalise le chemin actuel

    // Sélectionne uniquement les liens qui sont descendants de l'élément avec l'ID #horiz
    const navLinks = document.querySelectorAll('#horiz .nav-link');

    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname.replace(/\/$/, ""); // Normalise le chemin du lien
        if (linkPath === currentPath) {
            link.style.color = "#000000"; // Change la couleur du lien
            link.style.fontWeight = "bold"; /
            const img = link.previousElementSibling; // Sélectionne l'élément précédent le lien
            if (img && img.tagName === 'IMG') {
                img.style.filter = "sepia(1) saturate(10) hue-rotate(-50deg) brightness(0.9) contrast(1.2)"

            }
        }
    });
});
</script>
<script>
fetch('http://localhost:8000/api/admin/volunteers/all-latest-volunteers')
    .then(response => response.json())
    .then(data => {
        console.log('Données des bénévoles récupérées:', data);
        const tableBody = document.querySelector('.table_statut tbody');
        let rows = '';
        
        data.forEach(volunteer => {
            let statusClass = '';
            switch(volunteer.statut.toLowerCase()) {
                case 'en attente': statusClass = 'attente'; break;
                case 'accepté': statusClass = 'accepte'; break;
                case 'refusé': statusClass = 'refuse'; break;
            }

            rows += `
                <tr>
                    <td>${volunteer.nom} ${volunteer.prenom}</td>
                    <td>${volunteer.email}</td>
                    <td class="status"><span class="status-dot ${statusClass}"></span> ${volunteer.statut}</td>
                    <td class="action">
                        ${volunteer.statut.toLowerCase() === 'en attente' ? `
                            <form method="POST" class="change-status-form" data-email="${volunteer.email}">
                                <input type="hidden" name="email" value="${volunteer.email}" />
                                <button type="button" onclick="acceptVolunteer('${volunteer.email}')" class="action-btn accepter">Accepter</button>
                               <button type="button" onclick="rejectVolunteer('${volunteer.email}')" class="action-btn refuser">Refuser</button>
           
                            </form>
                        ` : ''}
                    </td>
                    <td class="action"><button class="action-btn">ⓘ</button></td>
                </tr>
            `;
        });
        tableBody.innerHTML = rows; 
    })
    .catch(error => console.error('Erreur lors de la récupération des données des bénévoles:', error));

async function updateVolunteerStatus(email, newStatus) {
    try {
        const response = await fetch('http://localhost:8000/api/admin/volunteers/update-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, newStatus })
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data.message); 
            window.location.href = 'statut_a_valider.php';
        } else {
            throw new Error('Erreur lors de la mise à jour du statut du bénévole.');
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut du bénévole :', error);
    }
}

// Fonction pour gérer le clic sur le bouton "Accepter"
function acceptVolunteer(email) {
    updateVolunteerStatus(email, 'accepté');
}

// Fonction pour gérer le clic sur le bouton "Refuser"
function rejectVolunteer(email) {
    updateVolunteerStatus(email, 'refusé');
}


</script>


</body>
</html>
