<html>
    <head><title>User Sorting</title></head>
    <body>
        <?php
            function user_sort($a, $b) {
                // smarts is all-important, so sort it first
                if($b == 'smarts') {
                    return 1;
                }
                else if($a == 'smarts') {
                    return -1;
                }
                return ($a == $b) ? 0 : (($a < $b) ? -1 : 1);
            }
            
            $values = array('name' => 'Buzz Lightyear', 'email_address' => 'buzz@starcommand.gal', 'age' => 32, 'smarts' => 'some');
            $original = $values;
            if (array_key_exists("submitted", $_POST)){
            $submitted = $_POST["submitted"];
            $sort_type = $_POST["sort_type"];
            if($submitted) {
                if($sort_type == 'usort' || $sort_type == 'uksort' || $sort_type == 'uasort') {
                    $sort_type($values, 'user_sort');
                }
                else {
                    $sort_type($values);
                }
            }
            }
        ?>

        <form action="UserSorting.php" method="post">
        <p>
        <table>
            <td> 
                <input type="radio" name="sort_type" value="sort" checked="checked"/>Standard sort<br/>
                <input type="radio" name="sort_type" value="rsort"/>Reverse sort<br/>
                <input type="radio" name="sort_type" value="usort"/>User-defined sort<br/>
            </td>
            <td>
                <input type="radio" name="sort_type" value="ksort"/>Key sort<br/>
                <input type="radio" name="sort_type" value="krsort"/>Reverse key sort<br/>
            </td>
            <td>
                <input type="radio" name="sort_type" value="uksort"/>User-defined key sort<br/>
                <input type="radio" name="sort_type" value="asort"/>Value sort<br/>
            </td>
            <td>
                <input type="radio" name="sort_type" value="arsort"/>Reverse value sort<br/>
                <input type="radio" name="sort_type" value="uasort"/>User-defined value sort<br/>
            </td>
        </table>
        </p>

        <p align="center">
        <input type="submit" value="Sort" name="submitted" />
        </p>
        <table> 
            <td>
            <p>
            Values unsorted:
            </p>
            <ul>
        <?php
            foreach($original as $key=>$value) {
            echo "<li><b>$key</b>: $value</li>";
            }
        ?>
            </ul>
            </td>
            <td>
        <?php
        if (array_key_exists("submitted", $_POST)){
        ?>
            <p>
            Values sorted by <?="$sort_type"?>:
            </p>

            <ul>
        <?php
            foreach($values as $key=>$value) {
            echo "<li><b>$key</b>: $value</li>";
            }
        ?>
            </ul>
        <?php
        }
        ?>
            </td>
        </table>
        </form>
    </body>
</html>