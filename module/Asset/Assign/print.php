<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
	- mhd.sulhan (m.shulhan@gmail.com)
*/
require_once "../../init.php";
require_once "../../Report/init.php";

$asset_id	= $_POST["id"];
$logs		= get_asset_assign_log ($asset_id);
$title		= "Laporan Relokasi Aset";
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

	<?php render_asset ($asset_id, false); ?>

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
