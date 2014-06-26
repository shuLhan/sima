<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
$data = $data[0];

//{{{ delete all file
$q	="	select	M.path
		from	_media			M
		,		_media_table	MT
		where	M.id		= MT._media_id
		and		MT.table_id	= '". $data["table_id"] ."'"
	;

$rs = Jaring::dbExecute ($q);

foreach ($rs as $k => $v) {
	$f = APP_PATH ."/". $v["path"];

	if (file_exists ($f)) {
		unlink ($f);
	}
}
//}}}

//{{{ delete data from _media_table
$bindv		= [];
$bindv[]	= $data["table_id"];
$bindv[]	= $data["_media_id"];

$table		= "_media_table";
$fids		= ["table_id", "_media_id"];

Jaring::dbPrepareDelete ($table, $fids);
Jaring::$_db_ps->execute ($bindv);
Jaring::$_db_ps->closeCursor ();
//}}}

//{{{ delete data from media
$q =" delete from _media where id = ". $data["_media_id"];
Jaring::dbExecute ($q, null, false);
//}}}

Jaring::$_out['success']	= true;
Jaring::$_out['data']		= Jaring::$MSG_SUCCESS_DESTROY;
