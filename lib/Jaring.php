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

	/*
		Module configuration. Set by each modules index.
	*/
	public static $_mod	= [
							"db_table"	=> [
								"name"		=> ""
							,	"id"		=> ["id"]
							,	"read"		=> []
							,	"search"	=> []
							,	"create"	=> []
							,	"update"	=> []
							,	"order"		=> []
							]
						];

	public static $_out	= [
							'success'	=> false
						,	'data'		=> ''
						,	'total'		=> 0
						];

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

	private static function dbExecute ($q)
	{
		$ps = Jaring::$_db->prepare ($q);
		$ps->execute ();
		$rs = $ps->fetchAll (PDO::FETCH_ASSOC);
		$ps->closeCursor ();

		return $rs;
	}

	private static function handleRequestRead ()
	{
		$query	= "'%".$_GET["query"]."%'";
		$start	= (int) $_GET["start"];
		$limit	= (int) $_GET["limit"];

		$qselect	= "	select	". implode (",", Jaring::$_mod["db_table"]["read"]);
		$qfrom		= " from ". Jaring::$_mod["db_table"]["name"];
		$qwhere		= " where ";
		$qorder		= " order by ". implode (",", Jaring::$_mod["db_table"]["order"]);
		$qlimit		= "	limit ". $start .",". $limit;

		foreach (Jaring::$_mod["db_table"]["search"] as $k => $v) {
			if ($k > 0) {
				$qwhere .= " or ";
			}
			$qwhere .= $v ." like ". $query;
		}

		/* Get total rows */
		$qtotal	=" select	COUNT(". Jaring::$_mod["db_table"]["id"][0] .") as total "
				. $qfrom
				. $qwhere;

		/* Get data */
		$qread	= $qselect
				. $qfrom
				. $qwhere
				. $qorder
				. $qlimit;

		Jaring::$_out["total"]		= (int) Jaring::dbExecute ($qtotal)[0]["total"];
		Jaring::$_out["data"]		= Jaring::dbExecute ($qread);
		Jaring::$_out["success"]	= true;
	}

	private static function handleRequestCreate ($data)
	{
		$qbind	= "";

		$nfield	= count (Jaring::$_mod["db_table"]["create"]);
		for ($i = 0; $i < $nfield; $i++) {
			if ($i > 0) {
				$qbind .= ",";
			}
			$qbind .= "?";
		}

		$q	=" insert into ". Jaring::$_mod["db_table"]["name"]
			." (". implode (",", Jaring::$_mod["db_table"]["create"]) .")"
			." values (". $qbind .")";

		$ps = Jaring::$_db->prepare ($q);

		foreach ($data as $d) {
			$bindv = [];

			for ($i = 0; $i < $nfield; $i++) {
				array_push ($bindv, $d[Jaring::$_mod["db_table"]["create"][$i]]);
			}

			$ps->execute ($bindv);
			$ps->closeCursor ();

			unset ($bindv);
		}

		Jaring::$_out['success']	= true;
		Jaring::$_out['data']		= Jaring::$MSG_SUCCESS_CREATE;
	}

	private static function handleRequestUpdate ($data)
	{
		$qupdate=" update	". Jaring::$_mod["db_table"]["name"];
		$qset	=" set ";
		$qwhere	=" where ";

		foreach (Jaring::$_mod["db_table"]["update"] as $k => $v) {
			if ($k > 0) {
				$qset .= ",";
			}
			$qset .= $v ." = ? ";
		}
		foreach (Jaring::$_mod["db_table"]["id"] as $k => $v) {
			if ($k < 0) {
				$qwhere .=" and ";
			}
			$qwhere .= $v ." = ? ";
		}

		$q	= $qupdate
			. $qset
			. $qwhere;

		$ps = Jaring::$_db->prepare ($q);

		foreach ($data as $d) {
			$bindv = [];

			foreach (Jaring::$_mod["db_table"]["update"] as $field) {
				array_push ($bindv, $d[$field]);
			}
			foreach (Jaring::$_mod["db_table"]["id"] as $field) {
				array_push ($bindv, $d[$field]);
			}

			$ps->execute ($bindv);
			$ps->closeCursor ();

			unset ($bindv);
		}

		Jaring::$_out['success']	= true;
		Jaring::$_out['data']		= Jaring::$MSG_SUCCESS_UPDATE;
	}

	private static function handleRequestDelete ($data)
	{
		$qdelete=" delete from ". Jaring::$_mod["db_table"]["name"];
		$qwhere	=" where ";

		foreach (Jaring::$_mod["db_table"]["id"] as $k => $v) {
			if ($k < 0) {
				$qwhere .=" and ";
			}
			$qwhere .= $v ." = ? ";
		}

		$q	= $qdelete . $qwhere;
		$ps	= Jaring::$_db->prepare ($q);

		foreach ($data as $d) {
			$bindv = [];

			foreach (Jaring::$_mod["db_table"]["id"] as $field) {
				array_push ($bindv, $d[$field]);
			}

			$ps->execute ($bindv);
			$ps->closeCursor ();

			unset ($bindv);
		}

		Jaring::$_out['success']	= true;
		Jaring::$_out['data']		= Jaring::$MSG_SUCCESS_DESTROY;
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

			/* Convert json object to array */
			if (null !== $data && ! is_array (current ($data))) {
				$data = array($data);
			}

			switch ($access) {
			case 1:
				$path .= "read.php";
				if (file_exists ($path)) {
					require_once $path;
				} else {
					Jaring::handleRequestRead ();
				}
				break;
			case 2:
				$path .= "create.php";
				if (file_exists ($path)) {
					require_once $path;
				} else {
					Jaring::handleRequestCreate ($data);
				}
				break;
			case 3:
				$path .= "update.php";
				if (file_exists ($path)) {
					require_once $path;
				} else {
					Jaring::handleRequestUpdate ($data);
				}
				break;
			case 4:
				$path .= "delete.php";
				if (file_exists ($path)) {
					require_once $path;
				} else {
					Jaring::handleRequestDelete ($data);
				}
				break;
			}
		} catch (Exception $e) {
			Jaring::$_out['data'] = addslashes ($e->getMessage ());
		}

		header('Content-Type: application/json');
		echo json_encode (Jaring::$_out);
	}
}
