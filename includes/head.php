<?php 
if(session_status() !== PHP_SESSION_ACTIVE){
    session_start(); 
}
?>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <title><?= $title ?></title>
    <link rel="icon" type="image/png" href="assets/logo.png" sizes="32x32">
    <link rel="stylesheet" type="text/css" href="css/home.css" />
</head>
