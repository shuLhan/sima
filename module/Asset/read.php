<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

$qstr	= $_GET["query"];
$query	= "'%".$qstr."%'";
$start	= (int) $_GET["start"];
$limit	= (int) $_GET["limit"];

function get_gid ($id)
{
	$q = "
		select	UG._group_id
		from 	_user_group	UG
		where	UG._user_id = $id
		limit	0,1
	";

	$rs = Jaring::dbExecute ($q);

	return $rs[0]["_group_id"];
}

function get_descendant_group ($gid)
{
	$o = null;
	$q = " select id from _group where pid in ($gid)";

	$rs = Jaring::dbExecute ($q);

	foreach ($rs as $k => $v) {
		if ($k > 0) {
			$o .= ",". $v["id"];
		} else {
			$o = $v["id"];
		}
	}

	if ($o !== null) {
		$gids = get_descendant_group ($o);

		if ($gids !== null) {
			$o .= ",". $gids;
		}
	}

	return $o;
}

function get_user_group ($gids)
{
	$o = null;
	$q =" select _user_id from _user_group where _group_id in ($gids) ";
	$rs = Jaring::dbExecute ($q);

	foreach ($rs as $k => $v) {
		if ($k > 0) {
			$o .= ",". $v["_user_id"];
		} else {
			$o = $v["_user_id"];
		}
	}

	return $o;
}

// get current user group id.
$gid = get_gid (Jaring::$_c_uid);

// get all descendant groups of this user group.
$gids = get_descendant_group ($gid);
// get all user in child groups.
$uids = get_user_group ($gids);

// now we have all childs user group
if ($uids === null) {
	$uids = Jaring::$_c_uid;
} else {
	$uids = Jaring::$_c_uid .",". $uids;
}

$qselect	="
select	A.*
,		AA.cost
,		AA.assign_date
,		AA._user_id
,		AA.location_id
,		AA.location_detail
,		AA.description
,		AML.asset_status_id
,	(
		select	sum(cost)
		from	asset_maintenance_log
		where	asset_id		= A.id
	)	as maintenance_cost
,		AML.maintenance_info
";

$qfrom	="
	from	asset A
	left join asset_assign_log	AA
		on AA.id = (
			select	id
			from	asset_assign_log
			where	asset_id = A.id
			order by assign_date desc
			limit	0,1
		)
	left join asset_maintenance_log AML
		on AML.id = (
			select	id
			from	asset_maintenance_log
			where	asset_id = A.id
			order by maintenance_date DESC
			limit 0,1
		)
	left join asset_type		AT
		on A.type_id			= AT.id
	left join asset_procurement AP
		on A.procurement_id 	= AP.id
	left join asset_status		AST
		on AML.asset_status_id	= AST.id
	left join asset_location	AL
		on AA.location_id		= AL.id
	left join _user				U
		on AA._user_id			= U.id
	where A.status			= 1
	and AA._user_id			in ($uids)
	and (
		A.merk				like $query
	or	A.model				like $query
	or	A.sn				like $query
	or	A.barcode			like $query
	or	A.service_tag		like $query
	or	A.label				like $query
	or	A.detail			like $query
	or	A.warranty_info		like $query
	or	A.procurement_date		= '$qstr'
	or	A.procurement_company	like $query
	or	AT.name				like $query
	or	AP.name				like $query
	or	AST.name			like $query
	or	AL.name				like $query
	or	U.realname			like $query
	)
";

$qorder = " order by A.id desc ";
$qlimit	= " limit $start,$limit ";

/* Get total rows */
$qtotal	=" select	COUNT(A.id) as total "
		. $qfrom;

/* Get data */
$qread	= $qselect
		. $qfrom
		. $qorder
		. $qlimit;

Jaring::$_out["total"]		= (int) Jaring::dbExecute ($qtotal)[0]["total"];
Jaring::$_out["data"]		= Jaring::dbExecute ($qread);
Jaring::$_out["success"]	= true;
