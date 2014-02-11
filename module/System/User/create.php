<?php
require_once "../../json_begin.php";

try {
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

	$r['success']	= true;
	$r['data']		= Jaring::$MSG_SUCCESS_CREATE;
} catch (Exception $e) {
	$r['data']		= $e->getMessage ();
}

require_once "../../json_end.php";
?>