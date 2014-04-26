<?php
require_once "../../json_begin.php";

$q	="
	select		A.id
	,			A.pid
	,			A.type
	,			A.label
	,			A.icon
	,			A.image
	,			A.module
	,			A.description
	from		_menu		A
	order by	A.id
	,			A.pid
";

try {
	$ps = Jaring::$_db->prepare($q);
	$ps->execute ();
	$rs = $ps->fetchAll (PDO::FETCH_ASSOC);
	$ps->closeCursor ();

	$r["success"]	= true;
	$r["data"]		= $rs;
} catch (Exception $e) {
	$r["data"]		= $e->getMessage ();
}

require_once "../../json_end.php";
