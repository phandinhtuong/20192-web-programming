<?php session_start() ?>
<html><head><title> Order Product 3 </title> </head>
    <body>
        <?php
        $sample_hidden = $_SESSION['sample_hidden'];
        print "<h1> Sample hidden= $sample_hidden</h1>";
        $product = $_SESSION['product'];
        $quantity = $_SESSION['quantity'];
        print "<br>You selected product=$product and quantity=$quantity";
         $name = $_POST['name'];
        $code = $_POST['code'];
        print "<br>Your name is $name and code is $code";
        print '</body></html>';
       
        ?>