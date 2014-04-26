<?php
require_once "../../json_begin.php";

try {
	$objs = json_decode (file_get_contents('php://input'), true);

	$q	="
		update	_menu
		set		id			= ?
		,		pid			= ?
		,		type		= ?
		,		label		= ?
		,		icon		= ?
		,		image		= ?
		,		description	= ?
		where	id			= ?
";

	$ps = Jaring::$_db->prepare ($q);

	foreach ($objs as $o) {
		$id = (int) $o['id'];

		if ($id <= 0) {
			throw new Exception ("Invalid menu ID (". $id .") !");
		}

		$i = 1;
		$ps->bindValue ($i++, $o['id'], PDO::PARAM_INT);
		$ps->bindValue ($i++, $o['pid'], PDO::PARAM_INT);
		$ps->bindValue ($i++, $o['type'], PDO::PARAM_INT);
		$ps->bindValue ($i++, $o['label'], PDO::PARAM_STR);
		$ps->bindValue ($i++, $o['icon'], PDO::PARAM_STR);
		$ps->bindValue ($i++, $o['image'], PDO::PARAM_STR);
		$ps->bindValue ($i++, $o['description'], PDO::PARAM_STR);
		$ps->bindValue ($i++, $o['id'], PDO::PARAM_INT);

		$ps->execute ();

		$ps->closeCursor ();
	}

	$r['success']	= true;
	$r['data']		= Jaring::$MSG_SUCCESS_UPDATE;
} catch (Exception $e) {
	$r['data']	= $e->getMessage ();
}

require_once "../../json_end.php";
