<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
require_once "../../../init.php";

Jaring::$_mod["db_table"]["name"]		= "_user";
Jaring::$_mod["db_table"]["profiled"]	= false;
Jaring::$_mod["db_table"]["read"] 		=
[
	"_profile_id"
,	"id"
,	"name"
,	"realname"
];

Jaring::$_mod["db_rel"]["tables"]	=
	[
		"_user_group"
	,	"_group"
	];
Jaring::$_mod["db_rel"]["conditions"]	=
	[
		"_user.id				= _user_group._user_id"
	,	"_user_group._group_id	= _group.id"
	,	"_group.id				= 1"
	,	"_user.id not in ( select _user_id from _profile_admin )"
	];

Jaring::request_handle ("crud");
