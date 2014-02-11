<?php
require_once "../../json_begin.php";

try {
	$q	="	select		COUNT(id) as total"
		."	from		_group"
		."	where		name like ?";

	$ps = Jaring::$_db->prepare ($q);
	$ps->execute (array (
			"%". $_GET["query"] ."%"
		)
	);
	$rs = $ps->fetchAll (PDO::FETCH_ASSOC);
	$ps->closeCursor ();

	if (count ($rs) > 0) {
		$t = (int) $rs["total"];
	}

	// Get data
	$q	="	select		id"
		."	,			name"
		."	from		_group"
		."	where		name like ?"
		."	order by	name"
		."	limit		". (int) $_GET["start"] .",". (int) $_GET["limit"];

	$ps = Jaring::$_db->prepare ($q);
	$ps->execute (array (
			"%". $_GET["query"] ."%"
		)
	);
	$rs = $ps->fetchAll (PDO::FETCH_ASSOC);

	$r['success']	= true;
	$r['data']		= $rs;
	$r['total']		= $t;
} catch (Exception $e) {
	$r['data']	= $e->getMessage ();
}

require_once "../../json_end.php";
?>