<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

require_once "../../init.php";

$fields = [
			"_profile_id"
		,	"id"
		,	"name"
		,	"extension"
		,	"size"
		,	"mime"
		,	"description"
		,	"path"
		];

Jaring::$_mod["db_table"]["name"]	= "_media";
Jaring::$_mod["db_table"]["read"]	= $fields;
Jaring::$_mod["db_table"]["search"]	= ["name", "extension", "mime", "description"];
Jaring::$_mod["db_table"]["order"]	= ["id"];
Jaring::$_mod["db_table"]["create"]	= $fields;
Jaring::$_mod["db_table"]["update"]	= array_slice ($fields, 2);

//{{{ before delete request executed
function request_delete_before ($data)
{
	foreach ($data as $d) {
		// delete file
		$q	="	select path
				from ". Jaring::$_mod["db_table"]["name"] ."
				where id = ". $d["id"];

		$rs = Jaring::db_execute ($q);

		if (count ($rs) > 0) {
			$f = APP_PATH . $rs[0]["path"];
			if (file_exists ($f)) {
				unlink ($f);
			}
		}

		// delete link to media table.
		$q	= "delete from _media_table where _media_id = ". $d["id"];

		Jaring::db_execute ($q, null, false);
	}

	return true;
}
//}}}

Jaring::request_handle ("action");
