<?php
/*
	Copyright 2014 Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
$no_cookies = true;
require_once "../../../init.php";

Jaring::db_init ();

$q = "select logo_type, logo from _profile";

Jaring::$_db_ps = Jaring::$_db->prepare ($q);

Jaring::$_db_ps->execute ();

Jaring::$_db_ps->bindColumn (1, $type, PDO::PARAM_STR);
Jaring::$_db_ps->bindColumn (2, $lob, PDO::PARAM_LOB);
Jaring::$_db_ps->fetch (PDO::FETCH_BOUND);

header ("Content-Type: $type");
echo $lob;
