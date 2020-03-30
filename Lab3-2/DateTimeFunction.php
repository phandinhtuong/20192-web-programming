<html>
    <head><title>Date Time Function</title></head>
    <body>
        <form>
            First person:<br>
            Name:
            <input type="text" name="firstName" size="15" maxlength="20">
            Birthday: (in type dd/MM/yyyy)
            <input type="text" name="firstBD" size="15" maxlength="20">
            <br>
            Second person:<br>
            Name:
            <input type="text" name="secondName" size="15" maxlength="20">
            Birthday: (in type dd/MM/yyyy)
            <input type="text" name="secondBD" size="15" maxlength="20">
            <br>
            <input type="submit" value="Submit" name="sub">
        </form>
        <form action="<?php echo $_SERVER['PHP_SELF']?>" method="GET">
            <?php
            function checkValidDate($date){
                if (strlen($date)==10){
                    
                    $delimiter1 = substr($date, 2, 1);
                    $delimiter2 = substr($date, 5, 1);
                    if ($delimiter1 == $delimiter2 && $delimiter1 == "/"){
                        $day = substr($date, 0, 2);
                        $month = substr($date, 3,2);
                        $year = substr($date, 6,4);
                        if (is_numeric($day) && is_numeric($month) && is_numeric($year)){
                            if (checkdate($month, $day, $year)) $valid = 1;
                            else $valid = 0;
//                            switch ($month){
//                                case 1 : case 3 : case 5 : case 7 : case 8 : case 10 : case 12 : 
//                                    $numberOfDays = 31;                        break;
//                                case 4 : case 6 : case 9 : case 11 :
//                                    $numberOfDays = 30;                        break;
//                                case 2 : {
//                                    if (($year%4 == 0 && $year%100!=0) || ($year%400==0)){
//                                        $numberOfDays = 29;
//                                    } else $numberOfDays = 28;
//                                }
//                                default : $numberOfDays = -1; break;
//                            }
//                            if ($day<1 || $day>31 || $day>$numberOfDays){
//                                $valid = 0;
//                            } else {
//                                $valid = 1;
//                            }
                        } else{
                            $valid = 0;
                        }
                    } else {
                        $valid = 0;
                    }
                }else {
                    $valid = 0;
                }
                return $valid;
            }
            function getDateInLetter($date){
                $day = substr($date, 0, 2);
                $month = substr($date, 3,2);
                $year = substr($date, 6,4);
                //strtot
                return date('d/m/Y' , strtotime($date));
            }
            
            
            
            if (isset($_GET['sub'])){
                if(!$_GET['firstName'] =="" && !$_GET['secondName'] =="" && !$_GET['firstBD'] =="" && !$_GET['secondBD'] ==""){
                    $firstBD = $_GET["firstBD"];
                    $secondBD = $_GET["secondBD"];
                    if (checkValidDate($firstBD) != 0 && checkValidDate($secondBD) != 0){
                        $firstBDinLetter = getDateInLetter($firstBD);
                        print "$firstBDinLetter";
                    } else {
                        print "Invalid date!";
                    }
                }else{
                    print"You didn't input all the fields!";
                }
            }
                
            ?>
        
        </form>
    </body>
</html>