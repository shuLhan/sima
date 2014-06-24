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
select	ARL.asset_id
,		A.type_id
,		A.merk
,		A.model
,		A.barcode
,		ARL.asset_removal_id
,		ARL.removal_date
,		ARL.removal_cost
,		ARL.removal_info
";

$qfrom	="
from	asset				A
left join asset_removal_log	ARL
	on	A.id = ARL.asset_id
left join asset_type		AT
	on A.type_id			= AT.id
left join asset_procurement AP
	on A.procurement_id 	= AP.id
where
		A.status			= 0
	and	(
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
	or	ARL.removal_date	= '$qstr'
	or	ARL.removal_info	like $query
	)
";

$qorder = " order by ARL.removal_date desc ";
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
