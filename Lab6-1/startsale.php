<html>
    <head><title>Table Outputs</title></head>
    <body>
        <font size="5" color="blue">Select Product We Just Sold:</font><br>
        <form action="sale.php" method="get">
            Hammer: <input type="radio" name="Product" value="Hammer"><br>
            Screwdriver: <input type="radio" name="Product" value="Screwdriver"><br>
            Wrench: <input type="radio" name="Product"value="Wrench"><br>
            <input type="submit" value="Click to submit">
            <input type="reset" value="Reset">
        </form>
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
            $SQLcmd = "select * from $table_name";
            print "The Query is <i>$SQLcmd</i><br>";
            mysqli_select_db($connect, $mydb);
            $results_id = mysqli_query($connect, $SQLcmd);
            if ($results_id) {
                print '<table border=1>';
                print '<th>Num<th>Product<th>Cost<th>Weight<th>Count';
                while ($row = mysqli_fetch_row($results_id)) {
                    print '<tr>';
                    foreach ($row as $field) {
                        print "<td>$field</td> ";
                    }
                    print '</tr>';
                }
            } else {
                die("Query=$query failed!");
            }
            mysqli_close($connect);
        }
        ?></table>
</body>
</html>