<?php
require_once "../init.php";

Jaring::$_mod["db_table"]["name"]	= "asset";
Jaring::$_mod["db_table"]["id"]		= ["id"];
Jaring::$_mod["db_table"]["read"]	= [
	"id"
,	"type_id"
,	"merk"
,	"model"
,	"sn"
,	"barcode"
,	"service_tag"
,	"label"
,	"detail"
,	"warranty_date"
,	"warranty_length"
,	"warranty_info"
,	"procurement_id"
,	"company"
,	"price"
,	"status_id"
,	"_user_id"
,	"location_id"
,	"location_detail"
,	"maintenance_info"
];
Jaring::$_mod["db_table"]["search"]	= [
	"merk"
,	"model"
,	"sn"
,	"barcode"
,	"service_tag"
,	"label"
,	"detail"
,	"company"
,	"location_detail"
,	"maintenance_info"
];
Jaring::$_mod["db_table"]["create"]	= [
	"type_id"
,	"merk"
,	"model"
,	"sn"
,	"barcode"
,	"service_tag"
,	"label"
,	"detail"
,	"warranty_date"
,	"warranty_length"
,	"warranty_info"
,	"procurement_id"
,	"company"
,	"price"
,	"status_id"
,	"_user_id"
,	"location_id"
,	"location_detail"
,	"maintenance_info"
];
Jaring::$_mod["db_table"]["update"]	= [
	"type_id"
,	"merk"
,	"model"
,	"sn"
,	"barcode"
,	"service_tag"
,	"label"
,	"detail"
,	"warranty_date"
,	"warranty_length"
,	"warranty_info"
,	"procurement_id"
,	"company"
,	"price"
,	"status_id"
,	"_user_id"
,	"location_id"
,	"location_detail"
,	"maintenance_info"
];
Jaring::$_mod["db_table"]["order"]	= ["id"];

Jaring::handleRequest ();
