<?php
session_start();
include('includes/db.php'); 

if (!isset($_SESSION['email'])) {
    header('Location: login-admin.php');
    exit();
}
$sql = "SELECT nom, prenom FROM administrateurs WHERE email = :email"; 
$stmt = $bdd->prepare($sql);

$stmt->bindValue(':email', $_SESSION['email']);

$stmt->execute();

$result = $stmt->fetch(PDO::FETCH_ASSOC);

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Itim&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="css/admin.css" />
    <link rel="icon" type="image/png" href="assets/logo.png" sizes="32x32">
    <title><?= $title ?></title>
    <style>
        .nav-link.change span {
            color: white;
        }
        .nav-link.change {
            background-color: #D23939;
            padding-top: 10px;
            padding-bottom: 10px;
            border-radius: 25px;
        }
        .nav-link.change img {
            filter: brightness(0) invert(1); 
        }
    </style>
</head>
<body>
<nav class="nav-max">
<img src="assets/logo.png" id="logo" alt="Votre Logo" width="110px" height="80px" style="display: block; margin: 0 auto;">
    <button id="toggle-nav-btn" class="circle"></button>
    <strong><p id="welcome">Welcome Admin <?php echo htmlspecialchars($result['prenom']); ?></p></strong>
    <br>
    <hr class="hr1">
    <ul class="menu">
        <p class="menu_title">Menu</p>
      <li>
        <a class="nav-link <?= $title === 'Dashboard' ? 'change' : '' ?>" href="accueil-admin.php">
            <img src="assets/admin/home-2.png" alt="">
            <span>Dashboard</span>
        </a>  
      </li>
      <li>
        <a class="nav-link <?= $title === 'Statut à Valider' ? 'change' : '' ?>" href="statut_a_valider.php">
            <img src="assets/admin/add.png" alt="">
          <span>Statut à Valider</span>
        </a>  
      </li>
      <li>
        <a class="nav-link <?= $title === 'Finance' ? 'change' : '' ?>" href="#">
            <img src="assets/admin/money.png" alt="">
          <span>Finance</span>
        </a>
      </li>
      <li>
        <a class="nav-link <?= $title === 'Membre' ? 'change' : '' ?>" href="#">
            <img src="assets/admin/membre.png" alt="">
          <span>Membre</span>
        </a>
      </li>
      <li>
        <a class="nav-link <?= $title === 'Gestionnaire d’événement' ? 'change' : '' ?>" href="#">
            <img src="assets/admin/gestion.png" alt="">
            <span>Gestionnaire d’événement</span>
        </a>  
      </li>
      <li>
        <a class="nav-link <?= $title === 'Calendrier' ? 'change' : '' ?>" href="#">
            <img src="assets/admin/calendar-light.png" alt="">
          <span>Calendrier</span>
        </a>  
      </li>
      <li>
        <a class="nav-link <?= $title === 'Documents' ? 'change' : '' ?>" href="#">
            <img src="assets/admin/doc.png" alt="">
          <span>Documents</span>
        </a>
      </li>
    </ul>
    <hr class="hr2" id="hr2">
    <br>
    <ul class="menu">
        <p class="menu_title">Support</p>
      <li>
        <a class="nav-link <?= $title === 'Paramètre' ? 'change' : '' ?>" href="#">
            <img src="assets/admin/settings.png" alt="">
          <span>Paramètre</span>
        </a>  
      </li>
      <li>
        <a class="nav-link <?= $title === 'Déconnexion' ? 'change' : '' ?>" href="#">
            <img src="assets/admin/exit.png" alt="">
            <span>Déconnexion</span>
        </a>  
      </li>
    </ul>
</nav>
</body>
</html>
