<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
//{{{ generate uniq id for each data
foreach ($data as &$v) {
	$v["barcode"] = uniqid ();
}
//}}}

//{{{ save it to database
Jaring::handleRequestCreate ($data);
//}}}

//{{{ assign current user as the owner
$uid = Jaring::$_c_uid;
$q = "
	insert into asset_assign_log (
		id
	,	asset_id
	,	_user_id
	,	assign_date
	) values (
		?
	,	?
	,	$uid
	,	NOW()
	)
";

Jaring::$_db_ps = Jaring::$_db->prepare ($q);

foreach ($data as $v) {
	$bindv = [];

	$bindv[0] = Jaring::generate_id ();
	$bindv[1] = $v["id"];

	Jaring::$_db_ps->execute ($bindv);
	Jaring::$_db_ps->closeCursor ();

	unset ($bindv);
}
//}}}
