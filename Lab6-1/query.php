<html>
    <head><title>Table Outputs</title></head>
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
            $SQLcmd = "select * from $table_name";
            print '<font size="5" color="blue">';
            print "$table_name Data</font><br>";
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
                 die ("Query=$query failed!"); 
            }
            mysqli_close($connect);
        }
        ?></table>
    </body>
</html>