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
    <img src="assets/gojo.jpg" alt="Your Image">
</div>
</section>
<section class="content">
    <div class="table_statut">
        <div class="table-header">
            <h3>Événements</h3>
            <a id="add_link" href="javascript:void(0);"class="view-all">Ajouter<img class="voir-all-icon" height="15px" width="17px"  src="assets/add.png" alt="Voir tout"></a>
         </div>
        <div class="container_search">
            <div class="filtrer">
                <a class="p_filtre" href=""><img style="padding-top:30px" height="20px" width="20px" src="assets/filtrer_trier.png">Filtrer et trier</a>
            </div>
            <form class="search" action="javascript:void(0);" method="GET">
                <input type="text" id="champRecherche" placeholder="   Rechercher ..." />
            </form>
        </div>
            <div  class="table-header" >
                <h4></h4>
            </div>
            <div  class="table-header" >
                <h4>Tous les évènements</h4>
                <a id="add_link" href="javascript:void(0);">
                <a href="statut_a_valider.php" class="view-all">Voir Tout<img class="voir-all-icon" src="assets/voir_all.png" alt="Voir tout"></a>
        
            </div>
                <div class="box-container" id="boxContainer">
                    <div class="elm_box">
                        <div class="infos">
                            <div class="info">
                                <img height="180px"src="assets/benevole-img.png" style="border-radius: 25px;">
                                    <div class="info-container">
                                        <div class="hour">
                                          <img height="20px"src="assets/horloge.png" style="padding-top:10px;"><p class="time">11:00 24.Fev 2024</p>
                                        </div>
                                    </div>
                            </div>
                            <div class="info2">
                                <h3>title</h3>
                                <hr></hr>
                                <p>blaaablaaablaablaaaaaaa</p>
                                <div class="adresse">
                                    <p>21 rue erard </P>
                                    <p>75120 Paris</p>
                                </div>
                            </div>
                        </div>
                        <a id="details_link" href="javascript:void(0);"class="view">Voir plus<img class="voir-all-icon" height="15px" width="17px"  src="assets/voir_all.png" alt="Voir tout"></a>

                    </div>
                    <div class="elm_box"></div>
                </div>
            </div>
        </div>
<div id="overlay"></div>

<div id="popupForm">
<div id="statutButtons">
        <button class="btn_event_type"id="publicButton">Public</button>
        <button class="btn_event_type" id="privateButton">Privé</button>
        <button class="btn_event_type" id="formationButton">Formation</button>
    </div>
    <form id="publicEventForm" >
        <div class="scrollable-content">
                <label for="activityName">Nom de l'activité:</label>
                <input type="text" id="activityName" name="titre" required>

                <label for="activityDesc">Description:</label>
                <textarea id="activityDesc" name="description" required></textarea>
                <div class="form-row">
                    <label for="activityType">Service:</label>
                    <select id="activityType" name="nom_service">
                        <option value="">Sélectionnez un service</option>
                    </select>
                </div>
        
                <div class="datetime-row">
                    <div class="date">
                        <label for="activityDate">Date:</label>
                        <input type="date" id="activityDate" name="date_activite" required>
                    </div>
                    <div>
                        <label for="activityTimeStart">Heure de début:</label>
                        <input type="time" id="activityTimeStart" name="heure_debut" required>
                    </div>
                    <div>
                        <label for="activityTimeEnd">Heure de fin:</label>
                        <input type="time" id="activityTimeEnd" name="heure_fin" required>
                    </div>
                </div>
                <div class="form-row">
                    <label for="activityAddress">Adresse:</label>
                    <input type="text" id="activityAddress" name="adresseComplete" required>
                </div>
                <div class="adresse-row">
                    <div class="form-row">
                        <label for="activityCity">Ville:</label>
                        <input type="text" id="activityCity" name="ville" required>
                    </div>

                    <div class="form-row">
                        <label style="padding-left:20px;"for="activityPostalCode">Code postal:</label>
                        <input type="text" id="activityPostalCode" name="code_postal" required>
                    </div>
                </div>
                <div class="form-row">
                    <label for="volunteerCount">Nombre de bénévoles requis:</label>
                    <input type="number" id="volunteerCount" name="nb_benevoles" min="1" required>
                </div>


                <input class="btn_event" type="submit" value="Ajouter">
            </div>
    </form>
    <form id="privateEventForm" style="display:none;">
        <div class="scrollable-content">
            <label for="privateActivityName">Nom de l'activité:</label>
            <input type="text" id="privateActivityName" name="titre" required>

            <label for="privateActivityDesc">Description:</label>
            <textarea id="privateActivityDesc" name="description" required></textarea>

            <div class="form-row">
                <label for="privateActivityType">Service:</label>
                <select id="privateActivityType" name="nom_service_privé">
                    <option value="">Sélectionnez un service</option>
                </select>
            </div>
        
            <div class="datetime-row">
                <div class="date">
                    <label for="privateActivityDate">Date:</label>
                    <input type="date" id="privateActivityDate" name="date" required>
                </div>
                <div>
                    <label for="aprivateActivityTimeStart">Heure de début:</label>
                    <input type="time" id="privateActivityTimeStart" name="heure_debut" required>
                </div>
                <div>
                    <label for="privateActivityTimeEnd">Heure de fin:</label>
                    <input type="time" id="privateActivityTimeEnd" name="heure_fin" required>
                </div>
            </div>

            <div class="form-row">
                <label for="privateActivityAddress">Adresse:</label>
                <input type="text" id="privateActivityAddress" name="adresseComplete" required>
            </div>

            <div class="adresse-row">
                <div class="form-row">
                    <label for="aprivateActivityCity">Ville:</label>
                    <input type="text" id="privateActivityCity" name="ville" required>
                </div>

                <div class="form-row">
                    <label style="padding-left:20px;" for="privateActivityPostalCode">Code postal:</label>
                    <input type="text" id="privateActivityPostalCode" name="code_postal" required>
                </div>
            </div>

            <div class="form-row">
                <label for="volunteerSelect">Choisir un bénévole :</label>
                <select id="volunteerSelect" name="selectedVolunteer" >
                    <option value="">Sélectionner un bénévole</option>
                </select>

                <label for="beneficiarySelect">Choisir un bénéficiaire :</label>
                <select id="beneficiarySelect" name="selectedBeneficiary" >
                    <option value="">Sélectionner un bénéficiaire</option>
                </select>
            </div>

            <input class="btn_event" type="submit" value="Ajouter">
        </div>
    </form>
    <form id="formationEventForm" style="display:none;">
    <div class="scrollable-content">
            <label for="formationName">Titre de la formation:</label>
            <input type="text" id="formationName" name="titre" required>

            <label for="formationDesc">Description:</label>
            <textarea id="formationDesc" name="description" required></textarea>
        
            <div class="datetime-row">
                <div class="date">
                    <label for="formationDateStart">Date de début:</label>
                    <input type="date" id="formationDateStart" name="date" required>
                </div>
                <div class="date">
                    <label for="formationDateEnd">Date de fin:</label>
                    <input type="date" id="formationDateEnd" name="date" required>
                </div>
                <div>
                    <label for="aformationTimeStart">Heure de début:</label>
                    <input type="time" id="formationTimeStart" name="heure_debut" required>
                </div>
                <div>
                    <label for="formationTimeEnd">Heure de fin:</label>
                    <input type="time" id="formationTimeEnd" name="heure_fin" required>
                </div>
            </div>

            <div class="form-row">
                <label for="formationAddress">Adresse:</label>
                <input type="text" id="formationAddress" name="adresseComplete" required>
            </div>

            <div class="adresse-row">
                <div class="form-row">
                    <label for="formationCity">Ville:</label>
                    <input type="text" id="formationCity" name="ville" required>
                </div>

                <div class="form-row">
                    <label style="padding-left:20px;" for="formationPostalCode">Code postal:</label>
                    <input type="text" id="formationPostalCode" name="code_postal" required>
                </div>
            </div>
            <input class="btn_event" type="submit" value="Ajouter">
        </div>
    </form>
</div>
</div>
<script src="js/script.js"></script>

<script>
    document.getElementById('add_link').addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('popupForm').style.display = 'block';
    });

    document.getElementById('overlay').addEventListener('click', function() {
        this.style.display = 'none';
        document.getElementById('popupForm').style.display = 'none';
    });

    document.getElementById('publicButton').addEventListener('click', function() {
        document.getElementById('publicEventForm').style.display = 'block';
        document.getElementById('privateEventForm').style.display = 'none';
        document.getElementById('formationEventForm').style.display = 'none';
        this.classList.add('active');
        document.getElementById('privateButton').classList.remove('active');
        document.getElementById('formationButton').classList.remove('active'); 
        });

    document.getElementById('privateButton').addEventListener('click', function() {
        document.getElementById('publicEventForm').style.display = 'none';
        document.getElementById('privateEventForm').style.display = 'block';
        document.getElementById('formationEventForm').style.display = 'none';
        this.classList.add('active');
        document.getElementById('publicButton').classList.remove('active');
        document.getElementById('formationButton').classList.remove('active'); 
    });

    document.getElementById('formationButton').addEventListener('click', function() {
        document.getElementById('publicEventForm').style.display = 'none';
        document.getElementById('privateEventForm').style.display = 'none';
        document.getElementById('formationEventForm').style.display = 'block';
        this.classList.add('active');
        document.getElementById('publicButton').classList.remove('active');
        document.getElementById('privateButton').classList.remove('active'); 
    });



    function fetchServices() {
    const url = new URL('http://127.0.0.1:8000/api/admin/services');

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
    .then(services => {
        console.log("Services récupérés:", services);
        displayServices(services);
    })
    .catch(error => {
        console.error("Il y a eu un problème avec l'opération fetch: " + error.message);
    });
}

function displayServices(services) {
    const activityTypeSelectPublic = document.getElementById('activityType');
    const activityTypeSelectPrivate = document.getElementById('privateActivityType'); 

    function fillSelectWithServices(selectElement) {
        selectElement.innerHTML = ''; 

        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "Sélectionnez un service";
        selectElement.appendChild(defaultOption);

        services.forEach(service => {
            const option = document.createElement('option');
            option.value = service.nom; 
            option.textContent = service.nom;
            selectElement.appendChild(option);
        });
    }

    fillSelectWithServices(activityTypeSelectPublic);
    fillSelectWithServices(activityTypeSelectPrivate);
}

document.addEventListener('DOMContentLoaded', fetchServices);

document.addEventListener('DOMContentLoaded', function () {
    fetchVolunteersAndBeneficiaries();

    document.getElementById('privateEventForm').addEventListener('submit', function (e) {
        e.preventDefault(); 

        let formData = new FormData(e.target);
        let data = {};
        formData.forEach((value, key) => {
            switch (key) {
                case 'date':
                    data['date_activite'] = value; 
                    break;
                case 'heure_debut':
                    data['heure_debut'] = value; 
                    break;
                case 'heure_fin':
                    data['heure_fin'] = value;
                    break;
                case 'nom_service_privé':
                    data['nom_service'] = value; 
                    break;
                case 'adresseComplete': 
                    data['adresseComplete'] = value;
                    break;
                case 'titre':
                    data['titre'] = value;
                    break;
        
                default:
                    data[key] = value; 
            }
        });
        let selectedVolunteer = data.selectedVolunteer ? data.selectedVolunteer.split(" ") : [];
        let selectedBeneficiary = data.selectedBeneficiary ? data.selectedBeneficiary.split(" ") : [];
        if (selectedVolunteer.length === 2) {
            [data.nomBenevole, data.prenomBenevole] = selectedVolunteer;
        }
        if (selectedBeneficiary.length === 2) {
            [data.nomBeneficiaire, data.prenomBeneficiaire] = selectedBeneficiary;
        }

        delete data.selectedVolunteer;
        delete data.selectedBeneficiary;

        console.log('Données prêtes à être envoyées:', data);

        fetch('http://127.0.0.1:8000/api/admin/addActivityPrive', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) throw new Error('Erreur réseau ou du serveur');
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                return response.json(); // Parse comme JSON si le contenu est du JSON
            } else {
                return response.text().then(text => ({text})); 
            }
        })
        .then(data => {
            if (data.text) {
                console.log('Réponse en texte:', data.text);
                alert('Activité privée ajoutée avec succès !');
            } else {
                console.log('Succès:', data);
                alert(data.message || 'Activité privée ajoutée avec succès !');
            }
        })
        .catch((error) => {
            console.error('Erreur:', error);
            alert('Erreur lors de l\'ajout de l\'activité privée: ' + error.message);
        });
    });

    function fetchVolunteersAndBeneficiaries() {
        fetch('http://localhost:8000/api/admin/volunteers') 
        .then(response => response.json())
        .then(data => {
            const volunteerSelect = document.getElementById('volunteerSelect');
            data.forEach(volunteer => {
                if (volunteer.nom && volunteer.prenom && volunteer.statut_validation.toLowerCase() === 'accepté') {
                    let option = new Option(`${volunteer.nom} ${volunteer.prenom}`, `${volunteer.nom} ${volunteer.prenom}`);
                    volunteerSelect.add(option);
                }
            });
        })
        .catch(error => console.error('Erreur lors de la récupération des bénévoles:', error));

        fetch('http://localhost:8000/api/admin/beneficiaires') 
        .then(response => response.json())
        .then(data => {
            const beneficiarySelect = document.getElementById('beneficiarySelect');
            data.forEach(beneficiary => {
                if (beneficiary.nom && beneficiary.prenom && beneficiary.statut_validation.toLowerCase() === 'accepté') {
                    let option = new Option(`${beneficiary.nom} ${beneficiary.prenom}`, `${beneficiary.nom} ${beneficiary.prenom}`);
                    beneficiarySelect.add(option);
                }
            });
        })
        .catch(error => console.error('Erreur lors de la récupération des bénéficiaires:', error));
    }
});

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

document.addEventListener('DOMContentLoaded', function() {
    const publicEventForm = document.getElementById('publicEventForm');

    publicEventForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(publicEventForm);

        fetch('http://127.0.0.1:8000/api/admin/addActivity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries(formData))
        })
        .then(response => {
            if (!response.ok) throw new Error('Erreur réseau ou du serveur');
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                return response.json(); 
            } else {
                return response.text().then(text => ({text})); 
            }
        })
        .then(data => {
            if (data.text) {
                console.log('Réponse en texte:', data.text);
                alert('Activité privée ajoutée avec succès !');
            } else if (data.error) {
                console.error('Erreur:', data.error);
                alert('Erreur lors de l\'ajout de l\'activité privée: ' + data.error);
            } else if (data.message) {
                console.log('Succès:', data);
                alert(data.message);
            }
        })
        .catch((error) => {
            console.error('Erreur:', error);
            if (error instanceof TypeError) {
                alert('Erreur de connexion réseau');
            } else {
                alert('Erreur lors de l\'ajout de l\'activité privée: ' + error.message);
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const formationEventForm = document.getElementById('formationEventForm');

    formationEventForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(formationEventForm);

        fetch('http://127.0.0.1:8000/api/admin/addFormation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries(formData))
        })
        .then(response => {
            if (!response.ok) throw new Error('Erreur réseau ou du serveur');
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                return response.json(); 
            } else {
                return response.text().then(text => ({text})); 
            }
        })
        .then(data => {
            if (data.text) {
                console.log('Réponse en texte:', data.text);
                alert('la formation ajoutée avec succès !');
            } else if (data.error) {
                console.error('Erreur:', data.error);
                alert('Erreur lors de l\'ajout de la formation : ' + data.error);
            } else if (data.message) {
                console.log('Succès:', data);
                alert(data.message);
            }
        })
        .catch((error) => {
            console.error('Erreur:', error);
            if (error instanceof TypeError) {
                alert('Erreur de connexion réseau');
            } else {
                alert('Erreur lors de l\'ajout de la formation: ' + error.message);
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
  fetch('http://127.0.0.1:8000/api/admin/activities/latest') 
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur réseau');
      }
      return response.json();
    })
    .then(activities => {
      const container = document.getElementById('boxContainer');
      container.innerHTML = '';
      activities.forEach(activity => {
        const box = document.createElement('div');
        box.className = 'elm_box';

        const date = new Date(activity.date_activite);
        const formattedDate = `${date.getHours()}:${date.getMinutes()} ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;

        box.innerHTML = `
          <div class="infos">
            <div class="info">
              <img height="180px" src="assets/benevole-img.png" style="border-radius: 25px;">
              <div class="info-container">
                <div class="hour">
                  <img height="20px" src="assets/horloge.png" style="padding-top:10px;"><p class="time">${formattedDate}</p>
                </div>
              </div>
            </div>
            <div class="info2">
              <h3>${activity.titre}</h3>
              <hr>
              <p class="description">${activity.description}</p>
              <div class="adresse">
                <p>${activity.lieu.adresse}</p>
                <p>${activity.lieu.code_postal} ${activity.lieu.ville}</p>
              </div>
            </div>
          </div>
          <a id="details_link" href="javascript:void(0);" class="view">Voir plus<img class="voir-all-icon" height="15px" width="17px" src="assets/voir_all.png" alt="Voir tout"></a>
        `;

        container.appendChild(box);
      });
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des données:', error);
    });
});

/*
async function fetchAndDisplayActivities() {
        try {
            const response = await fetch('http://localhost:8000/api/admin/activities/latest');
            const activities = await response.json();

            const eventContainer = document.getElementById('boxContainer');
            eventContainer.innerHTML = ''; 

            activities.forEach(activity => {
                const eventBox = document.createElement('div');
                eventBox.classList.add('elm_box');
                eventBox.innerHTML = `<h3>${activity.titre}</h3><p>${activity.description}</p>`;
                eventContainer.appendChild(eventBox);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des activités :", error);
        }
    }

    window.onload = fetchAndDisplayActivities;
    */
</script>
</body>
</html>
