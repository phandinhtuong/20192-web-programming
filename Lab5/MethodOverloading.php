<?php
    class Methodtest{
        public function __call($name, $arguments) {
            //value of $name is case sensitive;
            echo "Calling object method '$name'".implode(', ',$arguments)."<br>";
        }
        
        //as of php 5.3.0
        public static function __callStatic($name, $arguments) {
            //value of name is case sensitive;
            echo "Calling static method '$name'".implode(', ',$arguments). "<br>";
        }
    }
    
    $obj = new Methodtest();
    $obj->runTest('in object context');
    
    Methodtest::runTest('in static context'); // as of php 5.3.0
?>