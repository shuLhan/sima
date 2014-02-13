<?php
require_once "../../../json_begin.php";

try {
	$gid = $_GET['_group_id'];
	
	if ($gid <= 0) {
		throw new Exception ("Invalid group ID (". $gid .") !");
	}

	$q	="	select		COUNT(id) as total"
		."	from		_user"
		."	where		id not in ("
		."		 select	_user_id"
		."		 from	_user_group"
		."		 where	_group_id = ?"
		."	)"
		."	and			("
		."			name		like ?"
		."		or	realname	like ?"
		."	)";

	$ps = Jaring::$_db->prepare ($q);
	$ps->bindValue (1, $gid, PDO::PARAM_INT);
	$ps->bindValue (2, "%". $_GET["query"] ."%", PDO::PARAM_STR);
	$ps->bindValue (3, "%". $_GET["query"] ."%", PDO::PARAM_STR);
	$ps->execute ();

	$rs = $ps->fetchAll (PDO::FETCH_ASSOC);
	$ps->closeCursor ();

	if (count ($rs) > 0) {
		$t = (int) $rs[0]["total"];
	}

	// Get data
	$q	="	select		id			as _user_id"
		."	,			realname	as _user_realname"
		."	from		_user"
		."	where		id not in ("
		."		 select	_user_id"
		."		 from	_user_group"
		."		 where	_group_id = ?"
		."	)"
		."	and			("
		."			name		like ?"
		."		or	realname	like ?"
		."	)"
		."	order by	realname"
		."	limit		? , ?";

	$ps = Jaring::$_db->prepare ($q);
	$ps->bindValue (1, $gid, PDO::PARAM_INT);
	$ps->bindValue (2, "%". $_GET["query"] ."%", PDO::PARAM_STR);
	$ps->bindValue (3, "%". $_GET["query"] ."%", PDO::PARAM_STR);
	$ps->bindValue (4, (int) $_GET['start'], PDO::PARAM_INT);
	$ps->bindValue (5, (int) $_GET['limit'], PDO::PARAM_INT);
	$ps->execute ();
	$rs = $ps->fetchAll (PDO::FETCH_ASSOC);

	$r['success']	= true;
	$r['data']		= $rs;
	$r['total']		= $t;
} catch (Exception $e) {
	$r['data']		= $e->getMessage ();
}

require_once "../../../json_end.php";
?>