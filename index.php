<?php
define ("APP_PATH", realpath (dirname (__FILE__)));

function __autoload($class_name) {
    include  APP_PATH ."/WEB-INF/classes/com/x10clab/jaring/". $class_name . ".php";
}

Jaring::init ();

$m_main = Jaring::$_path . Jaring::$_path_mod ."/main/";
$m_home = Jaring::$_path . Jaring::$_path_mod ."/home/";

if (Jaring::$_c_uid != 0) {
	header ("Location:". $m_main);
} else {
	header ("Location:". $m_home);
}

die ();