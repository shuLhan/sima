<?php
$q	="
		insert into asset_type (
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
