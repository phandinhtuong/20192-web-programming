
<?php
require 'check_login.php';
$color = array('black' => '#000000','white' => '#ffffff','red'=>'#ff0000','blue'=>'#0000ff');



$bg_name = $_POST['background'];
$fg_name = $_POST['foreground'];

$bg = $color[$bg_name];
$fg = $color[$fg_name];

$_SESSION['bg'] = $bg;
$_SESSION['fg'] = $fg;
$username = $_SESSION['username'];
?>
<html>
    <head><title>Preferences Set</title></head>
    <body>
        Thank you.Your preferences have been changed to:<br/>
        Background: <?= $bg_name ?><br/>
        Foreground: <?= $fg_name ?><br/>
        
        Click <a href="prefs-demo-session.php">here</a> to see the preferences in action.
    </body>
</html>