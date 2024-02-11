<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <title>Accueil </title>
    <link rel="icon" type="image/png" href="assets/logo.png" sizes="32x32">
    <link rel="stylesheet" type="text/css" href="home.css" />
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
        body.dark-mode {
            margin: 0;
            padding: 0;
            font-family: 'Roboto', sans-serif;
            border-radius: 10px;
            background:
                url('assets/background4.png') no-repeat center top fixed,
                url('assets/point2-dark.png') no-repeat top fixed;
            background-size: cover;
            background-color: #544D4D;
        }
        button.dark-mode {
            background-color: #8A80FE;
            color: black; 
        }
       
        .signup-btn.dark-mode{
        color: black; 
        background-color: #8A80FE; 
        }
        .signup-btn a.dark-mode{
        color: black; 
        background-color: #8A80FE; 
        }
        #dark-mode-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999; 
            padding: 10px 20px;
            background-color: #333;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        footer.dark-mode {
        background-color: #3c1e6e; 
    }

    </style>
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
        <button id="dark-mode-btn" onclick="toggleDarkMode()">Mode Sombre</button>
    </header>
    <div class="both">
        <div class="main-text">Donnons un coup de main à ceux qui en ont besoin</div>
        <h1 class="main-title"> <strong> Ensemble , <br> Changeons les choses</strong></h1>
        <button class="signup-btn"><a href="Inscription/signup.html" >S'inscrire</a></button>
    </div>
    <section>
        <h1 class="title1">Agissez avec nous !</h1>
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
    <footer>
        <div class="main_menu">
            <div class ="banner_footer">
                <div class="title_footer">
                    <img src="assets/logo_white.png" height="60px">
                    <p class="p_title">Au temps donné</p>
                </div>
                <h3>Ensemble changeons les choses</h3>
            </div>
            <div class="second_menu">
                <div class ="menu_footer">
                    <h3 class="title_list">Service</h3>
                    <a href="">Faire un Don</a>
                    <a href="">Devenir Bénévole</a>
                    <a href="">Nos Partenaires</a>
                    <a href="">Evènements</a>
                </div>
                <div class ="menu_footer">
                    <h3 class="title_list">A propos</h3>
                    <a href="">Notre histoire</a>
                    <a href="">Comment ça marche</a>
                    <a href="">S'engager avec Nous</a>
                </div>
                <div class ="menu_footer">
                    <h3 class="title_list">Contact</h3>
                    <p>0667309962</p>
                </div>
                <div class ="menu_footer">
                    <h3 class="title_list">Suivez nous</h3>
                    <div class="social-icons">
                        <a href="URL_YOUTUBE"><img src="assets/youtube.png" alt="YouTube"></a>
                        <a href="URL_INSTAGRAM"><img src="assets/instagram.png" alt="Instagram"></a>
                        <a href="URL_FACEBOOK"><img src="assets/facebook.png" alt="Facebook"></a>
                        <a href="URL_WHATSAPP"><img src="assets/whatsapp.png" alt="WhatsApp"></a>
                    </div>
                </div>
            </div>
        </div>
        <div class="">
            <hr class="featurette-divider">
            <p class="copyright">© <?php echo date("Y");?> Au temps donné</p>
        </div>
    </footer>
    <script>
        function toggleDarkMode() {
            var body = document.body;
            var btn = document.getElementById('dark-mode-btn');
            var logoLight = document.getElementById('logo-light');
            var logoDark = document.getElementById('logo-dark');

            body.classList.toggle("dark-mode");

            if (body.classList.contains("dark-mode")) {
                btn.textContent = "Mode Clair";
            } else {
                btn.textContent = "Mode Sombre";
            }

            if (body.classList.contains("dark-mode")) {
                logoLight.style.display = "none";
                logoDark.style.display = "block";
            } else {
                logoLight.style.display = "block";
                logoDark.style.display = "none";
            }

            var connectionBtns = document.querySelectorAll('.connection-btn');
            connectionBtns.forEach(function(btn) {
                btn.classList.toggle('dark-mode');
            });
            var inscriptionBtns = document.querySelectorAll('.signup-btn');
            inscriptionBtns.forEach(function(insbtn) {
                insbtn.classList.toggle('dark-mode');
            });

            var footer = document.querySelectorAll('footer');
            footer.forEach(function(footer) {
                footer.classList.toggle('dark-mode');
            });
        }

        window.onscroll = function() {
            var btn = document.getElementById('dark-mode-btn');
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                btn.style.display = "block";
            }
        };
    </script>
</body>
</html>
