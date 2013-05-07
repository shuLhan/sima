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
	JSONArray	tbar_items	= null;

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
		+"	and		B.permission	> 0";

	_cn	= Jaring.getConnection (request);
	_ps	= _cn.prepareStatement (_q);
	_i	= 1;
	_ps.setLong (_i++	, Jaring._c_uid);

	_rs	= _ps.executeQuery ();
	_a	= new JSONArray ();

	while (_rs.next ()) {
		_o	= new JSONObject ();

		tbar		= new JSONObject ();
		tbar_layout	= new JSONObject ();
		
		tbar_layout.put ("overflowHandler", "Menu");

		tbar_items	= getMenu (_cn, Jaring._c_uid, _rs.getInt ("id"));

		tbar.put ("layout"	, tbar_layout);
		tbar.put ("items"	, tbar_items);

		_o.put ("menu_id"	, _rs.getLong ("id"));
		_o.put ("menu_pid"	, _rs.getLong ("pid"));
		_o.put ("title"		, _rs.getString ("label"));
		_o.put ("iconCls"	, _rs.getString ("icon"));
		_o.put ("tbar"		, tbar);

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
