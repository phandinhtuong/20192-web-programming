<html>
    <head>
        <title>
            <?php
            $doc_title = 'Business Registration';
            echo "$doc_title\n";
            ?>
        </title>
    </head>
    <body>
        <h1>
            <?= $doc_title ?>
        </h1>

        <?php
        # parameters for connecting to the "business_service" 
        $username = "root";
        $password = "";
        $hostspec = "localhost";
        $database = "business_service";
        // $dbtype = 'pgsql';
        // $dbtype = 'oci8';
        $dbtype = 'mysqli';

       
        $pick_message = 'Click on one, or control-click on<BR>multiple ';
        $pick_message .= 'categories:';
        //$add_record = 0;
        if (isset($_GET['add_record'])) {

            // fetch query parameters
            $add_record = $_GET['add_record'];
            $Biz_Name = $_REQUEST['Biz_Name'];
            $Biz_Address = $_REQUEST['Biz_Address'];
            $Biz_City = $_REQUEST['Biz_City'];
            $Biz_Telephone = $_REQUEST['Biz_Telephone'];
            $Biz_URL = $_REQUEST['Biz_URL'];

            // add new business
            if ($add_record == 1) {
                $Biz_Categories = $_REQUEST['Biz_Categories'];
                $pick_message = 'Selected category values<br />are highlighted:';
                $sql = 'INSERT INTO businesses (name, address, city, telephone, ';

                $sql .= " url) VALUES ('$Biz_Name', '$Biz_Address', '$Biz_City', '$Biz_Telephone', '$Biz_URL')";
                $connect = mysqli_connect($hostspec, $username, $password);
                if (!$connect) {
                    die($connect->getMessage());
                }

                mysqli_select_db($connect, $database);
                $result = mysqli_query($connect, $sql);

                echo '<p class="message">Record inserted as shown below.</p>';
                //$biz_id = $db->getOne('SELECT max(business_id) FROM businesses');
//                $biz_id = $result->m
                mysqli_select_db($connect, $database);
                $result = mysqli_query($connect, "select max(businessid) from businesses");
                $row = mysqli_fetch_row($result);
                $biz_id = $row[0];
                $connect->close();
            }
        }else{
            $Biz_Name = '';
            $Biz_Address = '';
            $Biz_City = '';
            $Biz_Telephone = '';
            $Biz_URL = '';
        }
        ?>

        <form method="get" action="<?php echo $_SERVER['PHP_SELF'] ?>">
            <table>
                <tr>
                    <td class="picklist"><?= $pick_message?>
                        <p>
                            <select name="Biz_Categories[]" size="5" multiple>
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
                                    print 'ok select';
                                } else {
                                    print 'Fail to select';
                                }
                                while ($row = mysqli_fetch_row($result)) {
                                    if ($add_record == 1) {
                                        $selected = false;
                                        // if this category was selected, add a new biz_categories row
                                        
                                        if (in_array($row[1], $Biz_Categories)) {
                                            
                                            $sql = 'INSERT INTO biz_categories';
                                            $sql .= ' (businessid, categoryid)';

                                            $sql .= " VALUES ('$biz_id', '$row[0]')";
                                            mysqli_select_db($connect, $database);
                                            $result1 = mysqli_query($connect, $sql);

                                            echo "<option selected=\"selected\">$row[1]</option>\n";
                                            
                                            $selected = true;
                                        }
                                        if ($selected == false) {
                                       // else {
                                            echo "<option>$row[1]</option>\n";
                                        }
                                    } else {
                                        echo "<option>$row[1]</option>\n";
                                    }
                                    //  echo "<option>$row[1]</option>\n";
                                }
                                $connect->close();
                                ?>

                            </select>
                        </p>
                    </td>
                    <td class="picklist">
                        <table>
                            <tr><td class="FormLabel">Business Name:</td>
                                <td><input type="text" name="Biz_Name" size="40" maxlength="255" value="<?=$Biz_Name?>"  /></td>
                            </tr>
                            <tr><td class="FormLabel">Address:</td>
                                <td><input type="text" name="Biz_Address" size="40" maxlength="255" value="<?= $Biz_Address ?>" /></td>
                            </tr>
                            <tr><td class="FormLabel">City:</td>
                                <td><input type="text" name="Biz_City" size="40" maxlength="128"  value="<?= $Biz_City ?>" /></td>
                            </tr>
                            <tr><td class="FormLabel">Telephone:</td>
                                <td><input type="text" name="Biz_Telephone" size="40" maxlength="64" value="<?= $Biz_Telephone ?>" /></td>
                            </tr>
                            <tr><td class="FormLabel">URL:</TD>
                                <td><input type="text" name="Biz_URL" size="40" maxlength="255" value="<?= $Biz_URL ?>" /></td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <p>
                <input type="hidden" name="add_record" value="1" />

                <?php
                // display the submit button on new forms; link to a fresh registration
                // page on confirmations
                if (isset($_GET['add_record'])) {


                    if ($add_record == 1) {
                        echo '<p><a href="add_biz.php">Add Another Business</a></p>';
                    }
                } else {
                    echo '<input type="submit" name="submit" value="Add Business" />';
                }
                ?>

            </p>
        </form>
    </body>
</html>
