<?php
require_once "../../json_begin.php";

try {
	$users	= json_decode (file_get_contents('php://input'), true);
	$q		=" delete from _user where id = ?";
	$ps		= Jaring::$_db->prepare ($q);
	
	foreach ($users as $user) {
		$id = (int) $user['id'];
		
		if ($id < 0) {
			throw new Exception ("Invalid user ID (". $id .") !");
		}
		
		$ps->bindValue (1, $id, PDO::PARAM_INT);
		$ps->execute ();
		$ps->closeCursor ();
	}

	$r['success']	= true;
	$r['data']		= Jaring::$MSG_SUCCESS_DESTROY;
} catch (Exception $e) {
	$r['data']		= $e->getMessage ();
}

require_once "../../json_end.php";