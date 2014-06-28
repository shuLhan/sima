<?php
	$q	="	insert into _user ("
		."		id"
		."	,	name"
		."	,	realname"
		."	,	password"
		."	) values ( ? , ? , ? , ? )";

	$ps = Jaring::$_db->prepare ($q);

	foreach ($data as $user) {
		$ps->execute (array (
				Jaring::generate_id ()
			,	$user['name']
			,	$user['realname']
			,	hash ("sha256", $user['password'])
			)
		);
		$ps->closeCursor ();
	}

	Jaring::$_out['success']	= true;
	Jaring::$_out['data']		= Jaring::$MSG_SUCCESS_CREATE;
