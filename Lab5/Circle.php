<?php
    require_once "Shape.php";
    //concrete class
    class Circle extends Shape
    {
        public $radius;
        public function getArea() {
        return(pi() * $this->radius * $this->radius);
    }

}
?>
