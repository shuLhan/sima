<?php
/*
	Copyright 2014 Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
require_once "../../init.php";

$fields = [
			"_profile_id"
		,	"id"
		,	"pid"
		,	"type"
		,	"label"
		,	"icon"
		,	"image"
		,	"module"
		,	"description"
		];

Jaring::$_mod["db_table"]["name"]	= "_menu";
Jaring::$_mod["db_table"]["read"]	= $fields;
Jaring::$_mod["db_table"]["search"]	= ["label", "module", "description"];
Jaring::$_mod["db_table"]["order"]	= ["id", "pid"];
Jaring::$_mod["db_table"]["create"]	= $fields;
Jaring::$_mod["db_table"]["update"]	= $fields;

Jaring::$_mod["db_table"]["generate_id"]	= null;

// delete menu linked in group-menu
function request_delete_before ($data)
{
	foreach ($data as $d) {
		if ($d["_profile_id"] === 1) {
			throw new Exception (Jaring::$MSG_DATA_LOCK);
		}
	}

	$q	=" delete from _group_menu where _menu_id = ? ";
	$ps	= Jaring::$_db->prepare ($q);

	foreach ($data as $d) {
		$ps->bindValue (1, $d["id"], PDO::PARAM_INT);
		$ps->execute ();
		$ps->closeCursor ();
	}

	return true;
}

Jaring::request_handle ("crud");
