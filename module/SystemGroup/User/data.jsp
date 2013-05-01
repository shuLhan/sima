<%@ page contentType="application/json" %>
<%@ include file="../../init.jsp" %>
<%
try {
	String	action		= request.getParameter ("action");
	int		limit		= Jaring.getIntParameter (request, "limit", Jaring._paging_size);
	int		start		= Jaring.getIntParameter (request, "start", 0);
	int		_group_id	= Jaring.getIntParameter (request, "_group_id", 0);
	int		_user_id	= 0;
	int		id			= 0;

	if (_group_id <= 0) {
		throw new Exception ("Invalid group ID!");
	}

	_cn	= Jaring.getConnection (request);

	_r.put ("success", true);

	if ("create".equalsIgnoreCase (action)) {
		_user_id = Jaring.getIntParameter (request, "_user_id", 0);

		if (_user_id <= 0) {
			throw new Exception ("Invalid user ID!");
		}

		_q	="	insert into _user_group ("
			+"		_group_id"
			+"	,	_user_id"
			+"	) values ( ? , ? )";

		_ps	= _cn.prepareStatement (_q);
		_i	= 1;
		_ps.setInt (_i++	, _group_id);
		_ps.setInt (_i++	, _user_id);
		_ps.executeUpdate ();
		_ps.close ();

		_r.put ("data", Jaring.MSG_SUCCESS_CREATE);

	} else if ("update".equalsIgnoreCase (action)) {
		id			= Jaring.getIntParameter (request, "id", 0);
		_user_id	= Jaring.getIntParameter (request, "_user_id", 0);

		if (id <= 0 || _user_id <= 0) {
			throw new Exception ("Invalid user ID!");
		}

		_q	="	update	_user_group"
			+"	set		_user_id	= ?"
			+"	where	id			= ?";

		_ps	= _cn.prepareStatement (_q);
		_i	= 1;
		_ps.setInt (_i++	, _user_id);
		_ps.setInt (_i++	, id);
		_ps.executeUpdate ();
		_ps.close ();

		_r.put ("data", Jaring.MSG_SUCCESS_UPDATE);

	} else if ("destroy".equalsIgnoreCase (action)) {
		id = Jaring.getIntParameter (request, "id", 0);

		if (id <= 0) {
			throw new Exception ("Invalid ID!");
		}

		/* Delete group from table */
		_q	="	delete from	_user_group"
			+"	where		id	= ?";

		_ps	= _cn.prepareStatement (_q);
		_i	= 1;
		_ps.setInt (_i++, id);
		_ps.executeUpdate ();
		_ps.close ();

		_r.put ("data", Jaring.MSG_SUCCESS_DELETE);

	/* default action: read */
	} else {
		/* Get total row */
		_q	="	select		count (id) as total"
			+"	from		_user_group"
			+"	where		_group_id = ?";

		_ps	= _cn.prepareStatement (_q);
		_i	= 1;
		_ps.setInt (_i++, _group_id);
		_rs	= _ps.executeQuery ();

		if (_rs.next ()) {
			_t = _rs.getLong ("total");
		}

		_ps.close ();
		_rs.close ();

		/* Get data */
		_q	="	select		A.id"
			+"	,			A._user_id"
			+"	,			A._group_id"
			+"	,			B.name"
			+"	,			B.realname"
			+"	from		_user_group	A"
			+"	,			_user		B"
			+"	where		A._group_id	= ?"
			+"	and			A._user_id	= B.id"
			+"	order by	B.name"
			+"	limit		?"
			+"	offset		?";

		_ps	= _cn.prepareStatement (_q);
		_i	= 1;
		_ps.setInt	(_i++	, _group_id);
		_ps.setInt	(_i++	, limit);
		_ps.setInt	(_i++	, start);
		_rs	= _ps.executeQuery ();
		_a	= new JSONArray ();

		while (_rs.next ()) {
			_o	= new JSONObject ();

			_o.put ("id"				, _rs.getInt	("id"));
			_o.put ("_user_id"			, _rs.getInt	("_user_id"));
			_o.put ("_user_name"		, _rs.getString	("name"));
			_o.put ("_user_realname"	, _rs.getString	("realname"));
			_o.put ("_group_id"			, _rs.getInt	("_group_id"));

			_a.add (_o);
		}

		_rs.close ();
		_ps.close ();

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
