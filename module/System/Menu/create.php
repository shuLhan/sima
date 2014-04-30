<?php
require_once "../../json_begin.php";

try {
	$objs = json_decode (file_get_contents('php://input'), true);

	$q	="
		insert into _menu (
			id
		,	pid
		,	type
		,	label
		,	icon
		,	image
		,	module
		,	description
		) values ( ? , ? , ? , ? , ? , ? , ? , ? )
		";

	$ps = Jaring::$_db->prepare ($q);
		
	foreach ($objs as $o) {
		$ps->execute (array (
				$o['id']
			,	$o['pid']
			,	$o['type']
			,	$o['label']
			,	$o['icon']
			,	$o['image']
			,	$o['module']
			,	$o['description']
			));
		$ps->closeCursor ();
	}

	$r['success']	= true;
	$r['data']		= Jaring::$MSG_SUCCESS_CREATE;
} catch (Exception $e) {
	$r['data']		= $e->getMessage ();
}

require_once "../../json_end.php";
