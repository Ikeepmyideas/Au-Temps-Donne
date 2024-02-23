<?php 
$title = 'Membres';
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
    <section class="lists">
    <div class="table-header">
            <h2>Liste des bénévoles</h2>
    </div>
            <?php 
            $current_page = basename($_SERVER['SCRIPT_NAME']);
            ?>
            <div class="container_search">
                <div class="filtrer">
                    <a class="p_filtre" href=""><img style="padding-top:30px" height="20px" width="20px" src="assets/filtrer_trier.png">Filtrer et trier</a>
                </div>
                <form class="search" action="javascript:void(0);" method="GET">
                    <input type="text" id="champRecherche" placeholder="   Rechercher ..." />
                </form>
                </div>

                <table id="tableBenevoles">
            <thead>
                <tr>
                    <th>Nom Complet</th>
                    <th>Age</th>
                    <th>Email</th>
                    <th>Numéro de téléphone</th>
                    <th>Action</th> 
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td> 
                    </td>                 
                </tr>

        </tbody>

        </table>
            
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
document.getElementById("champRecherche").addEventListener("keyup", filtrerTableau);

function filtrerTableau() {
    var input, filter, table, tr, txtValueNom, txtValueEmail;
    input = document.getElementById("champRecherche");
    filter = input.value.toUpperCase();
    table = document.getElementById("tableBenevoles");
    tr = table.getElementsByTagName("tr");

=    for (i = 1; i < tr.length; i++) { =
        tdNom = tr[i].getElementsByTagName("td")[0]; 
        tdEmail = tr[i].getElementsByTagName("td")[2]; 

        if (tdNom || tdEmail) {
            txtValueNom = tdNom ? tdNom.textContent || tdNom.innerText : "";
            txtValueEmail = tdEmail ? tdEmail.textContent || tdEmail.innerText : "";

            if (txtValueNom.toUpperCase().indexOf(filter) > -1 || txtValueEmail.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }       
    }
}

</script>

<script>

function confirmerSuppression(nom, prenom) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce bénévole ?')) {
        var form = document.createElement('form');
        document.body.appendChild(form);
        form.method = 'post';
        form.action = 'delete.php';
        var names = ['nom', 'prenom', 'action']; 
        var values = [nom, prenom, 'Supprimer']; 
            var input = document.createElement('input');
            input.type = 'hidden';
            input.name = names[i];
            input.value = values[i];
            form.appendChild(input);
        }
        form.submit();
    }


</script>
<div id="customConfirmBox" style="display:none; position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%); background-color: white; padding: 20px; border: 1px solid black; z-index: 1000;">
    <p id="confirmMessage"></p>
    <button onclick="reponseConfirm(true)">Oui</button>
    <button onclick="reponseConfirm(false)">Non</button>
</div>

<script>
function customConfirm(message, callback) {
    document.getElementById("confirmMessage").innerText = message;
    document.getElementById("customConfirmBox").style.display = "block";

    window.reponseConfirm = function(reponse) {
        document.getElementById("customConfirmBox").style.display = "none";
        callback(reponse);
    };
}

function ajouterAdminOuSupprimer(email) {
    customConfirm(`Voulez-vous ajouter ${email} comme administrateur et le supprimer de la liste des bénévoles ?`, function(ajouterEtSupprimer) {
        // Si l'utilisateur clique sur "Oui", ajouterEtSupprimer est vrai, donc on ajoute et on supprime
        // Sinon, on ajoute seulement comme admin sans supprimer
        ajouterAdmin(email, ajouterEtSupprimer);
    });
}

// Votre fonction ajouterAdmin reste inchangée

function ajouterAdmin(email, supprimerApresAjout) {
    const requestBody = {
        email: email,
        removeFromVolunteers: supprimerApresAjout
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    };

    const actionText = supprimerApresAjout ? "et supprimé de la liste des bénévoles" : "comme administrateur";
    alert(`Le bénévole ${email} sera ajouté ${actionText}.`);

    fetch('http://localhost:8000/api/admin/addAdmin', requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('La réponse du réseau n\'était pas correcte');
            }
            return response.json();
        })
        .then(data => {
            console.log(`Le bénévole ${email} a été ajouté ${actionText} avec succès:`, data);
        })
        .catch(error => console.error(`Erreur lors de l'ajout du bénévole ${email} ${actionText}:`, error));
}


function supprimerBenevole(email) {
    console.log(`Suppression du bénévole avec l'email ${email} (implémentez votre logique de suppression ici).`);
}

fetch('http://localhost:8000/api/admin/volunteers/all-latest-volunteers')
    .then(response => {
        if (!response.ok) {
            throw new Error('La réponse du réseau n\'était pas correcte');
        }
        return response.json();
    })
    .then(data => {
        console.log('Données des bénévoles récupérées:', data);
        const tableBody = document.querySelector('table tbody');
        tableBody.innerHTML = '';

        data.forEach(volunteer => {
            if (volunteer.statut.toLowerCase() === 'accepté') {
                const dateNaissance = new Date(volunteer.date_naissance);
                const difference = Date.now() - dateNaissance.getTime();
                const ageDate = new Date(difference);
                const age = Math.abs(ageDate.getUTCFullYear() - 1970);

                const row = `
                    <tr>
                        <td>${volunteer.nom} ${volunteer.prenom}</td>
                        <td>${age}</td>
                        <td>${volunteer.email}</td>
                        <td>${volunteer.telephone}</td>
                        <td class="action">
                        <button onclick="ajouterAdminOuSupprimer('${volunteer.email}')" class="action-btn ajouter">Ajouter</button>

                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            }
        });
    })
    .catch(error => console.error('Erreur lors de la récupération des données des bénévoles:', error));

    function confirmerSuppression(email) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce bénévole ?')) {
        fetch('http://localhost:8000/api/admin/volunteers/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: email})
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la suppression du bénévole');
            }
            return response.json();
        })
        .then(data => {
            console.log('Bénévole supprimé avec succès:', data);
            window.location.reload(); 
        })
        .catch(error => {
            console.error('Erreur lors de la suppression:', error);
            alert('Erreur lors de la suppression du bénévole.');
        });
    }
}
</script>


</body>
</html>