<?php
include 'includes/db.php'; // Assurez-vous que ce chemin est correct

$recherche = isset($_GET['recherche']) ? "%".$_GET['recherche']."%" : null;

if ($recherche) {
    // Préparer la requête SQL avec un filtre
    $sql = "SELECT * FROM benevoles WHERE nom LIKE :recherche OR prenom LIKE :recherche";
    $stmt = $bdd->prepare($sql);
    $stmt->bindParam(':recherche', $recherche);
} else {
    // Requête SQL sans filtre si aucun terme de recherche n'est fourni
    $sql = "SELECT * FROM benevoles";
    $stmt = $bdd->prepare($sql);
}

$stmt->execute();
$resultats = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Afficher les résultats
foreach ($resultats as $ligne) {
    echo "<div>" . htmlspecialchars($ligne['nom']) . " " . htmlspecialchars($ligne['prenom']) . "</div>";
}
?>
