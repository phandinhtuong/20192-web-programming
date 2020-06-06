<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <script type="text/javascript">
            function validateRegister(){
                if (validateUsername()==true&&validateEmail()==true&&validatePhoneNumber()==true){
                    alert("Valid Info");
                    return true;
                } else {
                    
                }
            }
            function validateUsername(){
                var username = document.getElementById('username').value;
                var usernameCheck = new RegExp("^(?!\s*$).+");
                if (usernameCheck.test(username)){
                    //alert("Valid Postal Code");
                    return true;
                } else {
                    alert("Invalid username: "+username);
                    return false;
                }
            }
            function validateEmail(){
                var email = document.getElementById('email').value;
                var emailCheck = new RegExp("^[A-Za-z0-9_]+@[A-Za-z0-9.]+\.[A-Za-z]{2,}$");
                if (emailCheck.test(email)){
                    //alert("Valid Postal Code");
                    return true;
                } else {
                    alert("Invalid email: "+email);
                    return false;
                }
            }
            function validatePhoneNumber(){
                var phone = document.getElementById('phone').value;
                var phoneCheck = new RegExp("^[0|+84]+[0-9]{9}$");
                if (phoneCheck.test(phone)){
                    //alert("Valid Postal Code");
                    return true;
                } else {
                    alert("Invalid phone: "+phone);
                    return false;
                }
            }
           
        </script>
    </head>
    <body>
        <form id="myForm">
            Username: <input type="text" id="username"><br>
            Email: <input type="text" id="email"><br>
            Phone Number: <input type="text" id="phone"><br>
            <input type="button" value="Check Info" onclick="validateRegister()">
        </form>
    </body>
</html>
