<html>
    <head><title>Distance and Time Calculations</title></head>
    <body>
        <?php
            $cities = array ('Dallas' => 803, 'Toronto' => 435, 'Boston' => 848,
                'Nashville => 406', 'Las Vegas' => 1526,
                'San Francisco' => 1835, 'Washington, DC' => 595,
                'Miami' => 1189, 'Pittsburgh' => 409);
            $destination = $_GET['destination'];
//            if (isset($cities[$destination])){
//                $distance = $cities[$destination];
//                $time = round( ($distance / 60), 2);
//                $walktime = round ( ($distance / 5), 2);
//                print "The distance between Chicago and <I>$destination</I> is $distance miles.";
//                print "<br>Driving at 60 miles per hour it would take $time hours.";
//                print "<br>Walking at 5 miles per hour it would take $walktime hours.";
//            }else {
//                print "Sorry, do not have destination information for $destination.";
//            }
            
            //multiple
            //if (isset($cities[$destination])){
            print "From Chicago to:<br>";
            
            ?>
        <table border="1">
            <tr>
                <td>No.</td>
                <td>Destination</td>
                <td>Distance</td>
                <td>Driving time</td>
                <td>Walking time</td>
            </tr>
        
        <?php
        $i = 1;
                foreach ($destination as $city){
                    ?>
            <tr>
                
            
            <?php 
                    //print "city : $city<br>";
                    if(isset($cities[$city])){
                        $distance = $cities[$city];
                        $time = round( ($distance / 60), 2);
                        $walktime = round ( ($distance / 5), 2);
                        
                        ?>
                <td><?php echo $i?></td>
                <td><?php echo $city?></td>
                <td><?php echo $distance?></td>
                <td><?php echo $time?></td>
                <td><?php echo $walktime?></td>
                <?php
//                        print "The distance between Chicago and <I>$city</I> is $distance miles.";
//                        print "<br>Driving at 60 miles per hour it would take $time hours.";
//                        print "<br>Walking at 5 miles per hour it would take $walktime hours.";
                    }else {
                        echo "<td>$i</td>";
                        echo "<td>$city</td>";
                        echo "<td>No information</td>";
//                        print "Sorry, do not have destination information for $destination.";
                    }
                    $i++;
                }
                ?>
            </tr>
            
            <?php
                //print "$cities[$destination]";
           // }
        ?>
            </table>
    </body>
</html>
