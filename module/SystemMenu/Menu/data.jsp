<%@ include file="../../init.jsp" %>
<%@ page contentType="application/json" %>
<%
try {
	String	action	= request.getParameter ("action");
	String	query	= request.getParameter ("query");
	int		limit	= Jaring.getIntParameter (request, "limit", Jaring._paging_size);
	int		start	= Jaring.getIntParameter (request, "start", 0);
	int		gid		= 0;
	int		menu_id	= 0;
	int		perm	= 0;

	if (null == query) {
		query = "";
	}

	_cn	= Jaring.getConnection (request);

	_r.put ("success", true);

	if ("update".equalsIgnoreCase (action)) {
		_a = Jaring.getRequestBodyJson (request);

		for (int i = 0; i < _a.size (); i++) {
			_o		= _a.getJSONObject (i);

			perm	= _o.getIntValue ("permission");
			gid		= _o.getIntValue ("_group_id");
			menu_id	= _o.getIntValue ("id");

			if (perm <= 0) {
				throw new Exception ("Invalid permission value!");
			}
			if (gid <= 0) {
				throw new Exception ("Invalid group ID!");
			}
			if (menu_id <= 0) {
				throw new Exception ("Invalid menu ID!");
			}

			_q	="	update	_group_menu"
				+"	set		permission	= ?"
				+"	where	_menu_id	= ?"
				+"	and		_group_id	= ?";

			_ps	= _cn.prepareStatement (_q);
			_i	= 1;
			_ps.setInt	(_i++	, perm);
			_ps.setInt	(_i++	, menu_id);
			_ps.setInt	(_i++	, gid);
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

		/* Get total row */
		_q	="	select		count (A.id) as total"
			+"	from		_menu		A"
			+"	left join	_group_menu	B"
			+"		on		A.id		= B._menu_id"
			+"	where		A.label		like ?"
			+"	and			B._group_id	= ?";

		_ps	= _cn.prepareStatement (_q);
		_i	= 1;
		_ps.setString (_i++, "%"+ query +"%");
		_ps.setInt		(_i++	, gid);
		_rs	= _ps.executeQuery ();

		if (_rs.next ()) {
			_t = _rs.getLong ("total");
		}

		_ps.close ();
		_rs.close ();

		/* Get data */
		_q	="	select		A.id"
			+"	,			A.pid"
			+"	,			A.label"
			+"	,			A.icon"
			+"	,			A.module"
			+"	,			B._group_id"
			+"	,			B.permission"
			+"	from		_menu		A"
			+"	left join	_group_menu	B"
			+"		on		A.id		= B._menu_id"
			+"	where		A.label		like ?"
			+"	and			B._group_id	= ?"
			+"	order by	id, pid"
			+"	limit		?"
			+"	offset		?";

		_ps	= _cn.prepareStatement (_q);
		_i	= 1;
		_ps.setString	(_i++	, "%"+ query +"%");
		_ps.setInt		(_i++	, gid);
		_ps.setInt		(_i++	, limit);
		_ps.setInt		(_i++	, start);
		_rs	= _ps.executeQuery ();
		_a	= new JSONArray ();

		while (_rs.next ()) {
			_o	= new JSONObject ();

			_o.put ("id"			, _rs.getInt	("id"));
			_o.put ("pid"			, _rs.getInt	("pid"));
			_o.put ("label"			, _rs.getString	("label"));
			_o.put ("icon"			, _rs.getString	("icon"));
			_o.put ("module"		, _rs.getString	("module"));
			_o.put ("_group_id"		, _rs.getInt	("_group_id"));
			_o.put ("permission"	, _rs.getInt	("permission"));

			_a.add (_o);
		}

		_rs.close ();
		_ps.close ();

		_r.put ("success"	,true);
		_r.put ("data"		,_a);
		_r.put ("total"		,_t);
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
