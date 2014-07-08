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
,	"asset_status_id"
,	"cost"
,	"maintenance_date"
,	"maintenance_info"
];

Jaring::$_mod["db_table"]["name"]	= "asset_maintenance_log";
Jaring::$_mod["db_table"]["id"]		= ["id"];
Jaring::$_mod["db_table"]["read"]	= $fields;
Jaring::$_mod["db_table"]["search"]	= [
										"maintenance_info"
									];
Jaring::$_mod["db_table"]["create"]	= $fields;
Jaring::$_mod["db_table"]["update"]	= array_slice ($fields, 1);
Jaring::$_mod["db_table"]["order"]	= ["maintenance_date DESC"];
Jaring::$_mod["db_table"]["generate_id"] = "id";

Jaring::request_handle ("crud");
