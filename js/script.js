
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
