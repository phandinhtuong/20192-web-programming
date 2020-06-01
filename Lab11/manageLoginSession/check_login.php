<?php
session_start();
if (!isset($_SESSION['username'])){
    header('Location: /Lab11/manageLoginSession/login.php');
    exit();
}
?>