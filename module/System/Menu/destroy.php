<?php
require_once "../../json_begin.php";

try {
	$objs	= json_decode (file_get_contents('php://input'), true);
	$q_gm	=" delete from _group_menu where _menu_id = ? ";
	$q		=" delete from _menu where id = ?";

	$ps_gm	= Jaring::$_db->prepare ($q_gm);
	$ps		= Jaring::$_db->prepare ($q);

	foreach ($objs as $o) {
		$id = (int) $o['id'];

		if ($id < 0) {
			throw new Exception ("Invalid ID (". $id .") !");
		}

		$ps_gm->bindValue (1, $id, PDO::PARAM_INT);
		$ps_gm->execute ();
		$ps_gm->closeCursor ();

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
