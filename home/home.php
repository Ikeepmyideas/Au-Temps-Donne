<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accueil</title>
    <link rel="stylesheet" type="text/css" href="home.css" />
    <link rel="icon" type="image/png" href="assets/logo.png" sizes="20x40">

</head>
<body>
    <header>
        
        <div class="title_footer">
        <img src="assets/logo.png" alt="Your Logo" class="logo">
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
    </header>
    <div class="both">
        <div class="main-text">Donnons un coup de main à ceux qui en ont besoin</div>
            <h1 class="main-title"> <strong> Ensemble , <br>
            Changeons les choses</strong></h1>
            <button class="signup-btn"><a href="Inscription/signup.html">S'inscrire</button></a>
        </div>
    </div>
    <section>
        <h2>Agissez avec nous ! </h2>
        <div class="image-container">
            <div class="image-container">
                <div class="image-overlay">
                    <img src="assets/benevole.png" alt="Bénévole">
                    <div class="overlay">
                        <img src="assets/benevoles.png" height="50px">
                        <p style="font-size:20px; padding-bottom:10px;">Bénévoles</p>
                        <p>Votre temps et énergie peuvent transformer des vies. Engagez-vous à nos côtés pour le changement.</p>
                    </div>
                </div>
            </div>

            <div class="image-container">
                <div class="image-overlay">
                    <img src="assets/donation.png" alt="Donation">
                    <div class="overlay">
                        <img src="assets/dons.png" height="50px">
                        <p style="font-size:20px; padding-bottom:10px;">Dons</p>
                        <p>Votre générosité est notre force. Aidez-nous à faire la différence avec un simple geste de soutien.</p>
                    </div>
                </div>
            </div>

            <div class="image-container">
                <div class="image-overlay">
                    <img src="assets/collecte.png" alt="Collecte">
                    <div class="overlay">
                        <img src="assets/aide.png" height="50px">
                        <p style="font-size:20px; padding-bottom:10px;">Collecte</p>
                        <p>Chaque euro collecté nous rapproche de notre but. Rejoignez notre mission et investissez dans l'avenir.</p>
                    </div>
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
</body>
</html>
