<?php
$title = 'Membres';
include('includes/header-admin.php');
?>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">

<section id="horiz">
<div>
    <img src="assets/admin/fatrows.png" alt="">
    <a class="nav-link" style="text-decoration: none; color: #94A3B8;font-size: 18px; "href="accueil-admin.php">Board</a>
</div>
<div>
    <img src="assets/admin/1fatrows.png" alt="">
    <a class="nav-link" style="text-decoration: none; color: #94A3B8;font-size: 18px; "href="list.php">List</a>
</div>

<div>
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
    <section class="info_bnv">
        <!-- Ajout du bouton pour revenir en arrière -->
        <a href="javascript:history.back()" class="back-button" stye="background-color: #f5f5f5;
  margin-top: 30px;">
                <i class="fas fa-arrow-left"></i> Retour
            </a>
        <div class="list_type">
            <h2>Informations du bénévole :</h2>
        </div>
        <ul class="infos">
            <!-- Informations du bénévole ici -->
        </ul>
    </section>
</section>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const nom = params.get('nom');
    const prenom = params.get('prenom');

    fetch(`http://localhost:8000/api/admin?nom=${nom}&prenom=${prenom}`)
      .then(response => response.json())
      .then(data => {
        console.log('Données des bénévoles récupérées:', data);
        document.querySelector('.infos').innerHTML = `
          <li><span>Nom :</span> ${data.nom}</li>
          <li><span>Prénom :</span> ${data.prenom}</li>
          <li><span>Email :</span> ${data.email}</li>
          <li><span>Numéro de téléphone :</span> ${data.telephone}</li>
        `;
      })
      .catch(error => console.error('Erreur lors de la récupération des données:', error));
  });
</script>

<script>
  
  const navBar = document.querySelector("nav");
  const toggleNavBtn = document.querySelector("#toggle-nav-btn");
  const logoImage = document.querySelector("nav header > img");
  const welcomeMessage = document.getElementById("welcome");
  const horizDiv = document.querySelector("#horiz div:first-child");
  const horizDiv2 = document.querySelector("#horiz div:nth-child(3)");
  const calendar = document.querySelector(".content");


  toggleMargin();
  toggleMargin2();

  toggleCalendarWidth(); 
  toggleNavBtn.addEventListener("click", () => {
      toggleNav();
      toggleWelcome();
      toggleMargin();
      toggleMargin2();
      toggleCalendarWidth();
  });
  
  function toggleNav() {
      if (navBar.classList.contains("nav-min")) {
          openNav();
      } else {
          closeNav();
      }
  }
  
  function openNav() {
      navBar.classList.remove("nav-min");
      navBar.classList.add("nav-max");
      logoImage.style.width = "139px";
      logoImage.style.height = "95px";
  }
  
  function closeNav() {
      navBar.classList.remove("nav-max");
      navBar.classList.add("nav-min");
      logoImage.style.width = "65px";
      logoImage.style.height = "50px";
  }
  
  function toggleWelcome() {
      welcomeMessage.classList.toggle("hidden");
  }
  
  function toggleMargin() {
    
      if (navBar.classList.contains("nav-max")) {
          horizDiv.style.marginLeft = "365px";
      } else {
          horizDiv.style.marginLeft = "150px";
      }
  }

  function toggleMargin2() {
    const screenWidth = window.innerWidth;
    const horizDiv2 = document.querySelector("#horiz div:nth-child(3)");

    if (navBar.classList.contains("nav-max")) {
        if (screenWidth <= 1500) {
            horizDiv2.style.marginRight = "25%";
        } else {
            horizDiv2.style.marginRight = "44%";
        }
    } else if (navBar.classList.contains("nav-min")) {
        if (screenWidth <= 1500) {
            horizDiv2.style.marginRight = "40%";
        } else {
            horizDiv2.style.marginRight = "54%";
        }
    }
}


  const phone = window.matchMedia("(max-width: 480px)");

  
  function media(e) {
      if (e.matches) {
          closeNav();
      } else {
          openNav();
      }
  }
  
  phone.addEventListener('change', media);
  media(phone); 
  
const monthElement = document.getElementById('current-month-year');
const daysElement = document.getElementById('days');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');

// Variables pour stocker le mois et l'année actuels
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Fonction pour obtenir le nom du mois à partir de son numéro
function getMonthName(monthNumber) {
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  return months[monthNumber];
}

// Fonction pour générer le calendrier pour le mois et l'année actuels
function generateCalendar(month, year) {
  // Récupération du nombre de jours dans le mois donné
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Affichage du nom du mois et de l'année
  monthElement.textContent = getMonthName(month) + ' ' + year;

  daysElement.innerHTML = '';

  for (let i = 1; i <= daysInMonth; i++) {
      const dayElement = document.createElement('div');
      dayElement.classList.add('day');
      dayElement.textContent = i;
      daysElement.appendChild(dayElement);
  }
}

function prevMonth() {
  currentMonth--;
  if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
  }
  generateCalendar(currentMonth, currentYear);
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
  }
  generateCalendar(currentMonth, currentYear);
}

generateCalendar(currentMonth, currentYear);


function toggleCalendarWidth() {
    const screenWidth = window.innerWidth;

    if (navBar.classList.contains("nav-max")) {
        if (screenWidth <= 1500) {
            calendar.style.marginLeft = "22%";
        } else {
            calendar.style.marginLeft = "17.5%";
        }
    } else if (navBar.classList.contains("nav-min")) {
        if (screenWidth <= 1500) {
            calendar.style.marginLeft = "8%";
        } else {
            calendar.style.marginLeft = "6%";
        }
    }

}


  </script>
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
function filtrerTableau() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("champRecherche");
    filter = input.value.toUpperCase();
    table = document.getElementById("tableBenevoles");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0]; 
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }       
    }
}
function confirmerSuppression(nom, prenom) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce bénévole ?')) {
        var form = document.createElement('form');
        document.body.appendChild(form);
        form.method = 'post';
        form.action = 'delete.php';
        var names = ['nom', 'prenom', 'action']; 
        var values = [nom, prenom, 'Supprimer']; 
        for (var i = 0; i < names.length; i++) {
            var input = document.createElement('input');
            input.type = 'hidden';
            input.name = names[i];
            input.value = values[i];
            form.appendChild(input);
        }
        form.submit();
    }
}

</script>

</body>
</html>
