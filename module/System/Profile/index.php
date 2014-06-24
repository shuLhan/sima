<?php
require_once "../../init.php";

$fields = [
	"name"
,	"address"
,	"phone_1"
,	"phone_2"
,	"phone_3"
,	"fax"
,	"email"
,	"website"
];

Jaring::$_mod["db_table"]["name"]	= "_profile";
Jaring::$_mod["db_table"]["id"]		= ["name"];
Jaring::$_mod["db_table"]["read"]	= $fields;
Jaring::$_mod["db_table"]["order"]	= ["name"];
Jaring::$_mod["db_table"]["create"]	= $fields;
Jaring::$_mod["db_table"]["update"]	= $fields;

Jaring::handleRequest ("crud");
