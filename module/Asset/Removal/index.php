<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

require_once "../../init.php";

$fields	=
[
	"type_id"
,	"merk"
,	"model"
,	"barcode"
,	"asset_id"
,	"asset_removal_id"
,	"removal_date"
,	"removal_cost"
,	"removal_info"
];

Jaring::$_mod["db_table"]["name"]	= "asset_removal_log";
Jaring::$_mod["db_table"]["id"]		= ["asset_id"];
Jaring::$_mod["db_table"]["read"]	= $fields;
Jaring::$_mod["db_table"]["search"]	= [
										"barcode"
									,	"merk"
									,	"model"
									,	"removal_info"
									];
Jaring::$_mod["db_table"]["create"]	= array_slice ($fields, 4);
Jaring::$_mod["db_table"]["update"]	= array_slice ($fields, 4);
Jaring::$_mod["db_table"]["order"]	= ["removal_date DESC"];
Jaring::$_mod["db_table"]["profiled"]	= false;

function request_create_after ($data)
{
	$q = "update asset set status = 0 where id = ?";

	Jaring::$_db_ps = Jaring::$_db->prepare ($q);

	foreach ($data as $d) {
		$bindv = [];

		array_push ($bindv, $d["asset_id"]);

		Jaring::$_db_ps->execute ($bindv);
		Jaring::$_db_ps->closeCursor ();

		unset ($bindv);
	}
}

function request_delete_after ($data)
{
	$q = "update asset set status = 1 where id = ?";

	Jaring::$_db_ps = Jaring::$_db->prepare ($q);

	foreach ($data as $d) {
		$bindv = [];

		array_push ($bindv, $d["asset_id"]);

		Jaring::$_db_ps->execute ($bindv);
		Jaring::$_db_ps->closeCursor ();

		unset ($bindv);
	}
}

Jaring::request_handle ("crud");
