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
    <title>Document</title>
</head>
<body>
<nav class="nav-max">
    <header>
      <img style="display: block; margin: 0 auto;" src="assets/logo.png" alt="Votre Logo" class="logo" id="logo-light" height="80px">
    </header>
    <button id="toggle-nav-btn" class="circle"></button>
    <strong><p id="welcome">Welcome user *****</p></strong>

    <br>
    <hr class="hr1">
    <ul class="menu">
    <li class="menu_title">
              <strong><span >MENU   </span></strong>
        </li>
      <li>
        <a class="nav-link" href="#">
            <img src="assets/admin/home-2.png" alt="">
            <span>Dashborad</span>
        </a>  
      </li>
      <li>
        <a class="nav-link" href="#">
            <img src="assets/admin/add.png" alt="">
          <span>Status à valider</span>
        </a>  
      </li>
      <li>
        <a class="nav-link" href="#">
            <img src="assets/admin/money.png" alt="">
          <span>Finance</span>
        </a>
      </li>
      <li>
        <a class="nav-link" href="#">
            <img src="assets/admin/membre.png" alt="">
            <span>Membres</span>
        </a>  
      </li>
      <li>
        <a class="nav-link" href="#">
            <img src="assets/admin/gestion.png" alt="">
          <span>Evenements</span>
        </a>  
      </li>
      <li>
        <a class="nav-link" href="#">
            <img src="assets/admin/message.png" alt="">
          <span>Messagerie</span>
        </a>  
      </li>
      <li>
        <a class="nav-link" href="#">
            <img src="assets/admin/doc.png" alt="">
          <span>Documents</span>
        </a>  
      </li>

      
    </ul>
    <hr style="margin-bottom:10px;"class="hr2" id="hr2">
    <ul class="events">
        <li class="menu_title">
              <strong><span >SUPPORT</span></strong>
        </li>
        <li>
        <a class="nav-link" href="#">
            <img src="assets/admin/settings.png" alt="">
          <span>Paramètres</span>
        </a>
      </li>
      <li>
        <a class="nav-link" href="#">
            <img src="assets/admin/exit.png" alt="">
          <span>Déconnexion</span>
        </a>
      </li>
        
    </ul>
  </nav>
    <script src="js/script.js"></script>
</body>
</html>
