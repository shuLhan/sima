<?php
require_once "../../init.php";

Jaring::$_mod["db_table"]["name"]	= "_group";
Jaring::$_mod["db_table"]["id"]		= ["id"];
Jaring::$_mod["db_table"]["create"]	= ["pid", "name"];
Jaring::$_mod["db_table"]["update"]	= ["pid", "name"];

Jaring::handleRequest ();
