<?php
/*
	Copyright 2014 Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
$q	="
	insert into _user (
		id
	,	name
	,	realname
	,	password
	) values ( ? , ? , ? , ? )
	";

$ps = Jaring::$_db->prepare ($q);

foreach ($data as $user) {
	$ps->execute (array (
			Jaring::db_generate_id ()
		,	$user['name']
		,	$user['realname']
		,	hash ("sha256", $user['password'])
		)
	);
	$ps->closeCursor ();
}

Jaring::$_out['success']	= true;
Jaring::$_out['data']		= Jaring::$MSG_SUCCESS_CREATE;
