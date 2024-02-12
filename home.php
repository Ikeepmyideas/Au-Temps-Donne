<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous" defer></script>
    <link rel="icon" type="image/png" href="assets/logo.png" sizes="32x32">
    <link rel="stylesheet" type="text/css" href="home.css" />
    <title>Accueil </title>
</head>
<body>
    <header>
        <div class="title_footer">
            <img src="assets/logo.png" alt="Votre Logo" class="logo" id="logo-light">
            <img src="assets/logo-dark.png" alt="Votre Logo en mode sombre" class="logo" id="logo-dark" style="display: none;">
            <p class="p_title">Au temps donné</p>
        </div>
        <div class="nav">
            <a href="#">Accueil</a>
            <a href="#">Notre histoire</a>
            <a href="#">Evènements</a>
            <a href="#">Dons</a>
            <a href="#">Comment ça marche ?</a>
        </div>
        <button class="connection-btn">Connexion</button>
        <button id="dark-mode-btn" onclick="toggleDarkMode()"><svg width="19" height="19" fill="currentColor" class="bi bi-brightness-high" viewBox="0 0 16 16"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z"></path>
                                 <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"></path>
                            </svg></button>
    </header>
    <div class="both">
        <div class="main-text">Donnons un coup de main à ceux qui en ont besoin</div>
        <h1 class="main-title"> <strong> Ensemble , <br> Changeons les choses</strong></h1>
        <button class="signup-btn"><a href="Inscription/signup.html" >S'inscrire</a></button>
    </div>
    <section>
        <h2 class="title1">Agissez avec nous !</h2>
        <div class="image-container">
            <div class="image-overlay">
                <img src="assets/benevole.png" alt="Bénévole">
                <div class="overlay">
                    <img src="assets/benevoles.png" height="50px">
                    <p style="font-size:20px; padding-bottom:10px;">Bénévoles</p>
                    <p>Votre temps et énergie peuvent transformer des vies. Engagez-vous à nos côtés pour le changement.</p>
                </div>
            </div>
            <div class="image-overlay">
                <img src="assets/donation.png" alt="Donation">
                <div class="overlay">
                    <img src="assets/dons.png" height="50px">
                    <p style="font-size:20px; padding-bottom:10px;">Dons</p>
                    <p>Votre générosité est notre force. Aidez-nous à faire la différence avec un simple geste de soutien.</p>
                </div>
            </div>
            <div class="image-overlay">
                <img src="assets/collecte.png" alt="Collecte">
                <div class="overlay">
                    <img src="assets/aide.png" height="50px">
                    <p style="font-size:20px; padding-bottom:10px;">Collecte</p>
                    <p>Chaque euro collecté nous rapproche de notre but. Rejoignez notre mission et investissez dans l'avenir.</p>
                </div>
            </div>
        </div>
    </section>

    <script src="js/dark-mode.js"></script>
</body>
</html>
