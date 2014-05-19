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
	public static $MSG_ACCESS_FAIL		= "You don't have sufficient privilege.";
	public static $MSG_REQUEST_INVALID	= "Invalid request ";
	public static $MOD_INIT				= '/init';

	public static $ACCESS_NO		= 0;
	public static $ACCESS_READ		= 1;
	public static $ACCESS_CREATE	= 2;
	public static $ACCESS_UPDATE	= 3;
	public static $ACCESS_DELETE	= 4;

	public static $_ext				= '.php';
	public static $_title			= 'Jaring Framework';
	public static $_name			= 'jaring';
	public static $_path			= '/';
	public static $_path_mod		= 'module';
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

	public static $_out				= array (
										'success'	=> false
									,	'data'		=> ''
									,	'total'		=> 0
									);

	/*
		Cookies values.
		Variables that will be instantiated when calling getCookiesValue.
	*/
	public static $_c_uid			= 0;
	public static $_c_username		= 'Anonymous';

	public static function checkAccess ($mod, $uid, $access)
	{
		$q	="
				select	GM.permission
				from	_user			U
				,		_group			G
				,		_user_group		UG
				,		_menu			M
				,		_group_menu		GM
				where	GM._group_id	= G.id
				and		GM._menu_id		= M.id
				and		UG._group_id	= G.id
				and		UG._user_id		= U.id
				and		M.module		= '". $mod ."'
				and		U.id			= ". $uid ."
				order by GM.permission desc
				limit	0,1
			";

		try {
			$ps = Jaring::$_db->prepare($q);
			$ps->execute ();
			$rs = $ps->fetchAll (PDO::FETCH_ASSOC);
			$ps->closeCursor ();

			if (count ($rs) <= 0) {
				return false;
			}
			if (((int) $rs[0]["permission"]) >= $access) {
				return true;
			}
		} catch (Exception $e) {
			return false;
		}

		return false;
	}

	public static function initDB ()
	{
		if (stristr(self::$_db_url, "sqlite") !== FALSE) {
			self::initSqliteDb ();
		} else {
			self::$_db = new SafePDO (self::$_db_url, self::$_db_user, self::$_db_pass);
			self::$_db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		}
	}

	public static function initSqliteDb ()
	{
		/* Check if sqlite is file or memory. */
		$a = explode(":", self::$_db_url);

		/* sqlite is file based */
		if (count ($a) === 2) {
			$a[1] = $f_db	= APP_PATH . $a[1];
			self::$_db_url	= implode (":", $a);

			if (file_exists ($f_db)) {
				self::$_db = new SafePDO (self::$_db_url);
				self::$_db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

				return;
			}
		}

		self::$_db = new SafePDO (self::$_db_url);
		self::$_db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

		/* Populate new database file. */
		$f_sql		= APP_PATH ."/db/init.sqlite.sql";
		$f_sql_v	= file_get_contents($f_sql);
		$queries	= explode (";", $f_sql_v);

		foreach ($queries as $q) {
			$q	.= ";";
			self::$_db->exec ($q);
		}

		$f_sql		= APP_PATH ."/db/init.dml.sql";
		$f_sql_v	= file_get_contents($f_sql);
		$queries	= explode (";", $f_sql_v);

		foreach ($queries as $q) {
			$q	.= ";";
			self::$_db->exec ($q);
		}
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

	public static function checkCookies ()
	{
		$m_home	= Jaring::$_path . Jaring::$_path_mod ."/home/";

		if (Jaring::$_c_uid === 0 && strpos ($_SERVER['REQUEST_URI'], $m_home)) {
			header ("Location:". $m_home);
			die ();
		}
	}

	public static function init ()
	{
		$f_app_conf	= APP_PATH ."/app.conf";

		if (!file_exists($f_app_conf)) {
			$f_app_conf = APP_PATH . "/app.default.conf";
		}

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
		self::$_db_url			= $app_conf['db.url'];
		self::$_db_user			= $app_conf['db.username'];
		self::$_db_pass			= $app_conf['db.password'];
		self::$_db_pool_min		= $app_conf['db.pool.min'];
		self::$_db_pool_max		= $app_conf['db.pool.max'];

		Jaring::getCookiesValue ();
	}

	public static function handleRequest ()
	{
		$i		= 1;
		$q		= "";
		$t		= 0;

		$method	= $_SERVER["REQUEST_METHOD"];
		$uri	= explode ("?", $_SERVER["REQUEST_URI"])[0];
		$path	= APP_PATH.$uri;
		$access	= Jaring::$ACCESS_NO;
		$module	= trim (
					str_replace (
						"/"
					,	"_"
					,	substr (
							strstr (
								$uri
							,	self::$_path_mod
							)
						,	strlen(self::$_path_mod)
						)
					)
				,	"_"
				);

		try {
			Jaring::initDB ();

			switch ($method) {
			case "GET":
				$access	= Jaring::$ACCESS_READ;
				break;
			case "POST":
				$access	= Jaring::$ACCESS_CREATE;
				break;
			case "PUT":
				$access	= Jaring::$ACCESS_UPDATE;
				break;
			case "DELETE":
				$access	= Jaring::$ACCESS_DELETE;
				break;
			default:
				Jaring::$_out["data"]	= Jaring::$MSG_REQUEST_INVALID
										. $_SERVER["REQUEST_METHOD"];
				break;
			}

			$s = Jaring::checkAccess ($module, Jaring::$_c_uid, $access);

			if (false === $s) {
				throw new Exception (Jaring::$MSG_ACCESS_FAIL);
			}

			$data = json_decode (file_get_contents('php://input'), true);

			switch ($access) {
			case 1:
				require_once $path."read.php";
				break;
			case 2:
				require_once $path."create.php";
				break;
			case 3:
				require_once $path."update.php";
				break;
			case 4:
				require_once $path."delete.php";
				break;
			}
		} catch (Exception $e) {
			Jaring::$_out['data'] = $e->getMessage ();
		}

		header('Content-Type: application/json');
		echo json_encode (Jaring::$_out);
	}
}
