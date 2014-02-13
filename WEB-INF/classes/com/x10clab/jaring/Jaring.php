<?php
class SafePDO extends PDO
{
	public static function exception_handler($exception)
	{
		// Output the exception details
		die('Uncaught exception: '. $exception->getMessage());
	}

	public function __construct($dsn, $username='', $password='', $driver_options=array())
	{
		// Temporarily change the PHP exception handler while we . . .
		set_exception_handler(array(__CLASS__, 'exception_handler'));

		// . . . create a PDO object
		parent::__construct($dsn, $username, $password, $driver_options);

		// Change the exception handler back to whatever it was before
		restore_exception_handler();
	}
}

class Jaring
{
	public static $MSG_SUCCESS_UPDATE	= 'Data has been updated.';
	public static $MSG_SUCCESS_CREATE	= 'New data has been created.';
	public static $MSG_SUCCESS_DESTROY	= 'Data has been deleted.';
	public static $MOD_INIT				= '/init';

	public static $_ext				= '.php';
	public static $_title			= 'x10c Lab - Jaring Framework';
	public static $_name			= 'jaring';
	public static $_path			= '/stp';
	public static $_path_mod		= '/module';
	public static $_mod_init		= '';
	public static $_content_type	= 0;
	public static $_menu_mode		= 1;
	public static $_paging_size		= 50;
	public static $_db_class		= '';
	public static $_db_url			= '';
	public static $_db_user			= '';
	public static $_db_pass			= '';
	public static $_db_pool_min		= 0;
	public static $_db_pool_max		= 100;
	public static $_db				= null;

	/*
		Cookies values.
		Variables that will be instantiated when calling getCookiesValue.
	*/
	public static $_c_uid			= 0;
	public static $_c_username		= 'Anonymous';

	public static function initDB ()
	{
		self::$_db = new SafePDO (self::$_db_url, self::$_db_user, self::$_db_pass);
		self::$_db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}
	
	public static function getConnection ()
	{
		if (self::_db == null) {
			self::initDB ();
		}
	}
	
	public static function getCookiesValue ()
	{
		$ckey = 'user_id';
		if (isset ($_COOKIE[$ckey])) {
			self::$_c_uid = (int) $_COOKIE[$ckey];
		}

		$ckey = 'user_name';
		if (isset ($_COOKIE[$ckey])) {
			self::$_c_username = $_COOKIE[$ckey];
		}
	}
	
	public static function init ()
	{
		$f_app_conf	= APP_PATH ."/WEB-INF/app.conf";

		$app_conf = parse_ini_file ($f_app_conf);

		self::$_title			= $app_conf['app.title'];
		self::$_name			= $app_conf['app.name'];
		self::$_ext				= $app_conf['app.extension'];
		self::$_path			= $app_conf['app.path'];
		self::$_path_mod		= $app_conf['app.module.dir'];
		self::$_mod_init		= self::$_path . self::$_path_mod . self::$MOD_INIT . self::$_ext;
		self::$_content_type	= $app_conf['app.content.type'];
		self::$_menu_mode		= $app_conf['app.menu.mode'];
		self::$_paging_size		= $app_conf['app.paging.size'];
		self::$_db_class		= $app_conf['db.class'];
		self::$_db_url			= $app_conf['db.url'];
		self::$_db_user			= $app_conf['db.username'];
		self::$_db_pass			= $app_conf['db.password'];
		self::$_db_pool_min		= $app_conf['db.pool.min'];
		self::$_db_pool_max		= $app_conf['db.pool.max'];

		Jaring::getCookiesValue ();
	}
}
?>