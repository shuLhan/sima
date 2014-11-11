<?php
/*
	Copyright 2014 Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
define ("APP_PATH", realpath (dirname (__FILE__)));

function __autoload($class_name) {
    include  APP_PATH ."/lib/". $class_name . ".php";
}

Jaring::init ();

if (Jaring::$_c_uid != 0) {
	header ("Location:". Jaring::$_mod_main);
} else {
	header ("Location:". Jaring::$_mod_home);
}
