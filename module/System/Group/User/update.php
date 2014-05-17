<?php
	$q	="	update	_user_group"
		."	set		_user_id	= ?"
		."	where	id			= ?";

	$ps = Jaring::$_db->prepare ($q);
	$ps->bindValue (1, (int) $data['_user_id'], PDO::PARAM_INT);
	$ps->bindValue (2, (int) $data['id'], PDO::PARAM_STR);
	$ps->execute ();

	Jaring::$_out['success']	= true;
	Jaring::$_out['data']		= Jaring::$MSG_SUCCESS_UPDATE;
