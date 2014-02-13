<?php
require_once "../../../json_begin.php";

try {
	$q	="	select		COUNT(A.id) as total"
		."	from		_user_group	A"
		."	,			_user		B"
		."	where		_group_id	= ?"
		."	and			A._user_id	= B.id"
		."	and			(B.name		like ?"
		."	or			B.realname	like ?)";

	$ps = Jaring::$_db->prepare ($q);
	$ps->bindValue (1, $_GET['_group_id'], PDO::PARAM_INT);
	$ps->bindValue (2, "%". $_GET["query"] ."%", PDO::PARAM_STR);
	$ps->bindValue (3, "%". $_GET["query"] ."%", PDO::PARAM_STR);
	$ps->execute ();

	$rs = $ps->fetchAll (PDO::FETCH_ASSOC);
	$ps->closeCursor ();

	if (count ($rs) > 0) {
		$t = (int) $rs[0]["total"];
	}

	// Get data
	$q	="	select		A.id"
		."	,			A._user_id"
		."	,			A._group_id"
		."	,			B.name			as _user_name"
		."	,			B.realname		as _user_realname"
		."	from		_user_group		A"
		."	,			_user			B"
		."	where		A._group_id		= ?"
		."	and			A._user_id		= B.id"
		."	and			(B.name			like ?"
		."	or			B.realname		like ?)"
		."	order by	B.name"
		."	limit		". (int) $_GET["start"] .",". (int) $_GET["limit"];

	$ps = Jaring::$_db->prepare ($q);
	$ps->bindValue (1, $_GET['_group_id'], PDO::PARAM_INT);
	$ps->bindValue (2, "%". $_GET["query"] ."%", PDO::PARAM_STR);
	$ps->bindValue (3, "%". $_GET["query"] ."%", PDO::PARAM_STR);
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