<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
	Jaring::dbPrepareInsert (Jaring::$_mod["db_table"]["name"]
							,Jaring::$_mod["db_table"]["create"]);

	$pi = pathinfo ($_FILES["content"]["name"]);

	$bindv		= [];
	$bindv[0]	= ("" === $_POST["name"]
					? $pi["filename"]
					: $_POST["name"]);
	$bindv[1]	= $pi["extension"];
	$bindv[2]	= $_FILES["content"]["size"];
	$bindv[3]	= $_FILES["content"]["type"];
	$bindv[4]	= $_POST["description"];
	$bindv[5]	= Jaring::$_media_dir ."/". sha1_file ($_FILES["content"]["tmp_name"]);

	Jaring::$_db_ps->execute ($bindv);
	Jaring::$_db_ps->closeCursor ();

	move_uploaded_file ($_FILES["content"]["tmp_name"], APP_PATH ."/". $bindv[5]);

	Jaring::$_out["success"]	= true;
	Jaring::$_out["data"]		= Jaring::$MSG_SUCCESS_CREATE;
