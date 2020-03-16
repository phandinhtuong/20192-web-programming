<html>
    <head> <title>String Test</title></head>
    <body>
        <?php
        $firstname = "John";
        $lastname = "Smith";
        $fullname = $firstname . $lastname;
        print ("Fullname = $fullname");
        print ("<br/>");

        $fullname2 = "$firstname $lastname";
        print ("Fullname2= $fullname");
        print ("<br/>");

        $len = strlen($fullname);
        print ("Length = $len");
        print ("<br/>");

        $in_name = " Joe Jackson ";
        $name = trim($in_name);
        print ("name=$name$name");
        print ("<br/>");

        $inquote = "Now Is The Time";
        $lower = strtolower($inquote);
        $upper = strtoupper($inquote);
        print ("upper=$upper lower=$lower");
        print ("<br/>");

        $date = "12/25/2002";
        $month = substr($date, 0, 2);
        $day = substr($date, 3, 2);
        print ("Month=$month Day=$day");
        print ("<br/>");

        $date = "12/25/2002";
        $year = substr($date, 6);
        print ("Year=$year");
        print ("<br/>");
        ?>
    </body>
</html>