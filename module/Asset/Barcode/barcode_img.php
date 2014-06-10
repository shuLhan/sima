<?php

define ("APP_PATH", realpath (dirname (__FILE__) ."/../../../") ."/");

function __autoload($class_name) {
	require_once  APP_PATH ."/lib/". $class_name . ".php";
}

require_once APP_PATH ."lib/Image_Barcode2.php";

$code		= $_GET["code"];
$type		= "code128";
$imgtype	= "png";

Image_Barcode2::draw ($code, $type, $imgtype);
