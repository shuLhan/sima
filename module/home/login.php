<?php
/*
	Copyright 2014 Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
require_once "../json_begin.php";

try {
	$data = json_decode (file_get_contents('php://input'), true);

	if (! isset ($data['username'])
	||  ! isset ($data['password'])) {
		throw new Exception ("Invalid username or password!");
	}

	// check if username and password is exist in database.
	$q	="
		select	id
		,		realname
		,		status
		,		_profile_id
		from	_user
		where	name		= ?
		and		password	= ?
		";

	$ps = Jaring::$_db->prepare ($q);
	$ps->execute (array ($data['username'], hash ("sha256", $data['password'])));
	$rs = $ps->fetchAll ();
	$ps->closeCursor ();

	if (count ($rs) === 0) {
		throw new Exception ("Invalid username or password!");
	}

	if ($rs[0]['status'] == 0) {
		throw new Exception ("User is not active, please contact Administrator.");
	}

	// Update last login timestamp.
	$q	="
		update	_user
		set		last_login	= ". time () ."
		where	id			= ?
		";

	$ps = Jaring::$_db->prepare ($q);
	$ps->bindValue (1, $rs[0]['id']);
	$ps->execute ();

	// Set cookies values.
	setcookie ("user_id", $rs[0]['id'], 0, Jaring::$_path);
	setcookie ("user_name", $rs[0]['realname'], 0, Jaring::$_path);
	setcookie ("profile_id", $rs[0]["_profile_id"], 0, Jaring::$_path);

	$r['success']	= true;
	$r['data']		= "Logging in ...";
} catch (Exception $e) {
	$r['data']		= $e->getMessage ();
}

require_once "../json_end.php";
