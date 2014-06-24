<?php

require_once "../../../init.php";

Jaring::init ();
Jaring::initDB ();

$q = "select logo_type, logo from _profile";

Jaring::$_db_ps = Jaring::$_db->prepare ($q);

Jaring::$_db_ps->execute ();

Jaring::$_db_ps->bindColumn (1, $type, PDO::PARAM_STR);
Jaring::$_db_ps->bindColumn (2, $lob, PDO::PARAM_LOB);
Jaring::$_db_ps->fetch (PDO::FETCH_BOUND);

header ("Content-Type: $type");
echo $lob;
