<?php
require_once "../../json_begin.php";

try {
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

		$i = 1;
		$ps->bindValue ($i++, $user['name'], PDO::PARAM_STR);
		$ps->bindValue ($i++, $user['realname'], PDO::PARAM_STR);
		$ps->bindValue ($i++, hash ("sha256", $user['password']), PDO::PARAM_STR);
		$ps->bindValue ($i++, $id, PDO::PARAM_INT);

		$ps->execute ();

		$ps->closeCursor ();
	}

	$r['success']	= true;
	$r['data']		= Jaring::$MSG_SUCCESS_UPDATE;
} catch (Exception $e) {
	$r['data']	= $e->getMessage ();
}

require_once "../../json_end.php";