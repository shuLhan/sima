<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
	$table	= Jaring::$_mod["db_table"]["name"];
	$fields	= [];
	$ids	= Jaring::$_mod["db_table"]["id"];
	$bindv	= [];

	// if no file uploaded, just update the data
	if ($_FILES["content"]["error"] === UPLOAD_ERR_NO_FILE) {
		if ("" !== $_POST["name"]) {
			$fields[]	= "name";
			$bindv[]	= $_POST["name"];
		}

		$fields[]	= "description";

		$bindv[]	= $_POST["description"];
		$bindv[]	= $_POST["id"];
	} else {
		$fields = Jaring::$_mod["db_table"]["update"];

		// delete old file content
		$q	=" select path from _media where id = ". $_POST["id"];
		$rs = Jaring::db_execute ($q);

		if (count ($rs) > 0) {
			unlink (APP_PATH ."/". $rs[0]["path"]);
		}

		// update data
		$pi = pathinfo ($_FILES["content"]["name"]);

		$bindv[0]	= ("" === $_POST["name"]
						? $pi["filename"]
						: $_POST["name"]);
		$bindv[1]	= $pi["extension"];
		$bindv[2]	= $_FILES["content"]["size"];
		$bindv[3]	= $_FILES["content"]["type"];
		$bindv[4]	= $_POST["description"];
		$bindv[5]	= Jaring::$_media_dir . $sha1;
	}

	Jaring::db_prepare_update ($table, $fields, $ids);

	Jaring::$_db_ps->execute ($bindv);
	Jaring::$_db_ps->closeCursor ();

	if ($_FILES["content"]["error"] === UPLOAD_ERR_OK) {
		move_uploaded_file ($_FILES["content"]["tmp_name"], APP_PATH ."/". $bindv[5]);
	}

	Jaring::$_out["success"]	= true;
	Jaring::$_out["data"]		= Jaring::$MSG_SUCCESS_UPDATE;
