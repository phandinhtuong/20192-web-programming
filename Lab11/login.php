<html>
    <head><title>Login</title></head>
    <body>
        <?php
        //session_destroy();
        if (isset($_POST['logout'])) {
            session_start();
            session_destroy();
        }
        //session_destroy();
        session_start();
        if (isset($_POST['username'])) {
            $username = $_POST['username'];
            $password = $_POST['password'];
            if (checkValidLogin($username, $password) == 1) {
                print('Welcome!');
                //session_start();
                $_SESSION['username'] = $username;
                ?>
                <form action="<?php echo $_SERVER['PHP_SELF'] ?>" method="POST">
                    <input type="hidden" name="logout" value="1">
                    <input type="submit" value="Log out">
                </form>

                <?php
            } else {
                echo "<font color ='red'>Invalid username or password!<font/>";
            }
        } else {
            //session_destroy();
        }
        if (!isset($_SESSION['username'])) {
            ?>
            <form action="<?php echo $_SERVER['PHP_SELF'] ?>" method="POST">
                Username: <input type="text" name="username"><br/>
                Password: <input type="password" name="password"><br/>
                <input type="submit" value="Log in">
            </form>
            <?php
        }
        ?>
    </body>
</html>

<?php
function checkValidLogin($username, $password) {
    require_once 'DB.php';
# parameters for connecting to the "business_service" 
    $usernameDB = "root";
    $passwordDB = "";
    $hostspec = "localhost";
    $database = "lab12";
// $dbtype = 'pgsql';
// $dbtype = 'oci8';
    $dbtype = 'mysqli';

# DSN constructed from parameters 
    $dsn = "$dbtype://$usernameDB:$passwordDB@$hostspec/$database";

# Establish the connection
    $db = DB::connect($dsn);
    if (DB::isError($db)) {
        die($db->getMessage());
    }

    //$sql = "select * from user where username = '$username' and password = '$hash256Password';"; // SQL Injection by ' or 1=1;#
    $sql = 'select * from users where username = ? and password = ?';
//    print("<br>");
//    print($sql);
//    print("<br>");
    //$result = $db->query($sql);
    $data = array($username, $password);
    //$data = $username;
    $result = & $db->query($sql, $data);
//    while ($row = $result->fetchRow()) {
//        for ($i = 0; $i < count($row); $i++)
//            print( "$row[$i]<br>");
//    }
    $row = $result->fetchRow();

    if (!is_null($row)) {
        //  print("OK");
        return 1;
    } else {
        // print("NO");
        return 0;
    }
}
?>