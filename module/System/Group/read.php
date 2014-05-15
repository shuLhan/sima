<?php
require_once "../../json_begin.php";

$q	="	select		A.id"
	."	,			A.pid"
	."	,			A.name"
	."	,			A.name		as text"
	."	from		_group		A"
	."	where		A.pid		= ?"
	."	order by	A.id";

function getGroup ($pid, $depth)
{
	global $q;

	$ps = Jaring::$_db->prepare ($q);
	$i	= 1;
	$ps->bindValue ($i++, $pid, PDO::PARAM_INT);
	$ps->execute ();
	$rs = $ps->fetchAll (PDO::FETCH_ASSOC);
	$ps->closeCursor ();

	$index = 0;
	foreach ($rs as &$m) {
		$id = $m["id"];

		if ($index === 0) {
			$m["isFirst"] = true;
		} else {
			$m["isFirst"] = false;
		}

		$m["index"] = $index++;
		$m["depth"]	= $depth;

		$c = getGroup ($id, $depth + 1);

		if (count ($c) <= 0) {
			$m["leaf"]			= true;
		} else {
			$m["children"]		= $c;
			$m["expandable"]	= true;
			$m["expanded"]		= true;
			$m["loaded"]		= true;
		}
	}

	return $rs;
}

try {
	$data = getGroup (0, 0);

	$r["success"]	= true;
	$r["children"]	= $data;
} catch (Exception $e) {
	$r["data"]		= $e->getMessage ();
}

require_once "../../json_end.php";
