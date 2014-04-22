<?php
require_once "../../json_begin.php";

try {
	$q	="
		select	distinct
				A.pid		as id
		,		(
					select	label
					from	_menu
					where	id = A.pid
				) as title
		from	_menu		A
		,		_group_menu	B
		,		_user_group	C
		where	A.type		in (2,3)
		and		A.id		= B._menu_id
		and		B._group_id	= C._group_id
		and		C._user_id	= ?
		order by A.pid, A.id asc
		";

	$ps = Jaring::$_db->prepare ($q);
	$ps->execute (array (Jaring::$_c_uid));
	$rs_parents = $ps->fetchAll (PDO::FETCH_ASSOC);
	$ps->closeCursor ();
	$ps	= null;

	$r['success']	= true;
	$r['data']		= $rs_parents;
	$r['total']		= count ($rs_parents);
}
catch (Exception $e) {
	$r['data']		= $e->getMessage ();
}

require_once "../../json_end.php";
