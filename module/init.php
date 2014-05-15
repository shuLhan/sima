<?php
define ("APP_PATH", realpath (dirname (__FILE__) ."/../") ."/");

function __autoload($class_name) {
	require_once  APP_PATH ."/lib/". $class_name . ".php";
}

Jaring::init ();

$m_home	= Jaring::$_path . Jaring::$_path_mod ."/home/";

if (Jaring::$_c_uid === 0 && strpos ($_SERVER['REQUEST_URI'], $m_home)) {
	header ("Location:". $m_home);
	die ();
}
?>
