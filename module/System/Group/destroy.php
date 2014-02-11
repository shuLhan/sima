<?php
require_once "../../json_begin.php";

try {
	$id = (int) $_POST['id'];

	if ($id < 0) {
		throw new Exception ("Invalid data ID!");
	}

	$q	="	select	type"
		."	from	_group"
		."	where	id = ?";

	$ps = Jaring::$_db->prepare ($q);
	$ps->bindValue (1, $id, PDO::PARAM_INT);
	$ps->execute ();
	$rs = $ps->fetchAll (PDO::FETCH_ASSOC);

	if (count ($rs) > 0) {
		$type = (int) $rs[0]['type'];
		
		if ($type === 0) {
			throw new Exception ("This group is system group and can't be deleted.");
		}
	}

	// Delete group menu access
	$q	="	delete from	_group_menu"
		."	where		_group_id = ?";

	$ps = Jaring::$_db->prepare ($q);
	$ps->bindValue (1, $id, PDO::PARAM_INT);
	$ps->execute ();
	$ps->closeCursor ();

	// Delete group from table
	$q	="	delete from		_group"
		."	where	id		= ?"
		."	and		type	!= 0";

	$ps = Jaring::$_db->prepare ($q);
	$ps->bindValue (1, $id, PDO::PARAM_INT);
	$ps->execute ();
	$ps->closeCursor ();

	$r['success']	= true;
	$r['data']		= Jaring::$MSG_SUCCESS_DESTROY;
} catch (Exception $e) {
	$r['data']		= $e->getMessage ();
}

require_once "../../json_end.php";
?>