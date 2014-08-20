<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
$query	= "%". $_GET["query"] ."%";
$start	= (int) $_GET["start"];
$limit	= (int) $_GET["limit"];
$gid	= $_GET['_group_id'];

if ($gid <= 0) {
	throw new Exception ("Invalid group ID (". $gid .") !");
}

$qfrom	= " from _user ";
$qwhere	= "
		where		id not in (
			 select	_user_id
			 from	_user_group
			 where	_group_id = ?
		)
		and			(
				name		like ?
			or	realname	like ?
		)";
$qorder	= " order by realname ";
$qlimit	= " limit $start , $limit ";
$qbind	= array (
			$gid
		,	$query
		,	$query
		);

if (Jaring::$_c_profile_id !== 1) {
	$qwhere .=" and _profile_id = ". Jaring::$_c_profile_id;
}

// Query total.
$qtotal	= " select	COUNT(id) as total "
		. $qfrom
		. $qwhere;

// Query data.
$q	="
	select		id			as _user_id
	,			realname	as _user_realname"
	. $qfrom
	. $qwhere
	. $qorder
	. $qlimit;

Jaring::$_out['total']		= Jaring::db_execute ($qtotal, $qbind)[0]["total"];
Jaring::$_out['data']		= Jaring::db_execute ($q, $qbind);
Jaring::$_out['success']	= true;
