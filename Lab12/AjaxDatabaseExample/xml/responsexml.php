<?php
header('Content-Type: text/xml');
header("Cache-Control: no-cache, must-revalidate");
//A date in the past
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
$q=$_GET["q"];
$con = mysqli_connect('localhost', 'root', '', 'ajax');
if (!$con) {
    die('Could not connect: ' . mysqli_error());
}

mysqli_select_db($con, 'ajax');

$sql = "SELECT * FROM user WHERE id = '" . $q . "'";

$result = mysqli_query($con, $sql);
echo '<?xml version="1.0" encoding="ISO-8859-1"?>
<person>';
while($row = mysqli_fetch_array($result))
 {
 echo "<firstname>" . $row['firstname'] . "</firstname>";
 echo "<lastname>" . $row['lastname'] . "</lastname>";
 echo "<age>" . $row['age'] . "</age>";
 echo "<hometown>" . $row['hometown'] . "</hometown>";
 echo "<job>" . $row['job'] . "</job>";
 }
echo "</person>";
mysqli_close($con);
?>