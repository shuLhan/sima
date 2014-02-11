<?php
require_once "../init.php";

$exp = time() - 3600;

setcookie (Jaring::$_name .".user.id"	, "", $exp, Jaring::$_path);
setcookie (Jaring::$_name .".user.name"	, "", $exp, Jaring::$_path);

header ("Location:". Jaring::$_path);
die ();
?>