<?php
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

require_once "../init.php";

$fields = [
	"id"
,	"type_id"
,	"merk"
,	"model"
,	"sn"
,	"barcode"
,	"service_tag"
,	"label"
,	"detail"
,	"warranty_length"
,	"warranty_info"
,	"procurement_id"
,	"procurement_date"
,	"procurement_company"
,	"procurement_price"
,	"table_id"
];

Jaring::$_mod["db_table"]["name"]	= "asset";
Jaring::$_mod["db_table"]["id"]		= ["id"];
Jaring::$_mod["db_table"]["read"]	= $fields;
Jaring::$_mod["db_table"]["search"]	= [
	"merk"
,	"model"
,	"sn"
,	"barcode"
,	"service_tag"
,	"label"
,	"detail"
,	"procurement_company"
];
Jaring::$_mod["db_table"]["create"]	= array_slice ($fields, 1);
Jaring::$_mod["db_table"]["update"]	= array_slice ($fields, 1);
Jaring::$_mod["db_table"]["order"]	= ["id"];

Jaring::handleRequest ("crud");
