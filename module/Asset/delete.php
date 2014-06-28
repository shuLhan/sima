<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

foreach ($data as $k => $v) {
	//{{{ delete all file
	$q	="	select	M.path
			from	_media			M
			,		_media_table	MT
			where	M.id		= MT._media_id
			and		MT.table_id	= '". $v["table_id"] ."'
		";

	$rs = Jaring::dbExecute ($q);

	foreach ($rs as $media) {
		$f = APP_PATH ."/". $media["path"];

		if (file_exists ($f)) {
			unlink ($f);
		}
	}
	//}}}

	//{{{ delete data from media
	$q	="	delete from _media
			where	id in
			(
				select	_media_id
				from	_media_table
				where	table_id = '". $v["table_id"] ."'
			)
		";

	Jaring::dbExecute ($q, null, false);
	//}}}

	//{{{ delete data from _media_table
	$bindv		= [];
	$bindv[]	= $v["table_id"];

	$table		= "_media_table";
	$fids		= ["table_id"];

	Jaring::dbPrepareDelete ($table, $fids);
	Jaring::$_db_ps->execute ($bindv);
	Jaring::$_db_ps->closeCursor ();
	//}}}
}

Jaring::handleRequestDelete ($data);
