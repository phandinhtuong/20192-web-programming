<?php
    include "Page.php";
    $testPage = new Page('A test page', date('Y'), 'TramPhong Entertainment');
    $testPage->addContent("<p align=\"center\">This is a test content!</p>");
    echo $testPage->get();
?>
