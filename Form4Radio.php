<html>
    <head> <title> A Simple Form </title> </head>
    <body>
        <form action="Form4Radio.php" method="POST">
            <br>
            Enter email address: <input type="text" size="30" maxlength="50" name ="email">
            <br></br>
            May we contact you?
            <input type="radio" name="contact" value="Yes">
            <input type="radio" name="contact" value="No">
             <br></br>
             <input type="submit" value ="Click To Submit">
             <input type="reset" value ="Erase and Restart">
        </form>
    </body>
</html>