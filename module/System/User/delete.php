<?php
	$q		=" delete from _user where id = ?";
	$ps		= Jaring::$_db->prepare ($q);

	foreach ($data as $user) {
		$id = (int) $user['id'];

		if ($id < 0) {
			throw new Exception ("Invalid user ID (". $id .") !");
		}

		$ps->bindValue (1, $id, PDO::PARAM_INT);
		$ps->execute ();
		$ps->closeCursor ();
	}

	Jaring::$_out['success']	= true;
	Jaring::$_out['data']		= Jaring::$MSG_SUCCESS_DESTROY;
