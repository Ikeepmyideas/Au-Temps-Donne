<?php
session_start();

try {
    $bdd = new PDO('mysql:host=localhost;dbname=au_temps_donne', 'root', '', array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
} catch (Exception $e) {
    die('Erreur lors de la connexion à la base de données : ' . $e->getMessage());
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action'], $_POST['nom'], $_POST['prenom'])) {
    $action = $_POST['action']; // 'Accepter' ou 'Refuser'
    $nom = $_POST['nom'];
    $prenom = $_POST['prenom'];

    $nouveauStatut = '';
    if ($action === 'Accepter') {
        $nouveauStatut = 'accepté';
    } elseif ($action === 'Refuser') {
        $nouveauStatut = 'réfusé';
    }

    if ($nouveauStatut !== '') {
        $sql = "UPDATE benevoles SET statut = :nouveauStatut WHERE nom = :nom AND prenom = :prenom";
        $stmt = $bdd->prepare($sql);
        $stmt->execute([
            ':nouveauStatut' => $nouveauStatut,
            ':nom' => $nom,
            ':prenom' => $prenom
        ]);

        header('Location: statut_a_valider.php?modification=success');
        exit();
    } else {
        echo "Action non reconnue.";
    }
} else {
    header('Location: page_liste_benevoles.php?erreur=nonvalide');
    exit();
}
?>
