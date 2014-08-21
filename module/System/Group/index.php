<?php
/*
	Copyright 2014 Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
require_once "../../init.php";

Jaring::$_mod["db_table"]["name"]	= "_group";
Jaring::$_mod["db_table"]["create"]	= ["_profile_id", "id", "pid", "name"];
Jaring::$_mod["db_table"]["update"]	= ["pid", "name"];

function request_delete_before ($data)
{
	// Disallow user to delete group super admin
	foreach ($data as $d) {
		if ($d["id"] === "1") {
			throw new Exception (Jaring::$MSG_DATA_LOCK);
		}
	}

	// Delete group menu access
	$q = "delete from _group_menu where _group_id = ?";

	foreach ($data as $d) {
		$ps = Jaring::$_db->prepare ($q);
		$ps->execute (array ($d["id"]));
		$ps->closeCursor ();
	}

	return true;
}

Jaring::request_handle ("crud");
