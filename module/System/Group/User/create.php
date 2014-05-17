<?php
	$uid = (int) $data['_user_id'];
	$gid = (int) $data['_group_id'];

	$q	="	insert into _user_group ("
		."		_group_id"
		."	,	_user_id"
		."	) values ( ? , ? )";

	$ps = Jaring::$_db->prepare ($q);
	$ps->bindValue (1, $gid, PDO::PARAM_INT);
	$ps->bindValue (2, $uid, PDO::PARAM_INT);
	$ps->execute ();

	Jaring::$_out['success']	= true;
	Jaring::$_out['data']		= Jaring::$MSG_SUCCESS_CREATE;
