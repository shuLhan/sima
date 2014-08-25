<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
	- mhd.sulhan (m.shulhan@gmail.com)
*/
require_once "../../init.php";
require_once "../../Report/init.php";

$asset_id	= $_POST["id"];

$maint_log	= get_asset_maintenance_log ($asset_id);
$title		= "Asset Maintenance Report";
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

	<?php render_asset ($asset_id); ?>

	<h2> History of Maintenance </h2>
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
						<td class='money'>". $aml["cost"] ."</td>
					</tr>
				";
			}
		?>
		<tr>
			<th colspan="2"> Total </th>
			<td class="money"><?= $sum ?></td>
		</tr>
	</table>
</body>
</html>
