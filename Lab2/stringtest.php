<html>
    <head> <title>String Test from Tuong</title></head>
    <body>
        <?php
        $x = "banana";
        $sum = 1 + $x;
        print("y = $sum"); // mix variable types
        print ("<br/>");
        
        $firstname = "John";
        $lastname = "Smith";
        $fullname = $firstname . $lastname; // concatenate 
        print ("Fullname = $fullname");
        print ("<br/>");

        $fullname2 = "$firstname $lastname"; // easier way to concat
        print ("Fullname2= $fullname");
        print ("<br/>");

        $len = strlen($fullname); // length of a string
        print ("Length = $len");
        print ("<br/>");

        $in_name = " Joe Jackson ";
        $name = trim($in_name); // remove blank characters at the beginning and the end
        print ("name=$name$name");
        print ("<br/>");

        $inquote = "Now Is The Time";
        $lower = strtolower($inquote);// string to lowercase
        $upper = strtoupper($inquote);// string to uppercase
        print ("upper=$upper lower=$lower");
        print ("<br/>");

        $date = "12/25/2002";
        $month = substr($date, 0, 2); // substring from 0
        $day = substr($date, 3, 2);
        $year = substr($date, 6);
        print ("Month=$month Day=$day Year=$year");
        print ("<br/>");

        $date = "12/25/2002";
        
        print ("<br/>");
        ?>
    </body>
</html>