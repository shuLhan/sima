package com.x10clab.jaring;

import java.io.File;
import java.io.FileInputStream;
import java.util.Properties;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.ServletContext;

import com.jolbox.bonecp.BoneCP;
import com.jolbox.bonecp.BoneCPConfig;

public class Jaring {
	public static String	_name			= "jaring";
	public static String	_path			= "/jaring";
	public static String	_path_mod		= "/module";
	public static String	_db_class		= "";
	public static String	_db_url			= "";
	public static String	_db_user		= "";
	public static String	_db_pass		= "";
	public static int		_db_pool_min	= 10;
	public static int		_db_pool_max	= 100;

	private static BoneCP	_db_pool		= null;

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
			Jaring._name		= props.getProperty ("app.name");
			Jaring._path_mod	= props.getProperty ("app.module.dir");
			Jaring._db_class	= props.getProperty ("db.class");
			Jaring._db_url		= props.getProperty ("db.url");
			Jaring._db_user		= props.getProperty ("db.username");
			Jaring._db_pass		= props.getProperty ("db.password");
			Jaring._db_pool_min	= Integer.parseInt (props.getProperty ("db.pool.min"));
			Jaring._db_pool_max	= Integer.parseInt (props.getProperty ("db.pool.max"));

			/* Always replace global config variables, in case user change it on the fly */
			application.setAttribute ("app.name"		, Jaring._name);
			application.setAttribute ("app.path"		, Jaring._path);
			application.setAttribute ("app.module.dir"	, Jaring._path_mod);
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
