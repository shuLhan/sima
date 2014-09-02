<?php
/*
	Copyright 2014 Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
require_once "../init.php";

$exp = time() - 3600;

setcookie ("user_id"	, "", $exp, Jaring::$_path);
setcookie ("user_name"	, "", $exp, Jaring::$_path);
setcookie ("profile_id"	, "", $exp, Jaring::$_path);

header ("Location:". Jaring::$_path);
exit ();
