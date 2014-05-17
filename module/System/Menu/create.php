<?php
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

	foreach ($data as $o) {
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

	Jaring::$_out['success']	= true;
	Jaring::$_out['data']		= Jaring::$MSG_SUCCESS_CREATE;
