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

	$q	="	select	id"
		."	,		realname"
		."	,		status"
		."	from	_user"
		."	where	name		= ? "
		."	and		password	= ? ";

	$ps = Jaring::$_db->prepare ($q);
	$ps->execute (array ($data['username'], hash ("sha256", $data['password'])));
	$rs = $ps->fetchAll ();
	$ps->closeCursor ();

	if (count ($rs) === 0) {
		throw new Exception ("Invalid username or password!");
	}

	if ($rs[0]['status'] == 0) {
		throw new Exception ("User has not been activated, please contact Administrator.");
	}

	$q	="	update	_user"
		."	set		last_login	= ". time ()
		."	where	id			= ?";

	$ps = Jaring::$_db->prepare ($q);
	$ps->bindValue (1, (int) $rs[0]['id'], PDO::PARAM_INT);
	$ps->execute ();

	setcookie ("user.id", $rs[0]['id'], 0, Jaring::$_path);
	setcookie ("user.name", $rs[0]['realname'], 0, Jaring::$_path);

	$r['success']	= true;
	$r['data']		= "Logging in ...";
} catch (Exception $e) {
	$r['data']		= $e->getMessage ();
}

require_once "../json_end.php";
