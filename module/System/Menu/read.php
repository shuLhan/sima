<?php
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

	$ps = Jaring::$_db->prepare($q);
	$ps->execute ();
	$rs = $ps->fetchAll (PDO::FETCH_ASSOC);
	$ps->closeCursor ();

	Jaring::$_out["success"]	= true;
	Jaring::$_out["data"]		= $rs;
