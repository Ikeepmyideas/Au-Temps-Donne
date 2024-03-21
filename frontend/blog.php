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
                <h3>Blog</h3>
                <a id="add_link" href="javascript:void(0);">
                    Ajouter <img style="padding-top: 20px; padding-left: 6px;" height="15px" width="17px" src="assets/add.png">
                </a>
            </div>
            <div  class="table-header" >
                <h4>Mes blogs</h4>
            </div>
            <div  class="table-main" >
                <h4>Tous les blogs</h4><br>
                <div class="blogs-container">
                    <div class="blog_box"></div>
                    <div class="blog_box"></div>
                    <div class="blog_box"></div>
                </div>
            </div>
        </div>
    <div id="overlay"></div>

    <div id="popupForm">
        <form id="publicEventForm" enctype="multipart/form-data">
            <div class="scrollable-content">
                    <label for="activityName">Titre du blog:</label>
                    <input type="text" id="activityName" name="nom" required>

                    <label for="activityDesc">Contenu:</label>
                    <textarea id="activityDesc" name="description" required></textarea>

                    <label for="blogImage">Image du blog:</label>
                    <input type="file" id="blogImage" name="image" accept="image/*">
        
                    <input class="btn_event" type="submit" value="Ajouter">
                </div>
        </form>
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
        document.getElementById('welcome').textContent = `Bienvenue, ${prenom}`;
    })
    .catch(error => {
        console.error("Il y a eu un problème avec l'opération fetch: " + error.message);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("publicEventForm");

    form.addEventListener("submit", function(e) {
        e.preventDefault(); 

        const titre = document.getElementById("activityName").value;
        const contenu = document.getElementById("activityDesc").value;
        const emailAdmin = sessionStorage.getItem('email'); 

        const formData = {
            titre,
            contenu,
            emailAdmin, 
        };

        fetch('http://localhost:8000/api/admin/blogs/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer votre_token' // Si l'authentification est nécessaire
            },
            body: JSON.stringify(formData) 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('La réponse réseau n\'est pas ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Blog créé avec succès :", data);
           
        })
        .catch(error => {
            console.error("Erreur lors de la création du blog :", error);
        });
    });
});
async function fetchAndDisplayBlogs() {
    try {
        const response = await fetch('http://localhost:8000/api/admin/blogs'); // Utilisez l'URL de votre API
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const blogs = await response.json();

        // Assurez-vous que votre conteneur de blogs est vide
        const blogsContainer = document.querySelector('.blogs-container');
        blogsContainer.innerHTML = '';

        // Limitez l'affichage aux 3 premiers blogs pour correspondre à votre structure HTML
        blogs.slice(0, 3).forEach(blog => {
            const blogBox = document.createElement('div');
            blogBox.className = 'blog_box';
            blogBox.innerHTML = `<h5>${blog.titre}</h5><p>${blog.contenu.substring(0, 100)}...</p>`; // Affiche un extrait
            blogsContainer.appendChild(blogBox);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des blogs:", error);
    }
}

document.addEventListener('DOMContentLoaded', fetchAndDisplayBlogs);
</script>
</body>
</html>
