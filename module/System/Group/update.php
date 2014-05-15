<?php
require_once "../../json_begin.php";

try {
	$q	="
	update	_group
	set		name		= ?
	,		pid			= ?
	where	id			= ?
	";
		
	$ps = Jaring::$_db->prepare ($q);
	$i	= 1;
	$ps->bindValue ($i++, $_POST['name'], PDO::PARAM_STR);
	$ps->bindValue ($i++, (int) $_POST['pid'], PDO::PARAM_INT);
	$ps->bindValue ($i++, (int) $_POST['id'], PDO::PARAM_INT);
	$ps->execute ();

	$r['success']	= true;
	$r['data']		= Jaring::$MSG_SUCCESS_UPDATE;
} catch (Exception $e) {
	$r['data']	= $e->getMessage ();
}

require_once "../../json_end.php";
?>
