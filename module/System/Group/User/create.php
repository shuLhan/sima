<?php
require_once "../../../json_begin.php";

try {
	$uid = (int) $_POST['_user_id'];
	$gid = (int) $_POST['_group_id'];

	$q	="	insert into _user_group ("
		."		_group_id"
		."	,	_user_id"
		."	) values ( ? , ? )";
		
	$ps = Jaring::$_db->prepare ($q);
	$ps->bindValue (1, $gid, PDO::PARAM_INT);
	$ps->bindValue (2, $uid, PDO::PARAM_INT);
	$ps->execute ();

	$r['success']	= true;
	$r['data']		= Jaring::$MSG_SUCCESS_CREATE;

} catch (Exception $e) {
	$r['data']	= $e->getMessage ();
}

require_once "../../../json_end.php";
?>