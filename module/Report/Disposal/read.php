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

$asset_type_id	= (int) $_GET["asset_type_id"];
$date_from		= $_GET["date_from"];
$date_to		= $_GET["date_to"];

$qselect	="
select	A.*
,		AA.cost
,		AA.assign_date
,		AA._user_id
,		AA.location_id
,		AA.location_detail
,		AA.description
,		AML.asset_status_id
,		AML.cost			as maintenance_cost
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
";

$qwhere ="
	where A.status			= 1
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

if (null !== $date_from) {
	$qwhere .="
		and (
				A.procurement_date >= '$date_from'
			and	A.procurement_date <= '$date_to'
		)
	";
}

if (0 !== $asset_type_id) {
	$qwhere .=" and A.type_id = ". $asset_type_id;
}

$qorder = " order by A.id desc ";
$qlimit	= " limit $start,$limit ";

/* Get total rows */
$qtotal	=" select	COUNT(A.id) as total "
		. $qfrom
		. $qwhere;

/* Get data */
$qread	= $qselect
		. $qfrom
		. $qwhere
		. $qorder;

Jaring::$_out["total"]		= (int) Jaring::db_execute ($qtotal)[0]["total"];
Jaring::$_out["data"]		= Jaring::db_execute ($qread);
Jaring::$_out["success"]	= true;
