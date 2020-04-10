<html>
    <head><title>Drop Table</title></head>
    <body>
        <?php
        $server = 'localhost';
        $user = 'root';
        $pass = '';
        $mydb = 'sale';
        $table_name = 'Products';
        $connect = mysqli_connect($server, $user, $pass);
        if (!$connect) {
            die("Cannot connect to $server using $user");
        } else {
            $SQLcmd = "drop TABLE $table_name";
            mysqli_select_db($connect, $mydb);
            if (mysqli_query($connect, $SQLcmd)) {
                print '<font size="4" color="blue" >Dropped Table ';
                print "<i>$table_name</i> in database <i>$mydb</i><br></font>";
                print "<br>SQLcmd=$SQLcmd";
            } else {
                die("Drop Failed SQLcmd = $SQLcmd");
            }
            mysqli_close($connect);
        }
        ?>
    </body>
</html> 
