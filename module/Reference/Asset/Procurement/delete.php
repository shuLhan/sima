<?php
$q		=" delete from ". Jaring::$_mod["db_table"] ." where id = ?";
$ps		= Jaring::$_db->prepare ($q);

foreach ($data as $d) {
	$id = (int) $d['id'];

	if ($id < 0) {
		throw new Exception ("Invalid ID (". $id .") !");
	}

	$i	= 1;
	$ps->bindValue ($i++, $id, PDO::PARAM_INT);
	$ps->execute ();
	$ps->closeCursor ();
}

Jaring::$_out['success']	= true;
Jaring::$_out['data']		= Jaring::$MSG_SUCCESS_DESTROY;
