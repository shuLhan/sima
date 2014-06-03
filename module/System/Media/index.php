<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

require_once "../../init.php";

$fields = [
			"id"
		,	"name"
		,	"extension"
		,	"size"
		,	"mime"
		,	"description"
		,	"path"
		];

Jaring::$_mod["db_table"]["name"]	= "_media";
Jaring::$_mod["db_table"]["id"]		= ["id"];
Jaring::$_mod["db_table"]["read"]	= $fields;
Jaring::$_mod["db_table"]["search"]	= ["name", "extension", "mime", "description"];
Jaring::$_mod["db_table"]["order"]	= ["id"];
Jaring::$_mod["db_table"]["create"]	= array_slice ($fields, 1);
Jaring::$_mod["db_table"]["update"]	= $fields;

function beforeRequestDelete ($data)
{
	foreach ($data as $d) {
		// delete file
		$q	=" select path "
			." from ". Jaring::$_mod["db_table"]["name"]
			." where id = ". $d['id'];

		$rs = Jaring::dbExecute ($q);

		if (count ($rs) > 0) {
			unlink (APP_PATH ."/". $rs[0]["path"]);
		}

		$q	="
			delete from _media_table
			where	_media_id = ". $d["id"];

		$rs = Jaring::dbExecute ($q);
	}
}

Jaring::handleRequest ("action");
