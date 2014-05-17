<?php
	$q	="
	update	_group
	set		name		= ?
	,		pid			= ?
	where	id			= ?
	";

	$ps = Jaring::$_db->prepare ($q);
	$i	= 1;
	$ps->bindValue ($i++, $data['name'], PDO::PARAM_STR);
	$ps->bindValue ($i++, (int) $data['pid'], PDO::PARAM_INT);
	$ps->bindValue ($i++, (int) $data['id'], PDO::PARAM_INT);
	$ps->execute ();

	Jaring::$_out['success']	= true;
	Jaring::$_out['data']		= Jaring::$MSG_SUCCESS_UPDATE;
