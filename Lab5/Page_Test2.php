<?php
    include "Page.php";
    $testPage = new Page('Favorite quotes', date('Y'), 'TramPhong Entertainment');
    $testPage->addContent("<p align=\"center\">Ra xa hoi lam an buon chai</p>");
    $testPage->addContent("<p align=\"center\">Lieu an nhieu</p>");
    echo $testPage->get();
?>
