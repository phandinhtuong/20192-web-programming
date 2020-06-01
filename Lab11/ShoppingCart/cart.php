<?php
session_start();
if (isset($_POST['remove'])) {
    if (!isset($_SESSION['productCart'])) {
        $productCart = [];
        $_SESSION['productCart'] = $productCart;
    } else {
        $productCart = $_SESSION['productCart'];
        $_SESSION['productCart'] = $productCart;
    }
//    echo $_POST['arrayIndex'];
    unset($productCart[$_POST['arrayIndex']]);
    $_SESSION['productCart'] = $productCart;
} else {
    $product = $_POST['product'];
    if (!isset($_SESSION['productCart'])) {
        $productCart = [];
        array_push($productCart, $product);
        $_SESSION['productCart'] = $productCart;
    } else {
        $productCart = $_SESSION['productCart'];
        array_push($productCart, $product);
        $_SESSION['productCart'] = $productCart;
    }
}

//print $product;


foreach ($productCart as $key => $value) {
    echo $key . ':' . $value;
    ?>
    <form action="<?php echo $_SERVER['PHP_SELF'] ?>" method="POST">
        <input type="hidden" name="arrayIndex" value="<?php echo $key ?>">
        <input type="submit" name="remove" value="remove" />
    </form>

    <?php
    //echo '<br>';
}
?>
<form action="chooseProducts.html" method='post'>
    <input type="submit" value="choose other products">
</form>
