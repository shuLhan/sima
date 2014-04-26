<?php
require_once "../../../json_begin.php";

$q	="	select		A.id"
	."	,			A.pid		as parentId"
	."	,			A.label"
	."	,			A.icon		as iconCls"
	."	,			A.module"
	."	,			coalesce (B._group_id, ?)	_group_id"
	."	,			B.permission"
	."	from		_menu		A"
	."	left join	_group_menu	B"
	."		on		A.id		= B._menu_id"
	."		and		B._group_id	= ?"
	."	left join	("
	."			select 	id"
	."			,		pid"
	."			,		label"
	."			,		icon"
	."			,		module"
	."			from	_menu	M2"
	."			where	pid		= ?"
	."			and		type	in (0, 1, 3)"
	."		) M2"
	."		on M2.id = A.pid"
	."	where		A.pid		= ?"
	."	and			A.type	in (0, 1, 3)"
	."	order by	A.id";

function getSystemMenu ($gid, $pid, $depth)
{
	global $q;

	$ps = Jaring::$_db->prepare ($q);
	$i	= 1;
	$ps->bindValue ($i++, $gid, PDO::PARAM_INT);
	$ps->bindValue ($i++, $gid, PDO::PARAM_INT);
	$ps->bindValue ($i++, $pid, PDO::PARAM_INT);
	$ps->bindValue ($i++, $pid, PDO::PARAM_INT);
	$ps->execute ();
	$rs = $ps->fetchAll (PDO::FETCH_ASSOC);
	$ps->closeCursor ();

	$index = 0;
	foreach ($rs as &$m) {
		$id = $m['id'];
		
		if ($index === 0) {
			$m['isFirst'] = true;
		} else {
			$m['isFirst'] = false;
		}
		
		$m['index'] = $index++;
		$m['depth']	= $depth;
		
		$c = getSystemMenu ($gid, $id, $depth + 1);
		
		if (count ($c) <= 0) {
			$m['leaf'] = true;
		} else {
			$m['children']		= $c;
			$m['expandable']	= true;
			$m['expanded']		= true;
			$m['loaded']		= true;
		}
	}
	
	return $rs;
}

try {
	$gid = (int) $_GET["_group_id"];

	if ($gid <= 0) {
		throw new Exception ("Invalid group ID : '". $gid ."'!");
	}

	$menus = getSystemMenu ($gid, 0, 0);

	$r['success']	= true;
	$r["children"]	= $menus;
} catch (Exception $e) {
	$r['data']		= $e->getMessage ();
}

require_once "../../../json_end.php";
