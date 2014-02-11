<?php
require_once "../../../json_begin.php";

try {
	$uid = (int) $_POST['id'];

	$q	="	delete from	_user_group"
		."	where		id	= ?";
		
	$ps = Jaring::$_db->prepare ($q);
	$ps->bindValue (1, $uid, PDO::PARAM_INT);
	$ps->execute ();

	$r['success']	= true;
	$r['data']		= Jaring::$MSG_SUCCESS_DESTROY;
} catch (Exception $e) {
	$r['data']	= $e->getMessage ();
}

require_once "../../../json_end.php";
?>