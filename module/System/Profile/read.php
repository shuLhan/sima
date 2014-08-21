<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
$query		= "'%".$_GET["query"]."%'";
$start		= (int) $_GET["start"];
$limit		= (int) $_GET["limit"];
$f_reads	= self::$_mod["db_table"]["read"];
$f_search	= self::$_mod["db_table"]["search"];
$f_order	= self::$_mod["db_table"]["order"];
$tables		= array (
				self::$_mod["db_table"]["name"]
			,	"_profile_admin"
			);

$f_profile_id	= Jaring::$_mod["db_table"]["profile_id"];
$q_select		= "	select ". implode (",", $f_reads);
$q_from			= " from ". implode (",", $tables);
$q_where		= " where _profile.id = _profile_admin._profile_id ";
$q_order		= " order by ". implode (",", $f_order);
$q_limit		= "	limit ". $start .",". $limit;

// check if table is profiled.
if (Jaring::$_mod["db_table"]["profiled"]
&&  Jaring::$_c_profile_id !== "1") {
	$q_where .= " and $f_profile_id = ". Jaring::$_c_profile_id;
}

// get parameter name that has the same name with read fields,
// and use it as the filter
foreach ($f_reads as $v) {
	if (! array_key_exists ($v, $_GET)) {
		continue;
	}

	$q_where .=" and $v = ";

	if (is_numeric ($_GET[$v])) {
		$q_where .= $_GET[$v];
	} else {
		$q_where .= "'". $_GET[$v] ."'";
	}
}

// add filter by search field
if (count ($f_search) > 0) {
	$q_where .=" and (";
}

foreach ($f_search as $k => $v) {
	if ($k > 0) {
		$q_where .= " or ";
	}
	$q_where .= " $v like $query ";
}

if (count ($f_search) > 0) {
	$q_where .= ")";
}

// Get total rows
$q_total	=" select	COUNT(". self::$_mod["db_table"]["id"][0] .") as total "
			. $q_from
			. $q_where;

// Get data
$q_read	= $q_select
		. $q_from
		. $q_where
		. $q_order
		. $q_limit;

self::$_out["total"]	= (int) self::db_execute ($q_total)[0]["total"];
self::$_out["data"]		= self::db_execute ($q_read);
self::$_out["success"]	= true;

if (function_exists ("request_read_after")) {
	request_read_after (self::$_out["data"]);
}
