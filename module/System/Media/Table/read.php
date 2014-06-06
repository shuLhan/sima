<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
$query	= "'%".$_GET["query"]."%'";
$start	= (int) $_GET["start"];
$limit	= (int) $_GET["limit"];
$fread	= Jaring::$_mod["db_table"]["read"];

$qselect	= " select ". implode (",", $fread);
$qfrom		= " from ". implode (",", Jaring::$_mod["db_table"]["name"]);
$qwhere		= " where 1 = 1 ";
$qorder		= " order by ". implode (",", Jaring::$_mod["db_table"]["order"]);
$qlimit		= " limit ". $start .",". $limit;

// generate relationship
foreach (Jaring::$_mod["db_table"]["relation"] as $k => $v) {
	if (! is_array ($v)) {
		continue;
	}
	if (count ($v) < 2) {
		continue;
	}
	$qwhere .= " and ". $v[0] ." = ". $v[1];
}

// find GET parameter that match with table fields
// and use it's value to filter data
foreach ($fread as $v) {
	$f = explode (".", $v)[1];
	if (array_key_exists ($f, $_GET)) {
		$x = $_GET[$f];
		if (! is_numeric ($x)) {
			$x = "'". $x ."'";
		}
		$qwhere .=" and ". $v ." = ". $x;
	}
}

// generate filter
$qwhere .= " and ( ";

foreach (Jaring::$_mod["db_table"]["search"] as $k => $v) {
	if ($k > 0) {
		$qwhere .= " or ";
	}
	$qwhere .= $v ." like ". $query;
}

$qwhere .= " ) ";

// Get total rows
$qtotal	=" select COUNT(". Jaring::$_mod["db_table"]["id"][0] .") as total "
		. $qfrom
		. $qwhere;

// Get data
$qread	= $qselect
		. $qfrom
		. $qwhere
		. $qorder
		. $qlimit;

Jaring::$_out["total"]		= (int) Jaring::dbExecute ($qtotal)[0]["total"];
Jaring::$_out["data"]		= Jaring::dbExecute ($qread);
Jaring::$_out["success"]	= true;
