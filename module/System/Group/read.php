<?php

function getGroup ($pid, $depth)
{
	$q	="
			select		A.id
			,			A.pid
			,			A.name
			,			A.name		as text
			from		_group		A
			where		A.pid		= ?
			order by	A.id
		";

	$ps	= Jaring::$_db->prepare ($q);
	$i	= 1;
	$ps->bindValue ($i++, $pid, PDO::PARAM_INT);
	$ps->execute ();
	$rs	= $ps->fetchAll (PDO::FETCH_ASSOC);
	$ps->closeCursor ();

	$index = 0;
	foreach ($rs as &$m) {
		$id = $m["id"];

		if ($index === 0) {
			$m["isFirst"] = true;
		} else {
			$m["isFirst"] = false;
		}

		$m["iconCls"]	= "group";
		$m["index"] 	= $index++;
		$m["depth"]		= $depth;

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

$data = getGroup (0, 0);

Jaring::$_out["success"]	= true;
Jaring::$_out["children"]	= $data;
