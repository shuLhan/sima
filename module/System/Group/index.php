<?php
/*
	Copyright 2014 Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
require_once "../../init.php";

Jaring::$_mod["db_table"]["name"]	= "_group";
Jaring::$_mod["db_table"]["id"]		= ["id"];
Jaring::$_mod["db_table"]["create"]	= ["id", "pid", "name"];
Jaring::$_mod["db_table"]["update"]	= ["pid", "name"];
Jaring::$_mod["db_table"]["generate_id"] = "id";

Jaring::request_handle ("crud");
