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
$title			= "Asset Disposal Report";

$qselect	="
select	A.*
,		AA.cost
,		AA.assign_date
,		AA._user_id
,		AA.location_id
,		AA.location_detail
,		AA.description
,		AT.name				as asset_type_name
,		AR.name				as asset_removal_name
,		DATE_FORMAT (ARL.removal_date, '%d %b %Y')	as removal_date
,		ARL.removal_cost
,		ARL.removal_info
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
	left join asset_type		AT	on A.type_id			= AT.id
	left join asset_procurement AP	on A.procurement_id 	= AP.id
	left join asset_location	AL	on AA.location_id		= AL.id
	left join _user				U	on AA._user_id			= U.id
	left join asset_removal_log	ARL	on A.id					= ARL.asset_id
	left join asset_removal		AR	on ARL.asset_removal_id	= AR.id
";

$qwhere ="
	where A.status			= 0
";

if (null !== $date_from) {
	$qwhere .="
		and (
				ARL.removal_date >= '$date_from'
			and	ARL.removal_date <= '$date_to'
		)
	";
}

if (0 !== $asset_type_id) {
	$qwhere .=" and A.type_id = ". $asset_type_id;
}

$qorder = " order by ARL.removal_date DESC";

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
	<?php render_profile () ?>

	<h1><?= $title ?></h1>
	<hr/>
	<br/>
	<p>
	Asset disposed from <?= $date_from ?> until <?= $date_to ?>.
	</p>
	<br/>
	<table>
		<tr>
			<th>Type</th>
			<th>Merk</th>
			<th>Model</th>
			<th>Disposal Type</th>
			<th>Disposal Date</th>
			<th>Disposal Cost</th>
		</tr>
	<?php
		$sum = 0.0;

		foreach ($rs as $d) {
			$sum += (double) $d["removal_cost"];

			echo "
				<tr>
					<td>". $d["asset_type_name"] ."</td>
					<td>". $d["merk"] ."</td>
					<td>". $d["model"] ."</td>
					<td>". $d["asset_removal_name"] ."</td>
					<td>". $d["removal_date"] ."</td>
					<td class='money'>". $d["removal_cost"] ."</td>
				</tr>
			";
		}
	?>
		<tr>
			<td colspan="5" align="right">Total : </td>
			<td class='money'><?= $sum ?></td>
		</tr>
	</table>
</body>
</html>
