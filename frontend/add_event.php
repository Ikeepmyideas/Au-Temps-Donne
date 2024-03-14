<?php
$title = 'Evenements';
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Itim&display=swap" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="css/admin.css">
    <style>
        .highlighted {
            background-color: #D23939;
            border-radius: 25px;
            padding-top: 10px;
            padding-bottom: 10px;
        }
        .highlighted span{
            color: #FFFFFF;
        }
        .highlighted img {
            filter: brightness(200%);
            opacity: 1; 
        }


    </style>
    <title><?php echo $title;?></title>
</head>
<body>
<nav class="nav-max">
    <header>
      <img style="display: block; margin: 0 auto;" src="assets/logo.png" alt="Votre Logo" class="logo" id="logo-light" height="80px">
    </header>
    <button id="toggle-nav-btn" class="circle"></button>
    <strong><p id="welcome"></p></strong>

    <br>
    <hr class="hr1">
    <ul class="menu">
        <li class="menu_title">
            <strong><span style="margin-left:25px;">MENU   </span></strong>
        </li>
        <li <?php if($title === "Dashboard"): ?> class="highlighted" <?php endif; ?>>
            <a class="nav-link" href="accueil-admin.php">
                <img class="image" src="assets/home-.png" alt="">
                <span>Dashborad</span>
            </a>  
        </li>
        <li <?php if($title === "Status à valider"): ?> class="highlighted" <?php endif; ?>>
            <a class="nav-link" href="statut_a_valider.php">
                <img src="assets/add_membre.png" alt="">
                <span>Status à valider</span>
            </a>  
        </li>
        <li <?php if($title === "Finance"): ?> class="highlighted" <?php endif; ?>>
            <a class="nav-link" href="#">
                <img src="assets/money.png" alt="">
                <span>Finance</span>
            </a>
        </li>
        <li <?php if($title === "Membres"): ?> class="highlighted" <?php endif; ?>>
            <a class="nav-link" href="membres.php">
                <img src="assets/membre.png" alt="">
                <span>Membres</span>
            </a>  
        </li>
        <li <?php if($title === "Evenements"): ?> class="highlighted" <?php endif; ?>>
            <a class="nav-link" href="event.php">
                <img src="assets/gestion.png" alt="">
                <span>Evenements</span>
            </a>  
        </li>
        <li <?php if($title === "Messagerie"): ?> class="highlighted" <?php endif; ?>>
            <a class="nav-link" href="#">
                <img src="assets/messages.png" alt="">
                <span>Messagerie</span>
            </a>  
        </li>
        <li <?php if($title === "Documents"): ?> class="highlighted" <?php endif; ?>>
            <a class="nav-link" href="#">
                <img src="assets/doc.png" alt="">
                <span>Documents</span>
            </a>  
        </li>

    </ul>
    <hr style="margin-bottom:10px;"class="hr2" id="hr2">
    <ul class="events">
        <li class="menu_title">
              <strong><span style="margin-left:25px;">SUPPORT</span></strong>
        </li>
        <li>
        <a class="nav-link" href="#">
            <img src="assets/settings.png" alt="">
          <span>Paramètres</span>
        </a>
      </li>
      <li>
        <a class="nav-link" href="#">
            <img src="assets/exit.png" alt="">
          <span>Déconnexion</span>
        </a>
      </li>
        
    </ul>
  </nav>
<section id="horiz">
<div class="nav_img">
    <img src="assets/fatrows.png" alt="">
    <a class="nav-link" style="text-decoration: none; color: #94A3B8;font-size: 18px; "href="accueil-admin.php">Board</a>
</div>
<div class="nav_img">
    <img src="assets/1fatrows.png" alt="">
    <a class="nav-link" style="text-decoration: none; color: #94A3B8;font-size: 18px; "href="list.php">List</a>
</div>

<div class="nav_img">
    <img src="assets/calendar-light.png" alt="">
    <a class="nav-link" style="text-decoration: none; color: #94A3B8;font-size: 18px; " href="calender.html">calendar</a>
</div>
<div class="search-container">
    <input type="text" placeholder="Search...">
    <img height="20px" src="assets/loop.png" alt="Icone Recherche">
</div>

<div id="right1"><img height="20px" src="assets/chat_.png" alt=""></div>
<div id="right2"><img height="20px" src="assets/notif.png" alt=""></div>
<div class="circle">
    <img src="assets/gojo.jpg" alt="Your Image">
</div>
</section>
<section class="content">
    <div class="table_statut">
        <div class="table-header">
            <h2>Ajouter un evenement</h2>
            <a id="add_link" href="add_event.php">Ajouter <img style="padding-top:20px; padding-left:6px;" height="15px" width="17px" src="assets/add.png"></a>
        </div>
        <form class="form_event" action="/path/to/your/server/endpoint" method="post">
            <label for="activityName">Nom de l'activité:</label>
            <input type="text" id="activityName" name="name" required><br><br>

            <label for="activityDesc">Description:</label>
            <textarea id="activityDesc" name="description" required></textarea><br><br>

            <label for="activityType">Type d'activité:</label>
            <input type="text" id="activityType" name="type"><br><br>

            <label for="activityDate">Date:</label>
            <input type="date" id="activityDate" name="date" required><br><br>

            <label for="activityTimeStart">Heure de début:</label>
            <input type="time" id="activityTimeStart" name="startTime" required><br><br>

            <label for="activityTimeEnd">Heure de fin:</label>
            <input type="time" id="activityTimeEnd" name="endTime" required><br><br>

            <label for="activityAddress">Adresse:</label>
            <input type="text" id="activityAddress" name="address" required><br><br>

            <label for="activityCity">Ville:</label>
            <input type="text" id="activityCity" name="city" required><br><br>

            <label for="activityPostalCode">Code postal:</label>
            <input type="text" id="activityPostalCode" name="postalCode" required><br><br>

            <input type="submit" value="Ajouter l'activité">
</form>
        
    </div>
</section>
<script src="js/script.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname.replace(/\/$/, ""); // Normalise le chemin actuel

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
                    <td class="action">
                        <button data-nom="${encodeURIComponent(volunteer.nom)}" data-prenom="${encodeURIComponent(volunteer.prenom)}" class="action-btn" onclick="redirectToConsulter(this)">ⓘ</button>
                    </td>

                </tr>
            `;
        });
        tableBody.innerHTML = rows; 
    })
    .catch(error => console.error('Erreur lors de la récupération des données des bénévoles:', error));
function redirectToConsulter(button) {
const nom = button.getAttribute('data-nom');
const prenom = button.getAttribute('data-prenom');
window.location.href = `consulter.php?nom=${nom}&prenom=${prenom}`;
}

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

function fetchAdminInfo(email) {
    const url = new URL('http://127.0.0.1:8000/api/admin');
    url.searchParams.append('email', email);

    fetch(url, {
        method: 'GET', 
        headers: {
            'Accept': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Problème de réponse réseau');
        }
        return response.json();
    })
    .then(adminData => {
        console.log("Données de l'administrateur récupérées:", adminData);
        const prenom = adminData.admin ? adminData.admin.prenom : "Admin";
        document.getElementById('welcome').textContent = `Bienvenue Admin ${prenom}`;
    })
    .catch(error => {
        console.error("Il y a eu un problème avec l'opération fetch: " + error.message);
    });
}
document.addEventListener('DOMContentLoaded', () => {
    const email = sessionStorage.getItem('email');
    if (!email) {
        window.location.href = 'login-admin.php';
    } else {
        fetchAdminInfo(email);
    }
});

function fetchAdminInfo(email) {
    const url = new URL('http://127.0.0.1:8000/api/admin');
    url.searchParams.append('email', email);

    fetch(url, {
        method: 'GET', 
        headers: {
            'Accept': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Problème de réponse réseau');
        }
        return response.json();
    })
    .then(adminData => {
        console.log("Données de l'administrateur récupérées:", adminData);
        const prenom = adminData.admin ? adminData.admin.prenom : "Admin";
        document.getElementById('welcome').textContent = `Bienvenue Admin ${prenom}`;
    })
    .catch(error => {
        console.error("Il y a eu un problème avec l'opération fetch: " + error.message);
    });
}
</script>
</body>
</html>
