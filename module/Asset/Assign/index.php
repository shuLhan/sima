<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

require_once "../../init.php";

$fields	=
[
	"id"
,	"asset_id"
,	"cost"
,	"assign_date"
,	"_user_id"
,	"location_id"
,	"location_detail"
,	"description"
];

Jaring::$_mod["db_table"]["name"]	= "asset_assign_log";
Jaring::$_mod["db_table"]["id"]		= ["id"];
Jaring::$_mod["db_table"]["read"]	= $fields;
Jaring::$_mod["db_table"]["search"]	= [
										"location_detail"
									,	"description"
									];
Jaring::$_mod["db_table"]["create"]	= $fields;
Jaring::$_mod["db_table"]["update"]	= array_slice ($fields, 1);
Jaring::$_mod["db_table"]["order"]	= ["assign_date DESC"];
Jaring::$_mod["db_table"]["generate_id"] = "id";

Jaring::handleRequest ("crud");
