<?php
require_once "../../init.php";

Jaring::$_mod["db_table"]["name"]	= "_user";
Jaring::$_mod["db_table"]["id"]		= ["id"];
Jaring::$_mod["db_table"]["read"]	= [
										"id"
									,	"name"
									,	"realname"
									,	"password as password_old"
									,	"'' as password"
									];
Jaring::$_mod["db_table"]["search"]	= ["name", "realname"];
Jaring::$_mod["db_table"]["order"]	= ["name"];

Jaring::handleRequest ();
