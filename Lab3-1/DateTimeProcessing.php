<html>
    <head><title>Date Time Processing</title></head>
    <body>
        <form action="<?php echo $_SERVER['PHP_SELF'] ?>" method="GET">
            <?php
                if (array_key_exists("day", $_GET)){
                    $day = $_GET["day"];
                } else {
                    $day = 0;
                }
                if (array_key_exists("month", $_GET)){
                    $month = $_GET["month"];
                } else {
                    $month = 0;
                }
                if (array_key_exists("year", $_GET)){
                    $year = $_GET["year"];
                } else {
                    $year = 0;
                }
                if (array_key_exists("hour", $_GET)){
                    $hour = $_GET["hour"];
                } else {
                    $hour = 0;
                }
                if (array_key_exists("minute", $_GET)){
                    $minute = $_GET["minute"];
                } else {
                    $minute = 0;
                }
                if (array_key_exists("second", $_GET)){
                    $second = $_GET["second"];
                } else {
                    $second = 0;
                }
                
            ?>
        Enter your name and select date and time for the appointment
        <br><br>
        <table>
            <tr>
                <td>
                    Your name: 
                </td>
                <td colspan="3">
                    <?php
                if (array_key_exists("name", $_GET)){
                    $name = $_GET["name"];
                    ?>
                    <input type="text" size="15" maxlength="20" name="name" value="<?php echo $_GET["name"];?>">
                    <?php
                } else {
                    ?>
                    <input type="text" size="15" maxlength="20" name="name">
                    <?php
                }
                ?>
                    
                </td>
            </tr>
            <tr>
                <td>
                    Date:
                </td>
                <td><select name="day">
                    <?php
                            for ($i=0; $i<=31;$i++){ 
                                if ($day==$i){
                                    print("<option selected>$i</option>");
                                } else {
                                    print "<option>$i</option>";
                                }  
                        }
                    ?>
                    </select>
                </td>
                <td><select name="month">
                    <?php
                            for ($i=0; $i<=12;$i++){ 
                                if ($month==$i){
                                    print("<option selected>$i</option>");
                                } else {
                                    print "<option>$i</option>";
                                }  
                        }
                    ?>
                    </select>
                </td>
                <td><select name="year">
                    <?php
                            for ($i=1950; $i<=2050;$i++){
                                if ($year==$i){
                                    print("<option selected>$i</option>");
                                } else {
                                    print "<option>$i</option>";
                                }
                        }
                    ?>
                    </select>
                </td>
            </tr>
            <tr>
                <td>
                    Time:
                </td>
                <td><select name="hour">
                    <?php
                            for ($i=0; $i<=23;$i++){ 
                                if ($hour==$i){
                                    print("<option selected>$i</option>");
                                } else {
                                    print "<option>$i</option>";
                                }                
                        }
                    ?>
                    </select>
                </td>
                <td><select name="minute">
                    <?php
                            for ($i=0; $i<=59;$i++){ 
                                if ($minute==$i){
                                    print("<option selected>$i</option>");
                                } else {
                                    print "<option>$i</option>";
                                }                
                        }
                    ?>
                    </select>
                </td>
                <td><select name="second">
                    <?php
                            for ($i=0; $i<=59;$i++){
                                if ($second==$i){
                                    print("<option selected>$i</option>");
                                } else {
                                    print "<option>$i</option>";
                                }                
                        }
                    ?>
                    </select>
                </td>
            </tr>
            <tr>
                    <td align="right"><input type="submit" value="Submit"></td>
                    <td align="left"><input type="reset" value="Reset"></td>
                </tr>
        </table>
        <?php
            $check = 2;
            if (array_key_exists("name", $_GET)){
                if ($name != ""){
                    print("Hi $name!");
                print"<br>";
                }else {
                    print("Please enter your name!");
                    $check = 0;
            }
                
            } 
            if (array_key_exists("day", $_GET) && $check != 0){
                if ($day != 0){
                    //print("day = $day");
                    $check = 1;
                } else {
                    print("You must select a day!");
                    $check = 0;
                }
            }
            if (array_key_exists("month", $_GET) && $check != 0){
                if ($month != 0){
                    //print("month = $month");
                    $check = 1;
                } else {
                    print("You must select a month!");
                    $check = 0;
                }
            }
            if (array_key_exists("year", $_GET) && $check != 0){
                //print("year = $year");
            }
            if (array_key_exists("hour", $_GET) && $check != 0){
//                if ($hour != 0){
//                   // print("hour = $hour");
//                    $check = 1;
//                } else {
//                    print("You must select an hour!");
//                    $check = 0;
//                }
            }
            if (array_key_exists("minute", $_GET) && $check != 0){
                if ($minute != 0){
                   // print("minute = $minute");
                    $check = 1;
                } else {
                    print("You must select a minute!");
                    $check = 0;
                }
            }
            if (array_key_exists("second", $_GET) && $check != 0){
                if ($second != 0){
                  //  print("second = $second");
                    $check = 1;
                } else {
                    print("You must select a second!");
                    $check = 0;
                }
            }
            if ($check == 1){
                print("You have choosen to have an appointment on ");
                if ($hour < 10){
                    print("0");
                }
                print("$hour:");
                if ($minute < 10){
                    print("0");
                }
                print("$minute:");
                if ($second < 10){
                    print("0");
                }
                print("$second, ");
                if ($day < 10){
                    print("0");
                }
                print("$day/");
                if ($month < 10){
                    print("0");
                }
                print("$month/$year.");
                
                print("<br><br>");
                print("More information");
                print("<br><br>");
                print("In 12 hour, the time and date is ");
                if ($hour == 0){
                    $hour = 12;
                    $am = "AM";
                }else if ($hour == 12){
                    $am = "PM";
                }else if ($hour > 12){
                    $hour = $hour - 12;
                    $am = "PM";
                } else {
                    $am = "AM";
                }
                if ($hour < 10){
                    print("0");
                }
                print("$hour:");
                if ($minute < 10){
                    print("0");
                }
                print("$minute:");
                if ($second < 10){
                    print("0");
                }
                print("$second $am, ");
                if ($day < 10){
                    print("0");
                }
                print("$day/");
                if ($month < 10){
                    print("0");
                }
                print("$month/$year.");
                print("<br><br>");
                switch ($month){
                    case 1 : case 3 : case 5 : case 7 : case 8 : case 10 : case 12 : 
                        $numberOfDays = 31;                        break;
                    case 4 : case 6 : case 9 : case 11 :
                        $numberOfDays = 30;                        break;
                    case 2 : {
                        if (($year%4 == 0 && $year%100!=0) || ($year%400==0)){
                            $numberOfDays = 29;
                        } else $numberOfDays = 28;
                    }
                default : break;
                }
                print("This month has $numberOfDays days!");
            }
            
        ?>
        </form>
    </body>
</html>