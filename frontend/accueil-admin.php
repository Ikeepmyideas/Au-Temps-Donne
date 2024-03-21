<?php
$title = 'Dashboard';
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
                <span>Maraudes</span>
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
        <a class="nav-link" style="text-decoration: none; color: #94A3B8;font-size: 18px; " href="calender.html">Planning</a>
    </div>
    <div class="nav_img">
        <img src="assets/doc.png" alt="">
        <a class="nav-link" style="text-decoration: none; color: #94A3B8;font-size: 18px; " href="blog.php">Blog</a>
    </div>

    <div class="search-container">
        <input type="text" placeholder="Search...">
        <img height="20px" src="assets/loop.png" alt="Icone Recherche">
    </div>

    <div id="right1"><img height="20px" src="assets/chat_.png" alt=""></div>
    <div id="right2"><img height="20px" src="assets/notif.png" alt=""></div>
    <div class="circle">
        <a href="profil_admin.php"><img src="assets/gojo.jpg">
    </a>
</div>
</section>
<section  class="content">
    <section class="tables">
        <div class="main_table">
            <h3 class="title_dashboard">Dernières notifications</h3>
            <p></p> 
        </div>
        <div class="main_table">
            <div  class="table-header">
            <h3>Status Candidats</h3>
            <a href="statut_a_valider.php" class="view-all">Voir Tout<img class="voir-all-icon" src="assets/voir_all.png" alt="Voir tout"></a>
</div>
    <div class="table_bnv">
        <table>
            <thead>
                <tr>
                    <th>Nom Complet</th>
                    <th>Rôle</th>
                    <th>Statut</th>
                    <th></th> 
                </tr>
            </thead>
            <tbody>

                <tr>
                    <td>Bénévole</td>
                    <td class="action"><button class="action-btn">ⓘ</button></td>
                </tr>
            </tbody>
        </table>
    </div>
</section>
<section>
    <div class="table_avenir">
        <h3 class="title_dashboard">A venir</h3>
        <p id="date"></p>
    </div>
</section>

<script src="js/script.js"></script>

<script>
    fetch('http://localhost:8000/api/admin/all/latest') 
        .then(response => response.json())
        .then(data => {
            console.log('Données des bénévoles et bénéficiaires récupérées:', data);
            const tableBody = document.querySelector('.table_bnv tbody');
            let rows = '';
            
            data.forEach(item => {
                let statusClass = '';
                switch(item.statut_validation?.toLowerCase()) { 
                    case 'en attente': statusClass = 'attente'; break;
                    case 'accepté': statusClass = 'accepte'; break;
                    case 'refusé': statusClass = 'refuse'; break;
                    default: statusClass = ''; // Cas par défaut si le statut est absent ou différent
                }

                rows += `
                    <tr>
                        <td>${item.nom} ${item.prenom}</td>
                        <td>${item.type}</td> <!-- Afficher si c'est un bénévole ou un bénéficiaire -->
                        <td class="status"><span class="status-dot ${statusClass}"></span> ${item.statut_validation || 'N/A'}</td>
                        <td class="action">
                            ${item.statut?.toLowerCase() === 'en attente' ? `
                                <form method="POST" class="change-status-form" data-email="${item.email}">
                                    <input type="hidden" name="email" value="${item.email}" />
                                    <button data-nom="${encodeURIComponent(item.nom)}" data-prenom="${encodeURIComponent(item.prenom)}" class="action-btn" onclick="redirectToConsulter(this)">ⓘ</button>
                                </form>
                            ` : ''}
                        </td>
                        <td class="action">
                        </td>
                    </tr>
                `;
            });
            tableBody.innerHTML = rows;
        })
        .catch(error => console.error('Erreur lors de la récupération des données:', error));

const currentPath = window.location.pathname.replace(/\/$/, "");

const navLinks = document.querySelectorAll('#horiz .nav-link');

navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname.replace(/\/$/, "");
    if (linkPath === currentPath) {
        link.style.color = "#000000";
        link.style.fontWeight = "bold"; 
        const img = link.previousElementSibling; 
        if (img && img.tagName === 'IMG') {
            img.style.filter = "sepia(1) saturate(10) hue-rotate(-50deg) brightness(0.9) contrast(1.2)"

        }
    }
});

</script>
  <script>
document.addEventListener('DOMContentLoaded', () => {
    const authToken = localStorage.getItem('authToken');
    console.log(authToken);

    if (!authToken) {
        window.location.href = 'login-admin.php';
        return; 
    }

    const email = sessionStorage.getItem('email'); 
    console.log(email);


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