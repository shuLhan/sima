<?php
require_once "../../init.php";

Jaring::$_mod["db_table"]["name"]	= "_user";
Jaring::$_mod["db_table"]["id"]		= ["id"];
Jaring::$_mod["db_table"]["read"]	= [
										"id"
									,	"name"
									,	"realname"
									,	"password as password_old"
									,	"'' as password"
									];
Jaring::$_mod["db_table"]["search"]	= ["name", "realname"];
Jaring::$_mod["db_table"]["order"]	= ["name"];

function afterRequestRead ($data)
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

Jaring::handleRequest ("crud");
