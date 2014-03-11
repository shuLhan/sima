<?php
require_once "../json_begin.php";

try {
	if (! isset ($_POST['username'])
	||  ! isset ($_POST['password'])) {
		throw new Exception ("Invalid username or password!");
	}
	
	$q	="	select	id"
		."	,		realname"
		."	,		status"
		."	from	_user"
		."	where	name		= ? " 
		."	and		password	= ? ";

	$ps = Jaring::$_db->prepare ($q);
	$ps->execute (array ($_POST['username'], hash ("sha256", $_POST['password'])));
	$rs = $ps->fetchAll ();
	$ps->closeCursor ();

	if (count ($rs) === 0) {
		throw new Exception ("Invalid username or password!");
	}
	
	if ($rs[0]['status'] == 0) {
		throw new Exception ("User has not been activated, please contact Administrator.");
	}

	$q	="	update	_user"
		."	set		last_login	= ". mktime ()
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