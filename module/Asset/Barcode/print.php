<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<title> Barcode Print </title>
</head>
<body>
	<?php
		$data = json_decode (stripslashes(filter_input (INPUT_POST, "data")), true);

		foreach ($data as $v) {
			$barcode	= $v["barcode"];
			$n			= (int) $v["print_count"];

			for ($i = 0; $i < $n; $i++) {
	?>
			<div class="">
				<img
					src="barcode_img.php?code=<?= $barcode ?>"
					alt="<?= $barcode ?>"
					title="<?= $barcode ?>"
				/>
			</div>
	<?php
			}
		}
	?>
</body>
</html>
