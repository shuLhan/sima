<?php
require_once "../../json_begin.php";

try {
	// Get total row
	$q	="	select		COUNT(id) as total"
		."	from		_user"
		."	where		(name		like ?"
		."	or			realname	like ?)";

	$ps = Jaring::$_db->prepare ($q);
	$ps->execute (array (
			"%". $_GET["query"] ."%"
		,	"%". $_GET["query"] ."%")
	);
	$rs = $ps->fetchAll (PDO::FETCH_ASSOC);
	$ps->closeCursor ();

	if (count ($rs) > 0) {
		$t = (int) $rs["total"];
	}

	// Get data
	$q	="	select		id"
		."	,			name"
		."	,			realname"
		."	,			password	as old_password"
		."	,			''			as password"
		."	from		_user"
		."	where		(name		like ?"
		."	or			realname	like ?)"
		."	order by	name"
		."	limit		". (int) $_GET["start"] .",". (int) $_GET["limit"];

	$ps = Jaring::$_db->prepare ($q);
	$ps->execute (array (
			"%". $_GET["query"] ."%"
		,	"%". $_GET["query"] ."%"
		)
	);
	$rs = $ps->fetchAll (PDO::FETCH_ASSOC);
	$ps->closeCursor ();

	$r = array (
		'success'	=> true
	,	'data'		=> $rs
	,	'total'		=> $t
	);
} catch (Exception $e) {
	$r['data']	= $e->getMessage ();
}

require_once "../../json_end.php";
?>