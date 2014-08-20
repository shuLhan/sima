<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
	Jaring::db_prepare_insert (Jaring::$_mod["db_table"]["name"]
							,Jaring::$_mod["db_table"]["create"]);

	$pi = pathinfo ($_FILES["content"]["name"]);
	$fupath = Jaring::$_media_dir . sha1_file ($_FILES["content"]["tmp_name"]);

	$bindv		= [];
	$bindv[]	= Jaring::$_c_profile_id;
	$bindv[]	= Jaring::db_generate_id ();
	$bindv[]	= ("" === $_POST["name"]
					? $pi["filename"]
					: $_POST["name"]);
	$bindv[]	= $pi["extension"];
	$bindv[]	= $_FILES["content"]["size"];
	$bindv[]	= $_FILES["content"]["type"];
	$bindv[]	= $_POST["description"];
	$bindv[]	= $fupath;

	Jaring::$_db_ps->execute ($bindv);
	Jaring::$_db_ps->closeCursor ();

	move_uploaded_file ($_FILES["content"]["tmp_name"], APP_PATH ."/". $fupath);

	Jaring::$_out["success"]	= true;
	Jaring::$_out["data"]		= Jaring::$MSG_SUCCESS_CREATE;
