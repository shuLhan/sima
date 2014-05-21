<?php
// Get total row
$q	="
		select	COUNT(id) as total
		from	". Jaring::$_mod["db_table"] ."
		where	name like ?
	";

$query = "%".$_GET["query"]."%";

$ps = Jaring::$_db->prepare ($q);
$ps->execute (array ($query));
$rs = $ps->fetchAll (PDO::FETCH_ASSOC);
$ps->closeCursor ();

if (count ($rs) > 0) {
	$t = (int) $rs[0]["total"];
}

// Get data
$q	="
	select		id
	,			name
	from		". Jaring::$_mod["db_table"] ."
	where		name like ?
	order by	name
	limit		". (int) $_GET["start"] .",". (int) $_GET["limit"];

$ps = Jaring::$_db->prepare ($q);
$ps->execute (array ($query));
$rs = $ps->fetchAll (PDO::FETCH_ASSOC);
$ps->closeCursor ();

Jaring::$_out["success"]	= true;
Jaring::$_out["data"]		= $rs;
Jaring::$_out["total"]		= $t;
