<?php
$q	="
	insert into ". Jaring::$_mod["db_table"] ." (
		name
	) values ( ? )
	";

$ps = Jaring::$_db->prepare ($q);

foreach ($data as $d) {
	$i = 1;
	$ps->bindValue ($i++, $d["name"], PDO::PARAM_STR);
	$ps->execute ();
	$ps->closeCursor ();
}

Jaring::$_out['success']	= true;
Jaring::$_out['data']		= Jaring::$MSG_SUCCESS_CREATE;
