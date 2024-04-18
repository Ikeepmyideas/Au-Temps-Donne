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
<section  class="content">
    <section class="tables">
        <div class="main_table">
            <h3 class="title_dashboard">Dernières notifications</h3>
            <p></p> 
        </div>
        <div class="main_table">
            <div class="table-header">
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

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function getMonthName(monthNumber) {
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  return months[monthNumber];
}

function generateCalendar(month, year) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();

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
    const dateElement = document.getElementById('date');

    const today = new Date();

    const day = today.getDate();
    const month = today.getMonth() + 1; 
    const year = today.getFullYear();

    dateElement.textContent = `Aujourd'hui : ${day}/${month}/${year}`;

    document.addEventListener('DOMContentLoaded', () => {
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
});

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
      const row = `
        <tr>
          <td>${volunteer.nom} ${volunteer.prenom}</td>
          <td>Bénévole</td>
          <td class="status">${volunteer.statut}</td>
          <td class="action"><button class="action-btn">ⓘ</button></td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  })
  .catch(error => console.error('Erreur lors de la récupération des données des bénévoles:', error));

</script>
</body>
</html>
