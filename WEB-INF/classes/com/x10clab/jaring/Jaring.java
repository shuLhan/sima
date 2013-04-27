package com.x10clab.jaring;

import java.io.File;
import java.io.FileInputStream;
import java.util.Properties;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.SQLException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.ServletContext;

import com.jolbox.bonecp.BoneCP;
import com.jolbox.bonecp.BoneCPConfig;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

public class Jaring {
	public static String	_title			= "x10c Lab - Jaring Framework";
	public static String	_name			= "jaring";
	public static String	_path			= "/jaring";
	public static String	_path_mod		= "/module";
	public static int		_content_type	= 0;
	public static int		_paging_size	= 50;
	public static String	_db_class		= "";
	public static String	_db_url			= "";
	public static String	_db_user		= "";
	public static String	_db_pass		= "";
	public static int		_db_pool_min	= 10;
	public static int		_db_pool_max	= 100;
	private static BoneCP	_db_pool		= null;

	/*
		Cookies values.
		Variables that will be instatited when calling getCookiesValue.
	*/
	public static long		_c_uid			= 0;

	/*
		Initialize database connection pooling
	*/
	public static void initDBPool (HttpServletRequest request)
	{
		if (null != _db_pool) {
			return;
		}

		try {
			BoneCPConfig config	= new BoneCPConfig();

			Class.forName (Jaring._db_class);

			config.setJdbcUrl (Jaring._db_url);
			config.setUsername (Jaring._db_user);
			config.setPassword (Jaring._db_pass);
			config.setMinConnectionsPerPartition (Jaring._db_pool_min);
			config.setMaxConnectionsPerPartition (Jaring._db_pool_max);
			config.setPartitionCount (1);

			_db_pool = new BoneCP (config);

		} catch (Exception e) {
			e.printStackTrace ();
			return;
		}
	}

	/*
		Get one database connection from connection-pool.
	*/
	public static Connection getConnection (HttpServletRequest request)
	{
		try {
			if (null == _db_pool) {
				Jaring.initDBPool (request);
			}

			return Jaring._db_pool.getConnection ();
		} catch (Exception e) {
			e.printStackTrace ();
			return null;
		}
	}

	/*
		Get cookies values.
	*/
	public static void getCookiesValue (HttpServletRequest request)
	{
		Cookie[]	_cookies	= request.getCookies ();

		if (null != _cookies) {
			for (int i = 0; i < _cookies.length; i++) {
				String	c_name = _cookies[i].getName ();
				if (c_name.equalsIgnoreCase (Jaring._name +".user.id")) {
					Jaring._c_uid = Integer.parseInt (_cookies[i].getValue ());
				}
			}
		}
	}

	/*
		Get module permission.
	*/
	public static int getModulePermission (HttpServletRequest request, int menu_id)
	{
		Connection			con = null;
		PreparedStatement	ps	= null;
		ResultSet			rs	= null;
		String				q	= "";
		int					i	= 0;
		int					perm= 0;

		try {
			con = Jaring.getConnection (request);

			/* get cookie value for user ID */
			Jaring.getCookiesValue (request);

			q	="	select	A.permission"
				+"	from	_group_menu	A"
				+"	,		_user_group	B"
				+"	where	A._menu_id	= ?"
				+"	and		A._group_id	= B._group_id"
				+"	and		B._user_id	= ?"
				+"	order by A.permission desc";

			ps	= con.prepareStatement (q);
			i	= 1;
			ps.setLong (i++	, menu_id);
			ps.setLong (i++	, Jaring._c_uid);

			rs	= ps.executeQuery ();

			if (rs.next ()) {
				perm = rs.getInt ("permission");
			}

			rs.close ();
			ps.close ();
			con.close ();
		} catch (Exception e) {
			/**/
		} finally {
			return perm;
		}
	}

	/*
		Get parameter in number format.
	*/
	public static int getIntParameter (HttpServletRequest request
										, String paramName
										, int defaultValue) {
		String	paramString = request.getParameter (paramName);
		int		paramValue	= defaultValue;
		try {
			paramValue = Integer.parseInt (paramString);
		} catch (NumberFormatException nfe) { // Handles null and bad format
			paramValue = defaultValue;
		}
		return (paramValue);
	}

	/*
		Initialize application
	*/
	public static void init (ServletContext application, HttpServletRequest request)
	{
		try {
			/* Load application configuration */
			String			app_conf		= application.getRealPath ("WEB-INF"+ File.separator +"app.conf");
			FileInputStream	fis				= new FileInputStream (app_conf);
			Properties		props			= new Properties ();

			props.load (fis);

			Jaring._path		= application.getContextPath ();
			Jaring._title		= props.getProperty ("app.title");
			Jaring._name		= props.getProperty ("app.name");
			Jaring._path_mod	= props.getProperty ("app.module.dir");
			Jaring._content_type= Integer.parseInt (props.getProperty ("app.content.type"));
			Jaring._paging_size	= Integer.parseInt (props.getProperty ("app.paging.size"));
			Jaring._db_class	= props.getProperty ("db.class");
			Jaring._db_url		= props.getProperty ("db.url");
			Jaring._db_user		= props.getProperty ("db.username");
			Jaring._db_pass		= props.getProperty ("db.password");
			Jaring._db_pool_min	= Integer.parseInt (props.getProperty ("db.pool.min"));
			Jaring._db_pool_max	= Integer.parseInt (props.getProperty ("db.pool.max"));

			/* Always replace global config variables, in case user change it on the fly */
			application.setAttribute ("app.title"		, Jaring._title);
			application.setAttribute ("app.name"		, Jaring._name);
			application.setAttribute ("app.path"		, Jaring._path);
			application.setAttribute ("app.module.dir"	, Jaring._path_mod);
			application.setAttribute ("app.content.type", Jaring._content_type);
			application.setAttribute ("app.paging.size"	, Jaring._paging_size);
			application.setAttribute ("db.class"		, Jaring._db_class);
			application.setAttribute ("db.url"			, Jaring._db_url);
			application.setAttribute ("db.username"		, Jaring._db_user);
			application.setAttribute ("db.password"		, Jaring._db_pass);
			application.setAttribute ("db.pool.min"		, Jaring._db_pool_min);
			application.setAttribute ("db.pool.max"		, Jaring._db_pool_max);

			/* Initialize database connection-pool */
			initDBPool (request);
		} catch (Exception e) {
			e.printStackTrace ();
		}
	}
}
