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
                //print "$date $day $month $year";
                //strtot
                return date('l, F d, Y' , mktime(0,0,0,$month,$day,$year));
            }
            function getDaysBetweenDates($date1, $date2){
                $day1 = substr($date1, 0, 2);
                $month1 = substr($date1, 3,2);
                $year1 = substr($date1, 6,4);
                
                $day2 = substr($date2, 0, 2);
                $month2 = substr($date2, 3,2);
                $year2 = substr($date2, 6,4);
                //print date(DATE_ATOM, mktime(0,0,0,$month1,$day1,$year1));
                $date1inTime = strtotime(date(DATE_ATOM, mktime(0,0,0,$month1,$day1,$year1)));
                $date2inTime = strtotime(date(DATE_ATOM, mktime(0,0,0,$month2,$day2,$year2)));
                //print"<br>";
                //print "date 1 in time = $date1inTime";
                
                $datediff = $date1inTime - $date2inTime;
                $datediff = abs($datediff);
                 
                $datediff = round($datediff / (60 * 60 * 24));
                //print "datediff = $datediff";
                return $datediff;
            }
            function age($date){
                $year = substr($date, 6,4);
                $currentYear = date("Y");
                return $currentYear - $year;
            }
            
            
            
            if (isset($_GET['sub'])){
                if(!$_GET['firstName'] =="" && !$_GET['secondName'] =="" && !$_GET['firstBD'] =="" && !$_GET['secondBD'] ==""){
                    $firstName = $_GET["firstName"];
                    $secondName = $_GET["secondName"];
                    $firstBD = $_GET["firstBD"];
                    $secondBD = $_GET["secondBD"];
                    if (checkValidDate($firstBD) != 0 && checkValidDate($secondBD) != 0){
                        $firstBDinLetter = getDateInLetter($firstBD);
                        print "$firstName's birthday: $firstBD.<br>";
                        print "$firstName's birthday in letter: $firstBDinLetter.<br>";
                        $secondBDinLetter = getDateInLetter($secondBD);
                        print "$secondName's birthday: $secondBD.<br>";
                        print "$secondName's birthday in letter: $secondBDinLetter.<br>";
                        
                        $datediff = getDaysBetweenDates($firstBD, $secondBD);
                        print "The difference in days between two dates: $datediff days.<br>";
                        $age1 = age($firstBD);
                        $age2 = age($secondBD);
                        print "$firstName is $age1 years old and $secondName is $age2 years old.<br>";
                        $yeardiff = $age1 - $age2;
                        $yeardiff = abs($yeardiff);
                        print "The difference years between $firstName and $secondName is $yeardiff.";
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