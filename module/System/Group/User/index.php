<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
require_once "../../../init.php";

$fields =
	[
		"_profile_id"
	,	"id"
	,	"_user_id"
	,	"_group_id"
	];

Jaring::$_mod["db_table"]["name"]	= "_user_group";
Jaring::$_mod["db_table"]["read"]	= $fields;
Jaring::$_mod["db_table"]["update"]	= ["_user_id"];
Jaring::$_mod["db_table"]["create"]	= $fields;

Jaring::$_mod["db_rel"]["tables"]		= [ "_user" ];
Jaring::$_mod["db_rel"]["read"]			=
	[
		"_user.name		as _user_name"
	,	"_user.realname	as _user_realname"
	];

Jaring::$_mod["db_rel"]["conditions"]	=
	[
		"_user_group._user_id"	=> "_user.id"
	];

Jaring::$_mod["db_rel"]["search"]		=
	[
		"_user.name"
	,	"_user.realname"
	];

Jaring::$_mod["db_rel"]["order"]		= [ "_user.name" ];

function request_delete_before ($data)
{
	// do not delete user admin of profile.
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
