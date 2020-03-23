<html>
    <head>
        <title>Information Form</title>
    </head>
    <body>
        <?php
            print("Your information:<br>");
            $name = $_GET["name"];
            $dob = $_GET["dob"];
            $gender = $_GET["gender"];
            $class = $_GET["class"];
            $uni = $_GET["uni"];
            $hobbies = $_GET["hobbies"];
            
            print("Hello, $name.<br>");
            print("Gender: $gender.<br>");
            print("Date of birth: $dob.<br>");
            print("You are studying at $class, $uni.<br>");
            print("Your hobbies are:<br>");
            for($i = 0; $i< count($hobbies);$i++){
                $j = $i+1;
                echo "\t";
                print("$j. $hobbies[$i].<br>");
            }
        ?>
    </body>
</html>

