<html>
    <head><title>Radian Degree Converter</title></head>
    <body>
        <?php
            function degreeToRadian($d){
                $r = $d * (pi() / 180);
                return $r;
            }
            
            function radianToDegree($r){
                $d = $r * (180 / pi());
                return $d;
            }
            
            
        ?>
        <h3>Radian Degree Converter</h3>
        <br>
        Input a number: <input type="text" name="input"><br>
        <input type="radio" name="converter" value="degree">Degree to Radian</>
        <input type="radio" name="converter" value="radian">Radian to Degree</>
        <br>
        <input type="submit" name="Convert">
        
    </body>
</html>
