<html>
    <head><title>Product Update Results</title></head>
    <body>
        <?php
        function Show_all($connect, $database, $table_name) {
                $query = "SELECT * from $table_name";
                $results_id = mysqli_query($connect,$query);
                print '<table border=1><th> Num </th><th>Product</th><th>Cost</th><th>Weight</th><th>Count</th>';
                while ($row = mysqli_fetch_row($results_id)) {
                    print '<tr>';
                    foreach ($row as $field) {
                        print "<td>$field</td> ";
                    }
                    print '</tr>';
                }
                print'</table>';
            }
        $Product = $_GET['Product'];
        $server = 'localhost';
        $user = 'root';
        $pass = '';
        $mydb = 'sale';
        $table_name = 'Products';
        $connect = mysqli_connect($server, $user, $pass);
        if (!$connect) {
            die("Cannot connect to $server using $user");
        } else {
            $SQLcmd = "update $table_name set Numb = Numb-1 where (Product_desc = '$Product')";
            print '<font size="5" color="blue">';
            print "Update Results for Table $table_name</font><br>\n";
            print "The Query is <i>$SQLcmd</i><br><br>";
            mysqli_select_db($connect, $mydb);
            $results_id = mysqli_query($connect, $SQLcmd);
            if ($results_id) {
                Show_all($connect, $mydb, $table_name);
            } else {
                die("Update=$query failed!");
            }
            mysqli_close($connect);
        }
        ?>
    </body>
</html>