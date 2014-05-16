<?php
	$users = json_decode (file_get_contents('php://input'), true);

	$q	="	insert into _user ("
		."		name"
		."	,	realname"
		."	,	password"
		."	) values ( ? , ? , ? )";

	$ps = Jaring::$_db->prepare ($q);

	foreach ($users as $user) {
		$ps->execute (array (
				$user['name']
			,	$user['realname']
			,	hash ("sha256", $user['password'])
			)
		);
		$ps->closeCursor ();
	}

	Jaring::$_out['success']	= true;
	Jaring::$_out['data']		= Jaring::$MSG_SUCCESS_CREATE;
