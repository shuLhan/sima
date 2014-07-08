<?php
require_once "../../init.php";

$fields	= [
	"id"
,	"name"
,	"realname"
,	"password"
];

Jaring::$_mod["db_table"]["name"]	= "_user";
Jaring::$_mod["db_table"]["id"]		= ["id"];
Jaring::$_mod["db_table"]["read"]	= [
										"id"
									,	"name"
									,	"realname"
									,	"password as password_old"
									,	"'' as password"
									];
Jaring::$_mod["db_table"]["create"]	= $fields;
Jaring::$_mod["db_table"]["update"]	= array_slice ($fields, 1);
Jaring::$_mod["db_table"]["search"]	= ["name", "realname"];
Jaring::$_mod["db_table"]["order"]	= ["name"];
Jaring::$_mod["db_table"]["generate_id"] = "id";

function request_read_after ($data)
{
	$q ="
		select	G.name
		from	_group		G
		,		_user_group	UG
		where	UG._group_id	= G.id
		and		UG._user_id		= ?
	";

	Jaring::$_db_ps = Jaring::$_db->prepare ($q);

	foreach ($data as &$d) {
		$bindv = [];

		array_push ($bindv, $d["id"]);

		Jaring::$_db_ps->execute ($bindv);

		$rs = Jaring::$_db_ps->fetchAll (PDO::FETCH_COLUMN, 0);

		Jaring::$_db_ps->closeCursor ();

		$d["group_name"] = implode (",", $rs);

		unset ($bindv);
	}

	Jaring::$_out["data"] = $data;
}

function request_create_before (&$data)
{
	foreach ($data as &$d) {
		$d["password"] = hash ("sha256", $d["password"]);
	}
}

function request_update_before (&$data)
{
	foreach ($data as &$d) {
		if (empty ($d["password"])) {
			$d["password"] = $d['password_old'];
		} else {
			$d["password"] = hash ("sha256", $d['password']);
		}
	}
}

Jaring::request_handle ("crud");
