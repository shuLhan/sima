<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
require_once "../../../init.php";

Jaring::$_mod["db_table"]["name"]	= "asset_location";
Jaring::$_mod["db_table"]["id"]		= ["id"];
Jaring::$_mod["db_table"]["read"]	= ["id", "name"];
Jaring::$_mod["db_table"]["search"]	= ["name"];
Jaring::$_mod["db_table"]["create"]	= ["id", "name"];
Jaring::$_mod["db_table"]["update"]	= ["name"];
Jaring::$_mod["db_table"]["order"]	= ["name"];
Jaring::$_mod["db_table"]["generate_id"]	= "id";
Jaring::$_mod["db_table"]["profiled"]		= false;

Jaring::request_handle ("crud");
