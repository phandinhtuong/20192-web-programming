<?php
//$linkTo = $_REQUEST["LinkTo"];
//$userName = $_POST["UserName"];
//$password = $_POST["Password"];

// if(isset($userName)){
if (isset($_POST["UserName"])) {
    $linkTo = $_REQUEST["LinkTo"];
    $userName = $_POST["UserName"];
    $password = $_POST["Password"];
    $host = 'localhost';
    $user = 'root';
    $passwd = '';
    $database = 'Lab12';
    $table_name = 'users';
    $query = "Select * from $table_name where username = '$userName' and password='$password'";
    $connect = mysqli_connect($host, $user, $passwd);

    if ($connect) {
        mysqli_select_db($connect,$database);
        $result = mysqli_query( $connect,$query);

        $row = mysqli_fetch_row($result);
        if ($result && $row) {
            if ($linkTo != "") {
                printf($linkTo);
                //header("Location: "+$linkTo);
            } else {
                header("Location: http://www.google.com/");
                exit();
            }
        }
    }
}
?>
<html>
    <head>
        <title>Member, please login</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <!--<link rel=""-->
        <script language="javascript">
            function fCommit() {
                if (document.frmLogin.UserName.value == "") {
                    alert("UserName must be entered!");
                    document.frmLogin.UserName.focus();
                    return false;
                }
                return true;
            }

            function fReset() {
                document.frmLogin.Username.value = "";
                document.frmLogin.Password.value = "";
                document.frmLogin.UserName.focus();
            }
        </script>
    </head>
    <body topmargin="0" leftmargin="0">
        <form method="POST" action="<?php echo $_SERVER["PHP_SELF"] ?>" name="frmLogin" onsubmit="return fCommit();">
            <table border="0" width="100%" height="100%" cellspacing="0" cellpadding="0">
                <tr valign="middle"><td align="center">
                        <table>
                            <tr>
                                <td><p class="reporttitle">LOGIN TO THE SYSTEM</p></td>
                            </tr>
                        </table>
                        <table class="forumline" width="280" border="0" cellspacing="1" cellpadding="2">
                            <tr class="formstyle"><td>
                                    <table width="100%" border="0" cellpadding="2" cellspacing="0">
                                        <tr class="formstyle">
                                            <td>Username: </td>
                                            <td>&nbsp;
                                                <input class="edit" type="text" name="UserName" value="<?php echo $userName ?>">
                                                <!--<input type="hidden" name="LinkTo" value="<?php // echo $linkTo ?>">-->
                                            </td>

                                        </tr>
                                        <tr class="formstyle">
                                            <td>Password:&nbsp; </td>
                                            <td>&nbsp;
                                                <input class="edit" type="password" name="Password">
                                            </td>
                                        </tr>
                                        <tr class="formstyle" height="30">
                                            <td>
                                                <input class="btn" type="submit" value="Login">
                                                <input class="btn" type="reset" onclick="fReset();">
                                                <!--<input type="hidden" name="LinkTo" value="<?php // echo $linkTo ?>"/>-->
                                            </td>
                                        </tr>

                                        <?php
                                        if (isset($user) && !$row) {
                                            echo '<tr align="center">
                                            <td colspan="2"><p class="error">Invalid name or password!</p></td>
                                        </tr>';
                                        }
//                                        mysqli_free_result($result);
//                                        mysqli_close($connect);
                                        ?>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </form>
        <script>
            document.frmLogin.UserName.focus();
        </script>
    </body>
</html>