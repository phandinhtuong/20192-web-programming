<html>
    <head>
        <title>
            <?php
            $doc_title = 'Business Listings';
            echo "$doc_title\n";
            ?>
        </title>
    </head>
    <body>
        <h1>
            <?= $doc_title ?>
        </h1>

        <?php
        // establish the database connection
        # parameters for connecting to the "business_service" 
        $username = "root";
        $password = "";
        $hostspec = "localhost";
        $database = "business_service";
        // $dbtype = 'pgsql';
        // $dbtype = 'oci8';
        $dbtype = 'mysqli';

        $pick_message = 'Click on a category to find business listings:';
        ?>

        <table border=0>
            <tr><td valign="top">
                    <table border=5>
                        <tr><td class="picklist"><strong><?= $pick_message ?></strong></td></tr>
                        <p>
                            <?php
                            // build the scrolling pick list for the categories
                            $connect = mysqli_connect($hostspec, $username, $password);
                            if (!$connect) {
                                die($connect->getMessage());
                            }
                            $sql = "SELECT * FROM categories";
                            mysqli_select_db($connect, $database);
                            $result = mysqli_query($connect, $sql);
                            if ($result) {
                                // print 'ok select';
                            } else {
                                print "Fail to $sql";
                            }

                            while ($row = mysqli_fetch_row($result)) {
                                echo '<tr><td class="formlabel">';
                                echo "<a href=\"biz_listing.php?cat_id=$row[0]\">";
                                echo "$row[1]</a></td></tr>\n";
                            }
                            $connect->close();
                            ?>
                    </table>
                </td>
                <td valign="top">
                    <table border=1>
                        <?php
                        if (isset($_GET['cat_id'])) {
                            $cat_id = $_GET['cat_id'];
                            $connect = mysqli_connect($hostspec, $username, $password);
                            if (!$connect) {
                                die($connect->getMessage());
                            }
                            //print "cat_id = $cat_id";
                            mysqli_select_db($connect, $database);
                            $sql = "SELECT * FROM businesses b, biz_categories bc where";
                            $sql .= " categoryid = '$cat_id'";
                            $sql .= " and b.businessid = bc.businessid";
                            $result = mysqli_query($connect, $sql);
                            
                            if ($result) {
                                // print 'ok select';
                            } else {
                                print "Fail to $sql";
                            }
                            while ($row = mysqli_fetch_row($result)) {
                                echo "<tr>\n";
                                for ($i = 0; $i < count($row); $i++) {
                                    echo "<td>$row[$i]</td>\n";
                                }
                                echo "</tr>\n";
                            }
                            $connect->close();
                        }
                        ?>
                    </table>
                </td></tr>
        </table>
    </body>
</html>
