<?php
require_once "../../../init.php";

Jaring::$_mod["db_table"]["name"]	= "asset_type";
Jaring::$_mod["db_table"]["id"]		= ["id"];
Jaring::$_mod["db_table"]["read"]	= ["id", "name"];
Jaring::$_mod["db_table"]["search"]	= ["name"];
Jaring::$_mod["db_table"]["create"]	= ["name"];
Jaring::$_mod["db_table"]["update"]	= ["name"];
Jaring::$_mod["db_table"]["order"]	= ["name"];

Jaring::handleRequest ();
