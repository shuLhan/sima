<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
require_once "../../../init.php";

Jaring::$_mod["db_table"]["name"]		= "_user	U";
Jaring::$_mod["db_table"]["profiled"]	= false;
Jaring::$_mod["db_table"]["read"] 		=
[
	"U._profile_id"
,	"U.id"
,	"U.name"
,	"U.realname"
];

Jaring::request_handle ("crud");
