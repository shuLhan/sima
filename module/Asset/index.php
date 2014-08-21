<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

require_once "../init.php";

$fields = [
	"id"
,	"type_id"
,	"merk"
,	"model"
,	"sn"
,	"barcode"
,	"service_tag"
,	"label"
,	"detail"
,	"warranty_length"
,	"warranty_info"
,	"procurement_id"
,	"procurement_date"
,	"procurement_company"
,	"procurement_price"
,	"table_id"
];

Jaring::$_mod["db_table"]["name"]	= "asset";
Jaring::$_mod["db_table"]["id"]		= ["id"];
Jaring::$_mod["db_table"]["read"]	= $fields;
Jaring::$_mod["db_table"]["search"]	= [
	"merk"
,	"model"
,	"sn"
,	"barcode"
,	"service_tag"
,	"label"
,	"detail"
,	"procurement_company"
];
Jaring::$_mod["db_table"]["create"]	= $fields;
Jaring::$_mod["db_table"]["update"]	= array_slice ($fields, 1);
Jaring::$_mod["db_table"]["order"]	= ["id"];
Jaring::$_mod["db_table"]["generate_id"]	= "id";
Jaring::$_mod["db_table"]["profiled"]		= false;

//{{{ generate uniq barcode for each data.
function request_create_before (&$data)
{
	foreach ($data as &$d) {
		$d["barcode"] = uniqid ();
	}
}
//}}}

//{{{ assign current user as the owner.
function request_create_after ($data)
{
	$uid = Jaring::$_c_uid;
	$q = "
		insert into asset_assign_log (
			id
		,	asset_id
		,	_user_id
		,	assign_date
		) values (
			?
		,	?
		,	$uid
		,	NOW()
		)
	";

	Jaring::$_db_ps = Jaring::$_db->prepare ($q);

	foreach ($data as $v) {
		$bindv = [];

		$bindv[0] = Jaring::db_generate_id ();
		$bindv[1] = $v["id"];

		Jaring::$_db_ps->execute ($bindv);
		Jaring::$_db_ps->closeCursor ();

		unset ($bindv);
	}
}
//}}}

function request_delete_before ($data)
{
	foreach ($data as $k => $v) {
		// delete all media files.
		$q	="	select	M.path
				from	_media			M
				,		_media_table	MT
				where	M.id		= MT._media_id
				and		MT.table_id	= '". $v["table_id"] ."'
			";

		$rs = Jaring::db_execute ($q);

		foreach ($rs as $media) {
			$f = APP_PATH ."/". $media["path"];

			if (file_exists ($f)) {
				unlink ($f);
			}
		}

		// delete data from media.
		$q	="	delete from _media
				where	id in
				(
					select	_media_id
					from	_media_table
					where	table_id = '". $v["table_id"] ."'
				)
			";

		Jaring::db_execute ($q, null, false);

		// delete data from _media_table.
		$bindv		= [];
		$bindv[]	= $v["table_id"];

		$table		= "_media_table";
		$fids		= ["table_id"];

		Jaring::db_prepare_delete ($table, $fids);
		Jaring::$_db_ps->execute ($bindv);
		Jaring::$_db_ps->closeCursor ();

		// delete assignment log.
		$q = "delete from asset_assign_log where asset_id = ". $v["id"];

		Jaring::db_execute ($q, null, false);

		// delete maintenance log.
		$q = "delete from asset_maintenance_log where asset_id = ". $v["id"];

		Jaring::db_execute ($q, null, false);
	}
}

Jaring::request_handle ("crud");
