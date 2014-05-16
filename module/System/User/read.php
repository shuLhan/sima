<?php
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
		$t = (int) $rs[0]["total"];
	}

	// Get data
	$q	="
		select		id
		,			name
		,			realname
		,			password	as password_old
		,			''			as password
		from		_user
		where		(name		like ?
		or			realname	like ?)
		order by	name
		limit		". (int) $_GET["start"] .",". (int) $_GET["limit"];

	$ps = Jaring::$_db->prepare ($q);
	$ps->execute (array (
			"%". $_GET["query"] ."%"
		,	"%". $_GET["query"] ."%"
		)
	);
	$rs = $ps->fetchAll (PDO::FETCH_ASSOC);
	$ps->closeCursor ();

	Jaring::$_out["success"]	= true;
	Jaring::$_out["data"]		= $rs;
	Jaring::$_out["total"]		= $t;
