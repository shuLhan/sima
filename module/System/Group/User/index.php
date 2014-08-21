<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
require_once "../../../init.php";

Jaring::$_mod["db_table"]["name"]	= "_user_group";
Jaring::$_mod["db_table"]["create"]	= ["_profile_id", "id", "_group_id", "_user_id"];
Jaring::$_mod["db_table"]["update"]	= ["_user_id"];

function request_delete_before ($data)
{
	foreach ($data as $d) {
		$ug_id = $d["id"];

		$q = "
			select	count(PA._user_id) as n
			from	_profile_admin	PA
			,		_user_group		UG
			where	PA._user_id		= UG._user_id
			and		UG.id			= $ug_id
			";

		$rs = Jaring::db_execute ($q, null);

		if ((int) $rs[0]["n"] > 0) {
			throw new Exception (Jaring::$MSG_ADMIN_PROFILE);
		}
	}
}

Jaring::request_handle ("crud");
