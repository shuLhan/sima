<?php
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
	$i	= 1;
	$ps->bindValue ($i++, $gid, PDO::PARAM_INT);
	$ps->bindValue ($i++, "%". $_GET["query"] ."%", PDO::PARAM_STR);
	$ps->bindValue ($i++, "%". $_GET["query"] ."%", PDO::PARAM_STR);
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
	$i	= 1;
	$ps->bindValue ($i++, $gid, PDO::PARAM_INT);
	$ps->bindValue ($i++, "%". $_GET["query"] ."%", PDO::PARAM_STR);
	$ps->bindValue ($i++, "%". $_GET["query"] ."%", PDO::PARAM_STR);
	$ps->bindValue ($i++, (int) $_GET['start'], PDO::PARAM_INT);
	$ps->bindValue ($i++, (int) $_GET['limit'], PDO::PARAM_INT);
	$ps->execute ();
	$rs = $ps->fetchAll (PDO::FETCH_ASSOC);

	Jaring::$_out['success']	= true;
	Jaring::$_out['data']		= $rs;
	Jaring::$_out['total']		= $t;
