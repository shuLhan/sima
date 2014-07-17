<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
$query	= "%". $_GET["query"] ."%";
$start	= (int) $_GET["start"];
$limit	= (int) $_GET["limit"];
$gid	= $_GET["_group_id"];

$qfrom	= "
		from	_user_group A
		,		_user		B
		";
$qwhere	= "
		where	_group_id	= ?
		and		A._user_id	= B.id
		and		(B.name		like ?
		or		B.realname	like ?)
		";
$qorder	= " order by name ";
$qlimit	= " limit $start , $limit ";
$qbind	= array (
			$gid
		,	$query
		,	$query
		);

// query total.
$qtotal	=" select COUNT(A.id) as total "
		. $qfrom
		. $qwhere;

// query data.
$q	="
	select		A.id
	,			A._user_id
	,			A._group_id
	,			B.name			as _user_name
	,			B.realname		as _user_realname "
	. $qfrom
	. $qwhere
	. $qorder
	. $qlimit;

Jaring::$_out["total"]		= Jaring::db_execute ($qtotal, $qbind)[0]["total"];
Jaring::$_out["data"]		= Jaring::db_execute ($q, $qbind);
Jaring::$_out["success"]	= true;
