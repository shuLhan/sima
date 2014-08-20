<?php
/*
	Copyright 2014 Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
require_once "init.php";

$i = 1;
$q = "";
$t = 0;
$r = array (
	'success'	=> false
,	'data'		=> ''
,	'total'		=> 0
);

try {
	Jaring::db_init ();
} catch (Exception $e) {
	$r['data'] = $e->getMessage ();

	echo json_encode ($r);

	die ();
}
