<%@ include file="../../init.jsp" %>
<%@ page contentType="application/json" %>
<%!
	private JSONArray getSystemMenu (Connection db_con, int gid, int pid)
	{
		JSONArray			a	= new JSONArray ();
		JSONObject			o	= null;
		JSONArray			c	= null;
		PreparedStatement	ps	= null;
		ResultSet			rs	= null;
		String				q;
		int					i	= 0;
		int					id	= 0;

		q	="	select		A.id"
			+"	,			A.pid"
			+"	,			A.label"
			+"	,			A.icon"
			+"	,			A.module"
			+"	,			coalesce (B._group_id, ?)	_group_id"
			+"	,			B.permission"
			+"	from		_menu		A"
			+"	left join	_group_menu	B"
			+"		on		A.id		= B._menu_id"
			+"		and		B._group_id	= ?"
			+"	left join	("
			+"			select 	id"
			+"			,		pid"
			+"			,		label"
			+"			,		icon"
			+"			,		module"
			+"			from	_menu	M2"
			+"			where	pid		= ?"
			+"			and		type	in (0, 1, 3)"
			+"		) M2"
			+"		on M2.id = A.pid"
			+"	where		A.pid		= ?"
			+"	and			A.type	in (0, 1, 3)"
			+"	order by	id";

		try {
			ps	= db_con.prepareStatement (q);
			i	= 1;
			ps.setInt	(i++	, gid);
			ps.setInt	(i++	, gid);
			ps.setInt	(i++	, pid);
			ps.setInt	(i++	, pid);
			rs	= ps.executeQuery ();

			while (rs.next ()) {
				o	= new JSONObject ();
				id	= rs.getInt ("id");

				o.put ("id"			, id);
				o.put ("pid"		, rs.getInt		("pid"));
				o.put ("label"		, rs.getString	("label"));
				o.put ("iconCls"	, rs.getString	("icon"));
				o.put ("module"		, rs.getString	("module"));
				o.put ("_group_id"	, rs.getInt		("_group_id"));
				o.put ("permission"	, rs.getInt		("permission"));

				c = getSystemMenu (db_con, gid, id);

				if (c.size () <= 0) {
					o.put ("leaf"	, true);
				} else {
					o.put ("children", c);
				}

				a.add (o);
			}

			rs.close ();
			ps.close ();
		} catch (Exception e) {
			throw e;
		} finally {
			return a;
		}
	}
%>
<%
try {
	String	action	= request.getParameter ("action");
	int		gid		= 0;
	int		menu_id	= 0;
	int		perm	= 0;

	_cn	= Jaring.getConnection (request);

	_r.put ("success", true);

	if ("update".equalsIgnoreCase (action)) {
		_a = Jaring.getRequestBodyJson (request);

		for (int i = 0; i < _a.size (); i++) {
			_o		= _a.getJSONObject (i);

			perm	= _o.getIntValue ("permission");
			gid		= _o.getIntValue ("_group_id");
			menu_id	= _o.getIntValue ("id");

			if (perm < 0) {
				throw new Exception ("Invalid permission value!");
			}
			if (gid <= 0) {
				throw new Exception ("Invalid group ID!");
			}
			if (menu_id <= 0) {
				throw new Exception ("Invalid menu ID!");
			}
			_q	="	delete	from _group_menu"
				+"	where	_menu_id	= ?"
				+"	and		_group_id	= ?";

			_ps	= _cn.prepareStatement (_q);
			_i	= 1;
			_ps.setInt	(_i++	, menu_id);
			_ps.setInt	(_i++	, gid);
			_ps.executeUpdate ();
			_ps.close ();

			_q	="	insert	into _group_menu ("
				+"		_menu_id"
				+"	,	_group_id"
				+"	,	permission"
				+"	) values ( ? , ? , ? )";

			_ps	= _cn.prepareStatement (_q);
			_i	= 1;
			_ps.setInt	(_i++	, menu_id);
			_ps.setInt	(_i++	, gid);
			_ps.setInt	(_i++	, perm);
			_ps.executeUpdate ();
			_ps.close ();
		}

		_r.put ("data", Jaring.MSG_SUCCESS_UPDATE);

	/* default action: read */
	} else {
		gid = Jaring.getIntParameter (request, "_group_id", 0);

		if (gid <= 0) {
			throw new Exception ("Invalid group ID!");
		}

		_a = getSystemMenu (_cn, gid, 0);

		_r.put ("success"	,true);
		_r.put ("children"	,_a);
	}

	_cn.close ();

} catch (Exception e) {
	if (_cn != null) {
		_cn.close ();
	}
	_r.put ("success"	,false);
	_r.put ("data"		,e.getMessage ());
}
out.print (_r);
%>
