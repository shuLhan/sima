<?php
require_once "../json_begin.php";

try {
	if ("update" !== $_GET['action']) {
		throw new Exception ("Invalid action '". $_GET['action'] ."'!");
	}

	$a = json_decode (file_get_contents('php://input'), true);

	$q	="	update	_user"
		."	set		password	= ?"
		."	where	id			= ?"
		."	and		password	= ?";

	$ps = Jaring::$_db->prepare ($q);

	foreach ($a as $user) {
		$ps->execute (array (
						hash ("sha256", $user["password_new"])
					,	$user["id"]
					,	hash ("sha256", $user["password_current"])
					)
				);
	}

	$r["success"]	= true;
	$r["data"]		= Jaring::$MSG_SUCCESS_UPDATE;
} catch (Exception $e) {
	$r['data']		= $e->getMessage ();
}

require_once "../json_end.php";
?>