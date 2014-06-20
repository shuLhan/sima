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

function get_asset_assign_log ($id)
{
	$q	="
		select	AA.cost
		,		AA.assign_date
		,		AA.location_detail
		,		AA.description
		,		AL.name				as location_name
		,		U.realname			as user_name
		from	asset_assign_log	AA
			left join _user				U	on AA._user_id		= U.id
			left join asset_location	AL	on AA.location_id	= AL.id
		where	asset_id = $id
		order	by assign_date		DESC
	";

	return Jaring::dbExecute ($q);
}

$asset	= get_asset ($id);
$logs	= get_asset_assign_log ($id);

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
		<tr>
			<th> Type </th>
			<td><?= $asset["asset_type_name"] ?></td>
		</tr>
		<tr>
			<th> Merk </th>
			<td><?= $asset["merk"] ?></td>
		</tr>
		<tr>
			<th> Model </th>
			<td><?= $asset["model"] ?> </td>
		</tr>
		<tr>
			<th> Serial Number </th>
			<td><?= $asset["sn"] ?></td>
		</tr>
		<tr>
			<th> Label </th>
			<td><?= $asset["label"] ?></td>
		</tr>
		<tr>
			<th> Detail </th>
			<td><?= $asset["detail"] ?></td>
		</tr>

		<tr>
			<th colspan="3"> Procurement </th>
		</tr>
		<tr>
			<th> Type </th>
			<td><?= $asset["procurement_name"] ?></td>
		</tr>
		<tr>
			<th> Purchase Date </th>
			<td><?= $asset["warranty_date"] ?></td>
		</tr>
		<tr>
			<th> Company </th>
			<td><?= $asset["company"] ?></td>
		</tr>
		<tr>
			<th> Price </th>
			<td class='money'><?= $asset["price"] ?></td>
		</tr>

		<tr>
			<th colspan="3"> Warranty </th>
		</tr>
		<tr>
			<th> Warranty Length </th>
			<td><?= $asset["warranty_length"] ?> Year </td>
		</tr>
		<tr>
			<th> Information </th>
			<td><?= $asset["warranty_info"] ?></td>
		</tr>
	</table>

	<h2> Riwayat Relokasi </h2>
	<table class="assign">
		<tr>
			<th>Date</th>
			<th>User</th>
			<th>Location</th>
			<th>Cost</th>
		</tr>
		<?php
			$sum = 0.0;
			foreach ($logs as $log) {
				$sum += (double) $log["cost"];
				echo "
					<tr>
						<td rowspan='5'>". $log["assign_date"] ."</td>
						<td>". $log["user_name"] ."</td>
						<td>". $log["location_name"] ."</td>
						<td rowspan='5' class='money'>". $log["cost"] ."</td>
					</tr>
					<tr>
						<th colspan='2'>Location Detail</th>
					</tr>
					<tr>
						<td colspan='2'>". $log["location_detail"] ."</td>
					</tr>
					<tr>
						<th colspan='2'>Description</th>
					</tr>
					<tr>
						<td colspan='2'>". $log["description"] ."</td>
					</tr>
				";
			}
		?>
		<tr>
			<th colspan="3"> Total </th>
			<td class="money"><?= $sum ?></td>
		</tr>
	</table>
</body>
</html>
