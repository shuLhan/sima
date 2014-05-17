<?php
	$q	="
	insert into _group (
		pid
	,	name
	) values ( ?, ? )
	";

	$ps = Jaring::$_db->prepare ($q);
	$ps->execute (array (
			$data['pid']
		,	$data['name']
		));

	Jaring::$_out['success']	= true;
	Jaring::$_out['data']		= Jaring::$MSG_SUCCESS_CREATE;
