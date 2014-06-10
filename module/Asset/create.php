<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
//{{{ generate uniq id for each data
foreach ($data as &$v) {
	$v["barcode"] = uniqid ();
}
//}}}

//{{{ save it to database
Jaring::handleRequestCreate ($data);
//}}}
