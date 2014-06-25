<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
	- mhd.sulhan (m.shulhan@gmail.com)
*/
?>
<div class="profile">
	<div class="profile_logo">
		<img src='<?= get_company_profile_logo () ?>'/>
	</div>
	<div class="profile_name"><?= $profile["name"] ?></div>
	<div class="profile_address"><?= $profile["address"] ?></div>
	<div class="profile_contact">
		Phone :
		<?php
			if (null !== $profile["phone_1"]) {
				echo $profile["phone_1"];
			}
			if (null !== $profile["phone_2"]) {
				echo " - ". $profile["phone_2"];
			}
			if (null !== $profile["phone_3"]) {
				echo " - ". $profile["phone_3"];
			}
		?>
		Email :
		<?php
			if (null !== $profile["email"]) {
				echo $profile["email"];
			} else {
				echo "-";
			}
		?>
		Website :
		<?php
			if (null !== $profile["website"]) {
				echo $profile["website"];
			} else {
				echo "-";
			}
		?>
	</div>
</div>
