<?php
	$q_gm	=" delete from _group_menu where _menu_id = ? ";
	$q		=" delete from _menu where id = ?";

	$ps_gm	= Jaring::$_db->prepare ($q_gm);
	$ps		= Jaring::$_db->prepare ($q);

	foreach ($data as $o) {
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

	Jaring::$_out['success']	= true;
	Jaring::$_out['data']		= Jaring::$MSG_SUCCESS_DESTROY;
