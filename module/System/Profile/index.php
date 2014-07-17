<?php
/*
	Copyright 2014 Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
require_once "../../init.php";

$fields = [
	"id"
,	"_user_id"
,	"name"
,	"address"
,	"phone_1"
,	"phone_2"
,	"phone_3"
,	"fax"
,	"email"
,	"website"
];

Jaring::$_mod["db_table"]["name"]		= "_profile";
Jaring::$_mod["db_table"]["profile_id"]	= "id";
Jaring::$_mod["db_table"]["read"]		= $fields;
Jaring::$_mod["db_table"]["search"]		= ["name", "address", "email", "website"];
Jaring::$_mod["db_table"]["order"]		= ["id"];
Jaring::$_mod["db_table"]["create"]		= $fields;
Jaring::$_mod["db_table"]["update"]		= array_slice ($fields, 1);
Jaring::$_mod["db_table"]["generate_id"]= null;

function update_logo ()
{
	// Update logo.
	$s = Jaring::request_upload_check_err ("logo");

	if (false === $s) {
		if ($_FILES["logo"]["error"] === UPLOAD_ERR_NO_FILE) {
			return true;
		}
		return false;
	}

	$id = $_POST["id"];
	$q = "update _profile set logo_type = ? , logo = ? where id = ?";

	Jaring::$_db_ps = Jaring::$_db->prepare ($q);

	$fp = fopen ($_FILES["logo"]["tmp_name"], "rb");

	$i = 1;
	Jaring::$_db_ps->bindParam ($i++, $_FILES["logo"]["type"]);
	Jaring::$_db_ps->bindParam ($i++, $fp, PDO::PARAM_LOB);
	Jaring::$_db_ps->bindParam ($i++, $id);

	Jaring::$_db->beginTransaction ();
	Jaring::$_db_ps->execute ();
	Jaring::$_db->commit ();

	return true;
}

function request_create_after ($data)
{
	$s = update_logo ();

	if ($s === false) {
		return false;
	}

	$profile_id = $data[0]["id"];
	$user_id	= $data[0]["_user_id"];
	$gid		= Jaring::db_generate_id ();

	// update user profile id.
	$q = "
		update	_user
		set		_profile_id = ?
		where	id			= ?
		";

	$qbind = array ($profile_id, $user_id);

	Jaring::db_execute ($q, $qbind, false);

	// add group Administrator to group.
	$q	= "
		insert into _group (_profile_id, id, pid, name, type)
		values ($profile_id, $gid, 0, 'Administrator', 0)
		";

	Jaring::db_execute ($q, null, false);

	// add user to group Administrator.
	$id = Jaring::db_generate_id();
	$q	="
		insert into _user_group (_profile_id, id, _user_id, _group_id)
		values ($profile_id, $id, $user_id, $gid)
		";

	Jaring::db_execute ($q, null, false);

	// add menu access.
	$q	="
		insert into _group_menu
			select	$gid, _menu_id, permission
			from	_group_menu
			where	_group_id = 1
		";

	Jaring::db_execute ($q, null, false);
}

function request_update_after ($data)
{
	return update_logo ();
}

function request_delete_before ($data)
{
	foreach ($data as $d) {
		$user_id	= $d["_user_id"];
		$profile_id = $d["id"];

		if ($profile_id === 1) {
			throw new Exception (Jaring::$MSG_DATA_LOCK);
		}

		// delete menu access.
		$q ="
			delete from _group_menu where _group_id in (
				select	id
				from	_group
				where	_profile_id = $profile_id
			)
			";

		Jaring::db_execute ($q, null, false);

		// delete group of user.
		$q =" delete from _user_group where _profile_id = $profile_id";

		Jaring::db_execute ($q, null, false);

		// delete group.
		$q =" delete from _group where _profile_id = $profile_id";

		Jaring::db_execute ($q, null, false);

		// delete user.
		$q =" delete from _user where _profile_id = $profile_id";

		Jaring::db_execute ($q, null, false);
	}

	return true;
}

Jaring::request_handle ("action");
