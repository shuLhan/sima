<?php
/*
	Copyright 2014 Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
require_once "../../../json_begin.php";

try {
	$pid	= $_GET["pid"];

	$q	="
		select	A.id
		,		A.label
		,		A.image
		,		A.description
		,		A.module
		,		B.permission
		from	_menu		A
		,		_group_menu	B
		,		_user_group	C
		where	A.type			in (2,3)
		and		A.id			= B._menu_id
		and		B._group_id		= C._group_id
		and		C._user_id		= ?
		and		A.pid			= ?
		and		C._profile_id	= ?
		";

	$ps = Jaring::$_db->prepare ($q);
	$ps->execute (array (Jaring::$_c_uid, $pid, Jaring::$_c_profile_id));
	$rs = $ps->fetchAll (PDO::FETCH_ASSOC);

	foreach ($rs as &$m) {
		$m["image_path"] = str_replace (" ", "-", (string) $m["image"]);
	}

	$r['success']	= true;
	$r['data']		= $rs;
	$r['total']		= count ($rs);
}
catch (Exception $e) {
	$r['data']		= $e->getMessage ();
}

require_once "../../../json_end.php";
