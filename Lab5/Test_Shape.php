<?php
   
    //define autoload function
    function __autoload($class) {
        $filename = $class.".php";
        if(is_readable($filename)){
            require_once $filename;
        }
//    include("\\".ucfirst($class).".php");
    } 

    $myCollection = array();
    
    //make a rectangle
    $r = new Rectangle;
    $r->width = 5;
    $r->height = 7;
    $myCollection[] = $r;
    unset($r);
    
    //make a triangle
    $t = new Triangle;
    $t->base = 4;
    $t->height = 5;
    $myCollection[] = $t;
    unset($t);
    
    //make a circle
    $c = new Circle;
    $c->radius = 3;
    $myCollection[] = $c;
    unset($c);
    
    //make a color
    $c = new Color;
    $c->name = "blue";
    $myCollection[] = $c;
    unset($c);
    
    foreach($myCollection as $s)
    {
        if ($s instanceof Shape)
        {
            print("Area: ".$s->getArea()."<br>\n");
        }
        
        if ($s instanceof Polygon)
        {
            print("Sides: ".$s->getNumberOfSides()."<br>\n");
        }
        
        if ($s instanceof Color)
        {
            print("Color: $s->name<br>\n");
        }
        
        print("<br>\n");
    }
?>

