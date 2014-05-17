<?php
	$uid = (int) $data['id'];

	$q	="	delete from	_user_group"
		."	where		id	= ?";

	$ps = Jaring::$_db->prepare ($q);
	$ps->bindValue (1, $uid, PDO::PARAM_INT);
	$ps->execute ();

	Jaring::$_out['success']	= true;
	Jaring::$_out['data']		= Jaring::$MSG_SUCCESS_DESTROY;
