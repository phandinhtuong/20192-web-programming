<html>
    <head><title>Guess A Number!</title></head>
    <body>
        <form action="<?php echo $_SERVER['PHP_SELF']?>" method="GET">
        <?php
        
            function guess($number, $guessNumber, $times){
                $times ++;
                if ($guessNumber < $number){
                    print("Wrong. Please try a higher number. You have guessed $times times!");
                }else if ($guessNumber > $number){
                    print("Wrong. Please try a lower number. You have guessed $times times!");
                }
                else {
                    print("Great! You won! You have guessed $times times!");
                }
            }
            
            function createNumber(){
                if (array_key_exists("number", $_GET)){
                $number = $_GET["number"];
            } else{
                srand ((double) microtime() * 10000000);
                $number = rand(0, 100);
            }
            return $number;
            }
            
            function inputNumber(){
                print("Enter a number: ");
                if (array_key_exists("input", $_GET)){
                $input = $_GET["input"];
                
            ?>
            <input type="text" size="4" maxlength="5" name="input"value="<?php echo $_GET["input"];?>">
            <br> 
            <?php
            }else {
                
        ?>
            <input type="text" size="4" maxlength="5" name="input">
            <br> 
        <?php
            //$input = $_GET["input"];
            }
            //return $input;
          
//            if (array_key_exists("times", $_GET)){
//                $times = $_GET["times"];
//            }
//            else {
//                $times = 0;
//            }
            }
            $number = createNumber();
            
            print("number = $number");
            print("<br>");
        ?>
            
        <a align="right"><input type="submit" value="Submit">
        <br>
        <?php
        $input = inputNumber();
            if (!is_numeric($input)){
                print("You must enter a number!");
            } else{
                guess($number, $guessNumber, $times);
            }
        
        ?>
        </form>
    </body>
</html>