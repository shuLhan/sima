<?php
define ("APP_PATH", realpath (dirname (__FILE__) ."/../") ."/");

function __autoload($class_name) {
	require_once  APP_PATH ."/lib/". $class_name . ".php";
}

Jaring::init ();
if (! isset ($no_cookies)) {
	Jaring::cookies_check ();
}
