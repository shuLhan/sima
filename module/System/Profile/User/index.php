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
	"_user._profile_id"
,	"_user.id"
,	"_user.name"
,	"_user.realname"
];
Jaring::$_mod["db_table"]["order"] 		= ["id"];

Jaring::$_mod["db_rel"]["tables"]		=
[
	"_user_group"
,	"_group"
];

Jaring::$_mod["db_rel"]["conditions"]	=
[
	"_user.id"				=> "_user_group.id"
,	"_user_group._group_id"	=> "_group.id"
,	"_group.id"				=> "1"
];

Jaring::request_handle ("crud");
