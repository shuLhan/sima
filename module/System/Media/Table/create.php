<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
	// insert into media table
	$table	= "_media";
	$fields	= [ "name", "extension", "size", "mime", "path" ];

	Jaring::dbPrepareInsert ($table, $fields);

	$pi = pathinfo ($_FILES["content"]["name"]);

	$bindv		= [];
	$bindv[]	= $pi["filename"];
	$bindv[]	= $pi["extension"];
	$bindv[]	= $_FILES["content"]["size"];
	$bindv[]	= $_FILES["content"]["type"];
	$bindv[]	= Jaring::$_media_dir . sha1_file ($_FILES["content"]["tmp_name"]);

	Jaring::$_db_ps->execute ($bindv);
	Jaring::$_db_ps->closeCursor ();

	move_uploaded_file ($_FILES["content"]["tmp_name"], APP_PATH ."/". $bindv[4]);

	// link media id into table _media_table
	$id = Jaring::get_last_insert_id ($table, "id", $fields, $bindv);

	$table	= "_media_table";
	$fields	= [ "table_id", "_media_id" ];
	$bindv	= [
				$_POST["table_id"]
			,	$id
			];

	Jaring::dbPrepareInsert ($table, $fields);
	Jaring::$_db_ps->execute ($bindv);
	Jaring::$_db_ps->closeCursor ();

	Jaring::$_out["success"]	= true;
	Jaring::$_out["data"]		= Jaring::$MSG_SUCCESS_CREATE;
