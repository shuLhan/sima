<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
require_once "../../../init.php";

try {
	Jaring::init ();
	Jaring::initDB ();

	if (UPLOAD_ERR_OK === $_FILES["logo"]["error"]) {
		$q = "update _profile set logo_type = ? , logo = ?";

		Jaring::$_db_ps = Jaring::$_db->prepare ($q);

		$fp = fopen ($_FILES["logo"]["tmp_name"], "rb");

		$i = 1;
		Jaring::$_db_ps->bindParam ($i++, $_FILES["logo"]["type"]);
		Jaring::$_db_ps->bindParam ($i++, $fp, PDO::PARAM_LOB);

		Jaring::$_db->beginTransaction ();
		Jaring::$_db_ps->execute ();
		Jaring::$_db->commit ();

		Jaring::$_out["success"] = true;
		Jaring::$_out["data"] = "New logo has been uploaded.";
	} else {
		Jaring::$_out["data"] = $_FILES["logo"]["error"];
	}
} catch (Exception $e) {
	Jaring::$_out["data"] = addslashes ($e->getMessage ());
}

header('Content-Type: application/json');
echo json_encode (Jaring::$_out, JSON_NUMERIC_CHECK);
