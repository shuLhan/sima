<?php
	$users = json_decode (file_get_contents('php://input'), true);

	$q	="	update	_user"
		."	set		name		= ?"
		."	,		realname	= ?"
		."	,		password	= ?"
		."	where	id			= ?";

	$ps = Jaring::$_db->prepare ($q);

	foreach ($users as $user) {
		$id = (int) $user['id'];

		if ($id <= 0) {
			throw new Exception ("Invalid user ID (". $id .") !");
		}

		$password = $user['password'];

		if (empty ($password)) {
			$password = $user['password_old'];
		} else {
			$password = hash ("sha256", $user['password']);
		}

		$i = 1;
		$ps->bindValue ($i++, $user['name'], PDO::PARAM_STR);
		$ps->bindValue ($i++, $user['realname'], PDO::PARAM_STR);
		$ps->bindValue ($i++, $password, PDO::PARAM_STR);
		$ps->bindValue ($i++, $id, PDO::PARAM_INT);

		$ps->execute ();

		$ps->closeCursor ();
	}

	Jaring::$_out['success']	= true;
	Jaring::$_out['data']		= Jaring::$MSG_SUCCESS_UPDATE;
