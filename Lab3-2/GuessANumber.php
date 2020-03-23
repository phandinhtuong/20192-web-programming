<html>
    <head><title>Guess A Number!</title></head>
    <body>
        <form action="<?php echo $_SERVER['PHP_SELF']?>" method="GET">
            <h2>
                Guess number from 0 to 100.
            </h2>
       <?php
            if (!isset($_GET["number"])){
                srand((double) microtime()*10000000);
                $number = rand(0,100);
                //$_GET["number"] = $number;
            }else {
                $number = $_GET["number"];
            }
            
            
            if (isset($_GET["times"])){
                $times = $_GET["times"];
            } else {
                $times = 0;
            }
            $check = 0;
            if (isset($_GET["input"])){
                if ($_GET["input"] ===null || !is_numeric($_GET["input"])){
                    print("<br>You must enter a number! ");
                } else{
                    $times = $times + 1;
                    if ($_GET["input"] > $number){
                    print("<br>Wrong. Please try a lower number. ");
                }else if ($_GET["input"] < $number){
                    print("<br>Wrong. Please try a higher number. ");
                }
                else{
                    print("<br>You won! ");
                    $check = 1;
                }
                print("You have guessed $times times!");
                }
                    
            }
            //print("<br>Number = $number<br>");
            if ($check == 0){
                print("<br>Input a number: ");
            }else {
                print("<br>Number = $number<br>");
            }
            
            ?>
        </form>
        <form action="" method="get">
            <?php
                if ($check ==0){
                    ?>
             <input type="text" size="4" maxlength="6" name="input">
            <input name="number" type="hidden" value="<?php echo $number?>" method="get">
            <input name="times" type="hidden" value="<?php echo $times?>" method="get">
            <input type="submit" value="submit">
            <?php
                    
                }else {
                    unset($_GET["number"]);
                    ?>
            <!--<input type="text" size="4" maxlength="6" name="input">-->
<!--            <input name="number" type="hidden" value="" method="get">
            <input name="times" type="hidden" value="0" method="get">-->
            <input type="submit" value="reset">
            
            <?php 
                }
            ?>
           
        </form>
    </body>
</html>

