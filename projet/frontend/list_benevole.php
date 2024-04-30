<?php
$title = 'Membres';
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
            <a class="nav-link" href="#">
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
    <section class="lists">
    <div class="table-header">
            <h3>Liste des bénévoles</h3>
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
        </tbody>

        </table>
            
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
fetch('http://localhost:8000/api/admin/volunteers')
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
            if (volunteer.statut_validation.toLowerCase() === 'accepté') {
                const dateNaissance = new Date(volunteer.date_de_naissance);
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

function ajouterAdminOuSupprimer(email) {
    customConfirm(`Voulez-vous ajouter ${email} comme administrateur et le supprimer de la liste des bénévoles ?`, function(ajouterEtSupprimer) {
        ajouterAdmin(email, ajouterEtSupprimer);
    });
}

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