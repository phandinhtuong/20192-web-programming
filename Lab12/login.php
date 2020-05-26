<?php
 $linkTo = $_REQUEST["LinkTo"];
 $userName = $_POST["UserName"];
 $password = $_POST["Password"];
 
 if(isset($userName)){
     $host = 'localhost';
     $user = 'root';
     $passwd = '';
     $database = 'Lab12';
     $table_name = 'users';
     $query = "Select * from $table_name where username = '$username' and password='$password'";
     $connect = mysql_connect($host,$user,$passwd);
     
     if ($connect){
         mysql_select_db($database);
         $result = mysql_query($query,$connect);
         
         $row = mysql_fetch_row($result);
         if ($result && $row){
             if ($linkTo != ""){
                 header("Location: ".$linkTo);
             } else {
                 header("Location: http://www.google.com/");
                 exit();
             }
         }
     }
 }
