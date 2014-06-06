<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

// delete data from _media_table
$bindv		= [];
$bindv[]	= $_POST["table_id"];
$bindv[]	= $_POST["_media_id"];

$table		= "_media_table";
$fids		= ["table_id", "_media_id"];

Jaring::dbPrepareDelete ($table, $fids);
Jaring::$_db_ps->execute ($bindv);
Jaring::$_db_ps->closeCursor ();

// delete data from media
$q	=" delete from _media where id = ". $bindv[1];

Jaring::dbExecute ($q);

Jaring::$_out['success']	= true;
Jaring::$_out['data']		= Jaring::$MSG_SUCCESS_DESTROY;
