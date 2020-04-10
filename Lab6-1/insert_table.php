<html>
    <head><title>Insert Results</title></head>
    <body>
        <?php
        $Item = $_GET['Item'];
        $Cost = $_GET['Cost'];
        $Weight = $_GET['Weight'];
        $Quantity = $_GET['Quantity'];
        $server = 'localhost';
        $user = 'root';
        $pass = '';
        $mydb = 'sale';
        $table_name = 'Products';
        $connect = mysqli_connect($server, $user, $pass);
        if (!$connect) {
            die("Cannot connect to $server using $user");
        } else {
            $SQLcmd = "insert into $table_name values ('0','$Item','$Cost','$Weight','$Quantity')";
            print "The Query is <i>$SQLcmd</i><br>";
            mysqli_select_db($connect, $mydb);
            if (mysqli_query($connect, $SQLcmd)) {
                print '<font size="4" color="blue" >Insert into $mydb was successful!</font> ';
                
            } else {
                print '<font size="4" color="blue" >Insert into $mydb was failed!</font> ';
            }
            mysqli_close($connect);
        }
        ?>
    </body>
</html>