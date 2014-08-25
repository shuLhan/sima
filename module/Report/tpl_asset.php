<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
	- mhd.sulhan (m.shulhan@gmail.com)
*/
?>
<h2>Asset Data</h2>

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
		<td><?= $asset["procurement_date"] ?></td>
	</tr>
	<tr>
		<th> Company </th>
		<td><?= $asset["procurement_company"] ?></td>
	</tr>
	<tr>
		<th> Price </th>
		<td class="money"><?= $asset["procurement_price"] ?></td>
	</tr>

	<tr>
		<th colspan="3"> Warranty </th>
	</tr>
	<tr>
		<th> Length </th>
		<td><?= $asset["warranty_length"] ?> month </td>
	</tr>
	<tr>
		<th> Information </th>
		<td><?= $asset["warranty_info"] ?></td>
	</tr>

	<?php if ($render_assignment) { ?>
		<tr>
			<th colspan="3"> Assignment </th>
		</tr>
		<tr>
			<th> User </th>
			<td><?= $asset["assign_user_name"] ?></td>
		</tr>
		<tr>
			<th> Location </th>
			<td><?= $asset["assign_location_name"] ?></td>
		</tr>
		<tr>
			<th> Detail </th>
			<td><?= $asset["assign_location_detail"] ?></td>
		</tr>
		<tr>
			<th> Description </th>
			<td><?= $asset["assign_description"] ?></td>
		</tr>
	<?php } ?>
</table>
