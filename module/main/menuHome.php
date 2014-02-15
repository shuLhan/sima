<?php
require_once "../json_begin.php";

try {
	$q	="	select	A.id"
		."	,		A.label"
		."	,		A.image"
		."	,		A.module"
		."	,		A.description"
		."	,		B.permission"
		."	from	_menu		A"
		."	,		_group_menu	B"
		."	,		_user_group	C"
		."	where	A.type		in (2,3)"
		."	and		A.id		= B._menu_id"
		."	and		B._group_id	= C._group_id"
		."	and		C._user_id	= ?";
		
	$ps = Jaring::$_db->prepare ($q);
	$ps->execute (array (Jaring::$_c_uid));
	$rs = $ps->fetchAll (PDO::FETCH_ASSOC);

	$r['success']	= true;
	$r['data']		= $rs;
	$r['total']		= count ($rs);
}
catch (Exception $e) {
	$r['data']		= $e->getMessage ();
}

require_once "../json_end.php";
?>