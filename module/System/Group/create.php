<?php
require_once "../../json_begin.php";

try {
	$q	="	insert into _group ("
		."		name"
		."	) values ( ? )";

	$ps = Jaring::$_db->prepare ($q);
	$ps->execute (array ($_POST['name']));

	$r['success']	= true;
	$r['data']		= Jaring::$MSG_SUCCESS_CREATE;
} catch (Exception $e) {
	$r['data']		= $e->getMessage ();
}

require_once "../../json_end.php";
?>