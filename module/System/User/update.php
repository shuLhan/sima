<?php
/*
	Copyright 2014 Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
$q	="
	update	_user
	set		name		= ?
	,		realname	= ?
	,		password	= ?
	where	id			= ?
	";

$ps = Jaring::$_db->prepare ($q);

foreach ($data as $user) {
	$bindv = [];
	$id = $user['id'];

	if ($id <= 0) {
		throw new Exception ("Invalid user ID (". $id .") !");
	}

	$password = $user['password'];

	if (empty ($password)) {
		$password = $user['password_old'];
	} else {
		$password = hash ("sha256", $user['password']);
	}

	array_push ($bindv, $user["name"]);
	array_push ($bindv, $user["realname"]);
	array_push ($bindv, $password);
	array_push ($bindv, $id);

	$ps->execute ($bindv);

	$ps->closeCursor ();
}

Jaring::$_out['success']	= true;
Jaring::$_out['data']		= Jaring::$MSG_SUCCESS_UPDATE;
