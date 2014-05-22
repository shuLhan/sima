<?php
require_once "../../init.php";

$fields = [
			"id"
		,	"pid"
		,	"type"
		,	"label"
		,	"icon"
		,	"image"
		,	"module"
		,	"description"
		];

Jaring::$_mod["db_table"]["name"]	= "_menu";
Jaring::$_mod["db_table"]["id"]		= ["id"];
Jaring::$_mod["db_table"]["read"]	= $fields;
Jaring::$_mod["db_table"]["search"]	= ["label", "module", "description"];
Jaring::$_mod["db_table"]["order"]	= ["id", "pid"];
Jaring::$_mod["db_table"]["create"]	= $fields;
Jaring::$_mod["db_table"]["update"]	= $fields;


Jaring::handleRequest ();
