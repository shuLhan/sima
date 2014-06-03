<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

require_once "../../../init.php";

$fields = [
			"MT.table_name"
		,	"MT.table_id"
		,	"MT._media_id"
		,	"M.name"
		,	"M.extension"
		,	"M.size"
		,	"M.mime"
		,	"M.description"
		,	"M.path"
		];

Jaring::$_mod["db_table"]["name"]		= ["_media M", "_media_table MT"];
Jaring::$_mod["db_table"]["id"]			= array_slice ($fields, 0, 3);
Jaring::$_mod["db_table"]["read"]		= $fields;
Jaring::$_mod["db_table"]["relation"]	= [["M.id","MT._media_id"]];
Jaring::$_mod["db_table"]["search"]		= ["M.name", "M.extension", "M.mime", "M.description"];
Jaring::$_mod["db_table"]["order"]		= ["MT._media_id"];
Jaring::$_mod["db_table"]["create"]		= array_slice ($fields, 0, 3);
Jaring::$_mod["db_table"]["update"]		= $fields;

Jaring::handleRequest ();
