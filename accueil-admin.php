<?php 
$title = 'Dashboard';
include('includes/header-admin.php');
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $title; ?></title>
</head>
<body>
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
<section  class="content">
    <section class="tables">
        <div class="main_table">
            <h3 class="title_dashboard">Dernières notifications</h3>
            <p></p> 
        </div>
        <div class="main_table">
            <div  class="table-header">
            <h2>Status Candidats</h2>
            <a href="statut_a_valider.php" class="view-all">Voir Tout<img class="voir-all-icon" src="assets/admin/voir_all.png" alt="Voir tout"></a>
</div>
    <table class="table_bnv">
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
</section>
<script src="js/script.js"></script>

<script>
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

fetch('http://localhost:8000/api/admin/volunteers/latest-volunteers')
  .then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Données des bénévoles récupérées:', data);


    const tableBody = document.querySelector('.table_bnv tbody');
    tableBody.innerHTML = '';

    data.forEach(volunteer => {
    let statusClass = '';

    switch(volunteer.statut.toLowerCase()) {
        case 'en attente':
            statusClass = 'attente';
            break;
        case 'accepté':
            statusClass = 'accepte';
            break;
        case 'réfusé':
            statusClass = 'refuse';
            break;
    }

      const row = `
        <tr>
            <td>${volunteer.nom} ${volunteer.prenom}</td>
            <td>Bénévole</td>
            <td class="status"><span class="status-dot ${statusClass}"></span> ${volunteer.statut}</td>
            <td class="action">
            ${volunteer.statut.toLowerCase() === 'en attente' ? `
                <form method="POST" action="change_statut.php">
                    <input type="hidden" name="nom" value="${volunteer.nom}" />
                    <input type="hidden" name="prenom" value="${volunteer.prenom}" />
                    <input type="submit" name="action" class="action-btn accepter" value="Accepter"/>
                    <input type="submit" name="action" class="action-btn refuser" value="Refuser"/>
                </form>
            ` : ''}
            <td class=""><button class="action-btn">ⓘ</button></td>
            </td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  })
  .catch(error => console.error('Erreur lors de la récupération des données des bénévoles:', error));
  document.addEventListener('DOMContentLoaded', () => {
    const email = sessionStorage.getItem('email');

    if (!email) {
        window.location.href = 'login-admin.php';
        return; 
    }
});


</script>
</body>
</html>
