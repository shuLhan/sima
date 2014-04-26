<?php
require_once "../../../json_begin.php";

try {
	$menus = json_decode (file_get_contents('php://input'), true);

	foreach ($menus as $m) {
		$perm		= (int) $m['permission'];
		$gid		= (int) $m['_group_id'];
		$menu_id	= (int) $m['id'];
		
		if ($perm < 0) {
			throw new Exception ("Invalid permission value :'". $perm ."'!");
		}
		if ($gid <= 0) {
			throw new Exception ("Invalid group ID :'". $gid ."'!");
		}
		if ($menu_id <= 0) {
			throw new Exception ("Invalid menu ID :'". $menu_id ."'!");
		}

		$q	="	delete	from _group_menu"
			."	where	_menu_id	= ?"
			."	and		_group_id	= ?";

		$ps = Jaring::$_db->prepare ($q);
		$i	= 1;
		$ps->bindValue ($i++, $menu_id, PDO::PARAM_INT);
		$ps->bindValue ($i++, $gid, PDO::PARAM_INT);
		$ps->execute ();
		$ps->closeCursor ();

		$q	="	insert	into _group_menu ("
			."		_menu_id"
			."	,	_group_id"
			."	,	permission"
			."	) values ( ? , ? , ? )";

		$ps = Jaring::$_db->prepare ($q);
		$i	= 1;
		$ps->bindValue ($i++, $menu_id, PDO::PARAM_INT);
		$ps->bindValue ($i++, $gid, PDO::PARAM_INT);
		$ps->bindValue ($i++, $perm, PDO::PARAM_INT);
		$ps->execute ();
		$ps->closeCursor ();
	}

	$r['success']	= true;
	$r['data']		= Jaring::$MSG_SUCCESS_UPDATE;
} catch (Exception $e) {
	$r['data']		= $e->getMessage ();
}

require_once "../../../json_end.php";
