<?php
/*
	Copyright 2014 Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
require_once "../json_begin.php";

function getMenu ($uid, $pid)
{
	$q	="	select 	A.id				as menu_id"
		."	,		A.pid				as menu_pid"
		."	,		A.label				as text"
		."	,		A.icon				as iconCls"
		."	,		A.module			as module"
		."	,		MAX(B.permission)	as permission"
		."	from	_menu				A"
		."	,		_group_menu			B"
		."	,		_user_group			C"
		."	where	A.pid				= ?"
		."	and		A.id				= B._menu_id"
		."	and		B._group_id			= C._group_id"
		."	and		C._user_id			= ?"
		."	and		C._profile_id		= ?"
		."	and		B.permission		> 0"
		."	and		A.type				in (1,3)"
		."	group by A.id"
		."	order by A.id";

	$ps = Jaring::$_db->prepare ($q);
	$ps->execute (array ($pid, $uid, Jaring::$_c_profile_id));
	$rs = $ps->fetchAll (PDO::FETCH_ASSOC);
	$ps->closeCursor ();

	foreach ($rs as &$menu) {
		$menu['enableToggle'] = true;

		$submenu = getMenu ($uid, $menu['menu_id']);

		if (count ($submenu) > 0) {
			$menu['arrowAlign']	= "right";
			$menu['menu']		= $submenu;
		}
	}

	return $rs;
}

try {
	$q	="	select	A.id			as menu_id"
		."	,		A.pid			as menu_pid"
		."	,		A.label			as title"
		."	,		A.label			as text"
		."	,		A.icon			as iconCls"
		."	,		A.module		as id"
		."	from	_menu			A"
		."	,		_group_menu		B"
		."	,		_user_group		C"
		."	where	A.pid			= 0"
		."	and		A.id			= B._menu_id"
		."	and		B._group_id		= C._group_id"
		."	and		C._user_id		= ?"
		."	and		C._profile_id	= ?"
		."	and		B.permission	> 0"
		."	order by A.id";

	$ps = Jaring::$_db->prepare ($q);
	$ps->execute (array (Jaring::$_c_uid, Jaring::$_c_profile_id));
	$rs = $ps->fetchAll (PDO::FETCH_ASSOC);
	$ps->closeCursor ();

	foreach ($rs as &$menu) {
		$menu_items = getMenu (Jaring::$_c_uid, $menu['menu_id']);

		switch (Jaring::$_menu_mode) {
		case 0:
			$tbar_layout = array ();

			if (count ($menu_items) > 0) {
				$tbar_layout['overflowHandler'] = "Menu";

				$tbar = array (
					'layout'	=> $tbar_layout
				,	'items'		=> $menu_items
				);

				$menu['tbar']	= $tbar;
			}

			break;
		case 1:
			if (count ($menu_items) > 0) {
				$menu['menu']	= $menu_items;
			}
			break;
		}
	}

	$r['success']	= true;
	$r['data']		= $rs;
} catch (Exception $e) {
	$r['data']		= $e->getMessage ();
}

require_once "../json_end.php";
?>
