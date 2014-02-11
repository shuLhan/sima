<?php
require_once "../../json_begin.php";

try {
	$q	="	update	_group"
		."	set		name		= ?"
		."	where	id			= ?";
		
	$ps = Jaring::$_db->prepare ($q);
	$ps->bindValue (1, $_POST['name'], PDO::PARAM_STR);
	$ps->bindValue (2, (int) $_POST['id'], PDO::PARAM_INT);
	$ps->execute ();

	$r['success']	= true;
	$r['data']		= Jaring::$MSG_SUCCESS_UPDATE;
} catch (Exception $e) {
	$r['data']	= $e->getMessage ();
}

require_once "../../json_end.php";
?>