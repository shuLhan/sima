<?php
$q	="
		insert into ". Jaring::$_mod["db_table"] ." (
			name
		) values ( ? )
	";

$ps = Jaring::$_db->prepare ($q);

foreach ($data as $d) {
	$ps->execute (array (
			$d['name']
		)
	);
	$ps->closeCursor ();
}

Jaring::$_out['success']	= true;
Jaring::$_out['data']		= Jaring::$MSG_SUCCESS_CREATE;
