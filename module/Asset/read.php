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

$qselect	="
select	A.*
,		AA.*
";

$qfrom	="
	from	asset A
	left join (
			select		*
			from		asset_assign_log
			order by	assign_date desc
			limit		0,1
		) AA
		on A.id = AA.asset_id
	left join asset_type		AT
		on A.type_id			= AT.id
	left join asset_procurement AP
		on A.procurement_id 	= AP.id
	left join asset_status		AST
		on A.status_id			= AST.id
	left join asset_location	AL
		on AA.location_id		= AL.id
	left join _user				U
		on AA._user_id			= U.id
	where
		A.merk				like $query
	or	A.model				like $query
	or	A.sn				like $query
	or	A.barcode			like $query
	or	A.service_tag		like $query
	or	A.label				like $query
	or	A.detail			like $query
	or	A.warranty_date		= '$qstr'
	or	A.warranty_info		like $query
	or	A.company			like $query
	or	A.maintenance_info	like $query
	or	AT.name				like $query
	or	AP.name				like $query
	or	AST.name			like $query
	or	AL.name				like $query
	or	U.realname			like $query
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
