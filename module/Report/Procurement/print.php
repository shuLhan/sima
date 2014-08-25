<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
	- mhd.sulhan (m.shulhan@gmail.com)
*/
require_once ("../../init.php");
require_once ("../init.php");

$asset_type_id	= (int) $_POST["asset_type_id"];
$date_from		= $_POST["date_from"];
$date_to		= $_POST["date_to"];
$title			= "Asset Procurement Report";

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
,		AT.name				as asset_type_name
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

/* Get data */
$qread	= $qselect
		. $qfrom
		. $qwhere
		. $qorder;

$rs		= Jaring::db_execute ($qread);

?>
<!DOCTYPE html>
<html lang="en">
<head>
	<title><?= $title ?></title>
	<link rel="stylesheet" type="text/css" href="/css/print.css" />
</head>
<body>
	<?php render_profile (); ?>
	<h1><?= $title ?></h1>
	<hr/>
	<br/>
	<p>
	Asset procured from <?= $date_from ?> umtil <?= $date_to ?>.
	</p>
	<br/>
	<table>
		<tr>
			<th>Type</th>
			<th>Merk</th>
			<th>Model</th>
			<th>Price</th>
		</tr>
	<?php
		$sum = 0.0;

		foreach ($rs as $d) {
			$sum += $d["procurement_price"];

			echo "
				<tr>
					<td>". $d["asset_type_name"] ."</td>
					<td>". $d["merk"] ."</td>
					<td>". $d["model"] ."</td>
					<td class='money'>". $d["procurement_price"] ."</td>
				</tr>
			";
		}
	?>
		<tr>
			<td colspan="3" align="right">Total : </td>
			<td class='money'><?= $sum ?></td>
		</tr>
	</table>
</body>
</html>
