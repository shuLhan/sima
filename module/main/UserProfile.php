<?php
require_once "../json_begin.php";

try {
	if ("update" === $_GET['action']) {
		$a = json_decode (http_get_request_body (), true);
	} else {
		$q	="	select		A.id"
			."	,			A.name"
			."	,			A.realname"
			."	,			C.name		as group_name"
			."	from		_user		A"
			."	,			_user_group	B"
			."	,			_group		C"
			."	where		A.id		= ?"
			."	and			A.id		= B._user_id"
			."	and			B._group_id	= C.id";

		$ps = Jaring::$_db->prepare ($q);
		$ps->execute (array (Jaring::$_c_uid));
		$rs = $ps->fetchAll (PDO::FETCH_ASSOC);

		$r['success']	= true;
		$r['data']		= $rs;
		$r['total']		= count ($rs);
	}
} catch (Exception $e) {
	$r['data']		= $e->getMessage ();
}

require_once "../json_end.php";
?>