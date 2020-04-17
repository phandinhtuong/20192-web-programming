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

        require_once('db_login.php');

        $pick_message = 'Click on a category to find business listings:';
        $PHP_SELF = &$_SERVER['PHP_SELF'];
        ?>

        <table border=0>
            <tr><td valign="top">
                    <table border=5>
                        <tr><td class="picklist"><strong><?= $pick_message ?></strong></td></tr>
                        <p>
                            <?php
                            // build the scrolling pick list for the categories
                            $sql = "SELECT * FROM categories";
                            $result = $db->query($sql);
                            if (DB::isError($result))
                                die($result->getMessage());
                            while ($row = $result->fetchRow()) {
                                if (DB::isError($row))
                                    die($row->getMessage());
                                echo '<tr><td class="formlabel">';
                                echo "<a href=\"$PHP_SELF?cat_id=$row[0]\">";
                                //echo "<a href=\"<?php echo \$_SERVER['PHP_SELF'] . '?cat_id=$row[0]\">";
                                echo "$row[1]</a></td></tr>\n";
                            }
                            ?>
                    </table>
                </td>
                <td valign="top">
                    <table border=1>
                        <?php
                        if (isset($_GET['cat_id'])) {
                            
                        
                            $cat_id = $_GET['cat_id'];
                        if ($cat_id) {
                            $sql = "SELECT * FROM businesses b, biz_categories bc where";
                            $sql .= " categoryid = '$cat_id'";
                            $sql .= " and b.businessid = bc.businessid";
                            $result = $db->query($sql);
                            if (DB::isError($result))
                                die($result->getMessage());
                            while ($row = $result->fetchRow()) {
                                if (DB::isError($row))
                                    die($row->getMessage());
                                echo "<tr>\n";
                                for ($i = 0; $i < count($row); $i++) {
                                   // echo "<td class=\"$bg_shade\">$row[$i]</td>\n";
                                    echo "<td>$row[$i]</td>\n";
                                    
                                }
                                echo "</tr>\n";
                            }
                        }}
                        ?>
                    </table>
                </td></tr>
        </table>
    </body>
</html>
