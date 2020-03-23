<html>
    <head><title>Date Time Processing</title></head>
    <body>
        <form action="<?php echo $_SERVER['PHP_SELF'] ?>" method="GET">
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
                    <input type="text" size="20" maxlength="30" name="name" value="<?php echo $_GET["name"];?>">
                    <?php
                } else {
                    ?>
                    <input type="text" size="20" maxlength="30" name="name">
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
                                $day = "<option selected>$i</option>";
                        }
                    ?>
                    </select>
                </td>
                <td><select name="month">
                    <?php
                            for ($i=0; $i<=12;$i++){ 
                                
                        }
                    ?>
                    </select>
                </td>
                <td><select name="year">
                    <?php
                            for ($i=1950; $i<=2050;$i++){
                
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
                
                        }
                    ?>
                    </select>
                </td>
                <td><select name="minute">
                    <?php
                            for ($i=0; $i<=59;$i++){ 
                
                        }
                    ?>
                    </select>
                </td>
                <td><select name="second">
                    <?php
                            for ($i=0; $i<=59;$i++){
                
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
            if (array_key_exists("name", $_GET)){
                print("Hi $name!");
            }
            print"<br>";
            if (array_key_exists("day", $_GET)){
                print("day = $day");
            }
            
        ?>
        </form>
    </body>
</html>