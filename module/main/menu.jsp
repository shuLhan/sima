<%@ include file="../init.jsp" %>
<%!
	private JSONArray getMenu (Connection db_con, long _uid, int pid)
	{
		JSONArray			tbar	= new JSONArray ();
		JSONObject			menu	= null;
		JSONArray			submenu	= null;
		String				_q		= "";
		PreparedStatement	_ps		= null;
		ResultSet			_rs		= null;
		int					_i		= 0;

		_q	="	select	A.id"
			+"	,		A.pid"
			+"	,		A.label"
			+"	,		A.icon"
			+"	,		A.module"
			+"	from	_menu		A"
			+"	,		_group_menu	B"
			+"	,		_user_group	C"
			+"	where	A.pid		= ?"
			+"	and		A.id		= B._menu_id"
			+"	and		B._group_id	= C._group_id"
			+"	and		C._user_id	= ?";

		try {
			_ps	= db_con.prepareStatement (_q);
			_i	= 1;
			_ps.setInt (_i++	, pid);
			_ps.setLong (_i++	,_uid);

			_rs	= _ps.executeQuery ();

			while (_rs.next ()) {
				menu	= new JSONObject ();

				menu.put ("text"	, _rs.getString ("label"));
				menu.put ("iconCls"	, _rs.getString ("icon"));
				menu.put ("module"	, _rs.getString ("module"));

				submenu = getMenu (db_con, _uid, _rs.getInt ("id"));

				if (submenu.size () > 0) {
					menu.put ("arrowAlign"	, "bottom");
					menu.put ("menu"		, submenu);
				}

				tbar.add (menu);
			}

			_rs.close ();
			_ps.close ();
		} catch (Exception e) {
			throw e;
		} finally {
			return tbar;
		}
	}
%>
<%
try {
	JSONArray	tbar	= null;

	_q	="	select	A.id"
		+"	,		A.pid"
		+"	,		A.label"
		+"	,		A.icon"
		+"	,		A.module"
		+"	from	_menu		A"
		+"	,		_group_menu	B"
		+"	,		_user_group	C"
		+"	where	A.pid		= 0"
		+"	and		A.id		= B._menu_id"
		+"	and		B._group_id	= C._group_id"
		+"	and		C._user_id	= ?";

	_ps	= _cn.prepareStatement (_q);
	_i	= 1;
	_ps.setLong (_i++	, _uid);

	_rs	= _ps.executeQuery ();
	_a	= new JSONArray ();

	while (_rs.next ()) {
		_o	= new JSONObject ();

		tbar = getMenu (_cn, _uid, _rs.getInt ("id"));

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
