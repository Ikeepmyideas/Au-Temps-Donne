<!DOCTYPE html>
<html lang="fr">
<?php 
$title = 'Accueil';
include('includes/head.php');
?>
<body>
    <header>
        <div class="title_footer">
            <img src="assets/logo.png" alt="Votre Logo" class="logo" id="logo-light" height="80px">
            <img src="assets/logo-dark.png" alt="Votre Logo en mode sombre" class="logo" id="logo-dark"  height="80px" style="display: none;">
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
        <h1 class="title1">Agissez avec nous !</h1>
        <div class="image-container">
            <div class="image-overlay">
                <img src="assets/benevole-img.png" alt="Bénévole">
                <div class="overlay">
                    <img src="assets/benevoles.png" height="50px" style="border-radius: 30px;">
                    <p style="font-size:20px; padding-bottom:10px;">Bénévoles</p>
                    <p>Votre temps et énergie peuvent transformer des vies. Engagez-vous à nos côtés pour le changement.</p>
                </div>
            </div>
            <div class="image-overlay">
                <img src="assets/donation.png" alt="Donation">
                <div class="overlay">
                    <img src="assets/dons.png" height="50px" style="border-radius: 30px;">
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
    <section>
        <div class="newletter">
            <h1 class="title_newletter">Abonnez-vous à notre newsletter !</h1>
            <p>Recevez les dernières actualités, des événements à venir, et des histoires inspirantes de notre association.</p>
            <form class="email_box" id="newsletterForm">
                <input class="tbox" type="email" name="email" id="emailInput" placeholder="Entrez votre email" required>
                <button class="box" type="submit">Inscription</button>
            </form>
            <div id="newsletterMessage"></div>

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
    <script src="js/dark-mode.js"></script>
    <script>
    document.getElementById('newsletterForm').addEventListener('submit', function(event) {
        event.preventDefault(); 
        const email = document.getElementById('emailInput').value;

        const currentDate = new Date().toISOString().slice(0, 10); // Format YYYY-MM-DD

        fetch('http://localhost:8000/api/newsletter/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, date_inscription: currentDate })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Erreur lors de l\'inscription à la newsletter');
        })
        .then(data => {
            document.getElementById('newsletterMessage').innerText = 'Vous êtes maintenant inscrit à notre newsletter !';
        })
        .catch(error => {
            document.getElementById('newsletterMessage').innerText = 'Une erreur est survenue. Veuillez réessayer plus tard.';
            console.error('Erreur lors de l\'inscription à la newsletter :', error);
        });
    });
</script>
</body>
</html>
