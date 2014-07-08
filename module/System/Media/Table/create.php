<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
	// insert into media table
	$table	= "_media";
	$fields	= [ "id", "name", "extension", "size", "mime", "path" ];
	$fupath	= Jaring::$_media_dir . sha1_file ($_FILES["content"]["tmp_name"]);

	Jaring::db_prepare_insert ($table, $fields);

	$pi = pathinfo ($_FILES["content"]["name"]);

	$bindv		= [];
	$bindv[]	= Jaring::db_generate_id ();
	$bindv[]	= $pi["filename"];
	$bindv[]	= $pi["extension"];
	$bindv[]	= $_FILES["content"]["size"];
	$bindv[]	= $_FILES["content"]["type"];
	$bindv[]	= $fupath;

	Jaring::$_db_ps->execute ($bindv);
	Jaring::$_db_ps->closeCursor ();

	move_uploaded_file ($_FILES["content"]["tmp_name"], APP_PATH ."/". $fupath);

	// link media id into table _media_table
	$id		= $bindv[0];

	$table	= "_media_table";
	$fields	= [ "table_id", "_media_id" ];
	$bindv	= [
				$_POST["table_id"]
			,	$id
			];

	Jaring::db_prepare_insert ($table, $fields);
	Jaring::$_db_ps->execute ($bindv);
	Jaring::$_db_ps->closeCursor ();

	Jaring::$_out["success"]	= true;
	Jaring::$_out["data"]		= Jaring::$MSG_SUCCESS_CREATE;
