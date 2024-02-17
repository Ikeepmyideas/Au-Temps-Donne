<?php
try {
    $bdd = new PDO('mysql:host=localhost;dbname=au_temps_donne', 'root', '', array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
} catch (Exception $e) {
    die('Erreur PDO : ' . $e->getMessage());
}
?>
