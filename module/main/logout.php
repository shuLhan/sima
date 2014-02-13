<?php
require_once "../init.php";

$exp = time() - 3600;

setcookie ("user.id"	, "", $exp, Jaring::$_path);
setcookie ("user.name"	, "", $exp, Jaring::$_path);

header ("Location:". Jaring::$_path);
die ();
?>