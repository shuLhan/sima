<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

require_once "../init.php";

function asset_assign ($data)
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
		,	?
		)
	";

	Jaring::$_db_ps = Jaring::$_db->prepare ($q);

	foreach ($data as $v) {
		$bindv = [];

		$i = 0;
		$bindv[$i++] = Jaring::db_generate_id () + mt_rand ();
		$bindv[$i++] = $v[0];
		$bindv[$i++] = date ("Y-m-d");

		Jaring::$_db_ps->execute ($bindv);
		Jaring::$_db_ps->closeCursor ();

		unset ($bindv);
	}
}


$table = "asset";

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
];

Jaring::db_init ();

Jaring::db_prepare_insert ($table, $fields);

$import_file	= $_FILES["import_file"]["tmp_name"];
$nchunk			= 1000;

$f		= fopen ($import_file, "r");
$data	= [];
$c		= 0;

while (! feof ($f)) {
	$row = fgetcsv ($f);

	if (FALSE === $row) {
		break;
	}
	if (0 === $c) {
		// skip first row
		$c++;
		continue;
	}

	// set id
	array_unshift ($row, Jaring::db_generate_id () + mt_rand ());

	// set barcode if empty
	if ($row[5] === "") {
		$row[5] = uniqid ();
	}

	$data[] = $row;
	$c++;

	// insert per $nchunk row
	if (0 === ($c % $nchunk)) {
		Jaring::$_db->beginTransaction ();
		foreach ($data as $d) {
			Jaring::$_db->execute ($d);
			Jaring::$_db->closeCursor ();
		}
		asset_assign ($data);
		Jaring::$_db->commit ();

		unset ($data);
	}
}

if (count ($data) > 0) {
	Jaring::$_db->beginTransaction ();
	foreach ($data as $d) {
		Jaring::$_db_ps->execute ($d);
		Jaring::$_db_ps->closeCursor ();
	}
	asset_assign ($data);
	Jaring::$_db->commit ();
}

fclose ($f);

Jaring::$_out["success"]	= true;
Jaring::$_out["data"]		= "File has been imported.";

echo json_encode (Jaring::$_out);
