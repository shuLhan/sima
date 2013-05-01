<%@ page contentType="application/json" %>
<%@ include file="../../init.jsp" %>
<%
try {
	String	action		= request.getParameter ("action");
	int		limit		= Jaring.getIntParameter (request, "limit", Jaring._paging_size);
	int		start		= Jaring.getIntParameter (request, "start", 0);
	int		_group_id	= Jaring.getIntParameter (request, "_group_id", 0);
	int		_user_id	= 0;

	if (_group_id <= 0) {
		throw new Exception ("Invalid group ID!");
	}

	_cn	= Jaring.getConnection (request);

	_r.put ("success", true);

	/* Get total row */
	_q	="	select		count (id) as total"
		+"	from		_user"
		+"	where		id not in ("
		+"		 select	_user_id"
		+"		 from	_user_group"
		+"		 where	_group_id = ?"
		+"	)";

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
	_q	="	select		id			as _user_id"
		+"	,			realname	as _user_realname"
		+"	from		_user"
		+"	where		id not in ("
		+"		 select	_user_id"
		+"		 from	_user_group"
		+"		 where	_group_id = ?"
		+"	)"
		+"	order by	realname"
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

		_o.put ("_user_id"			, _rs.getInt	("_user_id"));
		_o.put ("_user_realname"	, _rs.getString	("_user_realname"));

		_a.add (_o);
	}

	_rs.close ();
	_ps.close ();
	_cn.close ();

	_r.put ("data"		,_a);
	_r.put ("total"		,_t);

} catch (Exception e) {
	if (_cn != null) {
		_cn.close ();
	}
	_r.put ("success"	,false);
	_r.put ("data"		,e.getMessage ());
}
out.print (_r);
%>
