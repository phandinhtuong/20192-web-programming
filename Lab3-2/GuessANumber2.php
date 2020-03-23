<html>
    <head><title>Guess A Number!</title></head>
    <body>
        <form action="<?php echo $_SERVER['PHP_SELF']?>" method="GET">
            <?php
            srand ((double) microtime() * 10000000);
            $number = rand(0, 100);
            print(" s number = $number");
                    
       
            ?>
            <input type="submit" value="Submit">
             
            <table>
                <tr>
                    <?php
           // $number = 2;
               // if (array_key_exists("number", $_GET)){
                   //     $number = $_GET["number"];
                        print("number = $number");
                        
                        $number2 = $number;
                        $number = $number - 1;
                        print("number = $number");
                        print("number2 = $number2");
                 //   }
            ?>
                </tr>
            
            
            
                </table>
        </form>
    </body>
</html>

