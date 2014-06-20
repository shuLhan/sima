<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
	- mhd.sulhan (m.shulhan@gmail.com)
*/
require_once ("../../init.php");

Jaring::init ();
Jaring::initDB ();

$id = $_POST["id"];

function get_asset ($id)
{
	$qselect	="
		select	A.*
		,		AT.name				as asset_type_name
		,		AA.cost				as assign_cost
		,		AA.assign_date
		,		AA._user_id			as assign_user_id
		,		U.realname			as assign_user_name
		,		AA.location_id		as assign_location_id
		,		AL.name				as assign_location_name
		,		AA.location_detail	as assign_location_detail
		,		AA.description		as assign_description
		,		AP.name				as procurement_name
	";

	$qfrom	="
		from asset A
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
	";

	$qwhere ="
		where A.status = 1
	";

	if (0 !== $id) {
		$qwhere .=" and A.id = ". $id;
	}

	$qorder = " order by A.id desc ";

	/* Get data */
	$qread	= $qselect
			. $qfrom
			. $qwhere
			. $qorder;

	return Jaring::dbExecute ($qread)[0];
}

function get_asset_maintenance_log ($id)
{
	$q	="
		select	AML.*
		from	asset_maintenance_log	AML
		where	asset_id = $id
		order	by maintenance_date		DESC
	";

	return Jaring::dbExecute ($q);
}

$asset		= get_asset ($id);
$maint_log	= get_asset_maintenance_log ($id);

?>
<!DOCTYPE html>
<html lang="en">
<head>
	<title>Laporan Pengadaan Aset</title>
	<link rel="stylesheet" type="text/css" href="/css/print.css" />
</head>
<body>
	<h1>Laporan Pemeliharaan Aset</h1>
	<h2>Data Aset</h2>
	<table class="asset">
		<tr class="col-header">
			<th> Type </th>
			<td><?= $asset["asset_type_name"] ?></td>
		</tr>
		<tr class="col-header">
			<th> Merk </th>
			<td><?= $asset["merk"] ?></td>
		</tr>
		<tr class="col-header">
			<th> Model </th>
			<td><?= $asset["model"] ?> </td>
		</tr>
		<tr class="col-header">
			<th> Serial Number </th>
			<td><?= $asset["sn"] ?></td>
		</tr>
		<tr class="col-header">
			<th> Label </th>
			<td><?= $asset["label"] ?></td>
		</tr>
		<tr class="col-header">
			<th> Detail </th>
			<td><?= $asset["detail"] ?></td>
		</tr>

		<tr>
			<th colspan="3"> Procurement </th>
		</tr>
		<tr class="col-header">
			<th> Type </th>
			<td><?= $asset["procurement_name"] ?></td>
		</tr>
		<tr class="col-header">
			<th> Purchase Date </th>
			<td><?= $asset["warranty_date"] ?></td>
		</tr>
		<tr class="col-header">
			<th> Company </th>
			<td><?= $asset["company"] ?></td>
		</tr>
		<tr class="col-header">
			<th> Price </th>
			<td><?= $asset["price"] ?></td>
		</tr>

		<tr>
			<th colspan="3"> Warranty </th>
		</tr>
		<tr class="col-header">
			<th> Warranty Length </th>
			<td><?= $asset["warranty_length"] ?> Year </td>
		</tr>
		<tr class="col-header">
			<th> Information </th>
			<td><?= $asset["warranty_info"] ?></td>
		</tr>

		<tr>
			<th colspan="3"> Assignment </th>
		</tr>
		<tr class="col-header">
			<th> User </th>
			<td><?= $asset["assign_user_name"] ?></td>
		</tr>
		<tr class="col-header">
			<th> Location </th>
			<td><?= $asset["assign_location_name"] ?></td>
		</tr>
		<tr class="col-header">
			<th> Detail </th>
			<td><?= $asset["assign_location_detail"] ?></td>
		</tr>
		<tr class="col-header">
			<th> Description </th>
			<td><?= $asset["assign_description"] ?></td>
		</tr>
	</table>

	<h2> Riwayat Pemeliharaan </h2>
	<table class="maintenance">
		<tr>
			<th>Date</th>
			<th>Information</th>
			<th>Cost</th>
		</tr>
		<?php
			$sum = 0.0;
			foreach ($maint_log as $aml) {
				$sum += (double) $aml["cost"];
				echo "
					<tr>
						<td>". $aml["maintenance_date"] ."</td>
						<td>". $aml["maintenance_info"] ."</td>
						<td>". $aml["cost"] ."</td>
					</tr>
				";
			}
		?>
		<tr>
			<th colspan="2"> Total </th>
			<td><?= $sum ?></td>
		</tr>
	</table>
</body>
</html>
