<%@ include file="../init.jsp" %>
<%@ page contentType="application/json" %>
<%!
	private JSONArray getMenu (Connection db_con, long _uid, int pid)
	{
		JSONArray			tbar	= new JSONArray ();
		JSONObject			menu	= null;
		JSONArray			submenu	= null;
		String				q		= "";
		PreparedStatement	ps		= null;
		ResultSet			rs		= null;
		int					i		= 0;

		q	="	select 	A.id"
			+"	,		A.pid"
			+"	,		A.label"
			+"	,		A.icon"
			+"	,		A.module"
			+"	,		max (B.permission) permission"
			+"	from	_menu			A"
			+"	,		_group_menu		B"
			+"	,		_user_group		C"
			+"	where	A.pid			= ?"
			+"	and		A.id			= B._menu_id"
			+"	and		B._group_id		= C._group_id"
			+"	and		C._user_id		= ?"
			+"	and		B.permission	> 0"
			+"	group by A.id"
			+"	order by A.id";

		try {
			ps	= db_con.prepareStatement (q);
			i	= 1;
			ps.setInt (i++	, pid);
			ps.setLong (i++	,_uid);

			rs	= ps.executeQuery ();

			while (rs.next ()) {
				menu	= new JSONObject ();

				menu.put ("menu_id"		, rs.getInt ("id"));
				menu.put ("menu_pid"	, rs.getInt ("pid"));
				menu.put ("text"		, rs.getString ("label"));
				menu.put ("iconCls"		, rs.getString ("icon"));
				menu.put ("module"		, rs.getString ("module"));
				menu.put ("permission"	, rs.getString ("permission"));
				menu.put ("enableToggle", true);

				submenu = getMenu (db_con, _uid, rs.getInt ("id"));

				if (submenu.size () > 0) {
					menu.put ("arrowAlign"	, "bottom");
					menu.put ("menu"		, submenu);
				}

				tbar.add (menu);
			}

			rs.close ();
			ps.close ();
		} catch (Exception e) {
			throw e;
		} finally {
			return tbar;
		}
	}
%>
<%
try {
	Jaring.getCookiesValue (request);

	JSONObject	tbar		= null;
	JSONObject	tbar_layout	= null;
	JSONArray	menu_items	= null;
	int			id			= 0;
	int			pid			= 0;
	String		label		= "";
	String		icon		= "";
	String		module		= "";

	_q	="	select	A.id"
		+"	,		A.pid"
		+"	,		A.label"
		+"	,		A.icon"
		+"	,		A.module"
		+"	from	_menu			A"
		+"	,		_group_menu		B"
		+"	,		_user_group		C"
		+"	where	A.pid			= 0"
		+"	and		A.id			= B._menu_id"
		+"	and		B._group_id		= C._group_id"
		+"	and		C._user_id		= ?"
		+"	and		B.permission	> 0"
		+"	order by A.id";

	_cn	= Jaring.getConnection (request);
	_ps	= _cn.prepareStatement (_q);
	_i	= 1;
	_ps.setLong (_i++	, Jaring._c_uid);

	_rs	= _ps.executeQuery ();
	_a	= new JSONArray ();

	while (_rs.next ()) {
		_o		= new JSONObject ();
		id		= _rs.getInt ("id");
		pid		= _rs.getInt ("pid");
		label	= _rs.getString ("label");
		icon	= _rs.getString ("icon");
		module	= _rs.getString ("module");

		_o.put ("id"		, module);
		_o.put ("menu_id"	, id);
		_o.put ("menu_pid"	, pid);
		_o.put ("title"		, label);
		_o.put ("text"		, label);
		_o.put ("iconCls"	, icon);

		menu_items = getMenu (_cn, Jaring._c_uid, id);

		switch (Jaring._menu_mode) {
		case 0:
			tbar		= new JSONObject ();
			tbar_layout	= new JSONObject ();

			tbar_layout.put ("overflowHandler", "Menu");

			tbar.put ("layout"	, tbar_layout);
			tbar.put ("items"	, menu_items);

			_o.put ("tbar"		, tbar);
			break;
		case 1:
			if (menu_items.size () > 0) {
				_o.put ("menu"	, menu_items);
			}
			break;
		}

		_a.add (_o);
	}

	_rs.close ();
	_ps.close ();
	_cn.close ();

	_r.put ("success"	, true);
	_r.put ("data"		, _a);

} catch (Exception e) {
	_r.put ("success"	, false);
	_r.put ("data"		, e);
}
out.print (_r);
%>
