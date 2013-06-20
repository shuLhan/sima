<%@ include file="/module/init.jsp" %>
<%@ page contentType="application/json" %>
<%
try {
	String	query	= request.getParameter ("query");
	int		limit	= Jaring.getIntParameter (request, "limit", Jaring._paging_size);
	int		start	= Jaring.getIntParameter (request, "start", 0);

	long	id		= 0;
	String	pwd		= "";
	String	enc		= "";

	_cn	= Jaring.getConnection (request);

	/* Get total row */
	_q	="	select		count (id) as total"
		+"	from		_user"
		+"	where		(name		like ?"
		+"	or			realname	like ?)";

	_ps	= _cn.prepareStatement (_q);
	_i	= 1;
	_ps.setString (_i++	, "%"+ query +"%");
	_ps.setString (_i++	, "%"+ query +"%");
	_rs	= _ps.executeQuery ();

	if (_rs.next ()) {
		_t = _rs.getLong ("total");
	}

	_ps.close ();
	_rs.close ();

	/* Get data */
	_q	="	select		id"
		+"	,			name"
		+"	,			realname"
		+"	,			password"
		+"	from		_user"
		+"	where		(name		like ?"
		+"	or			realname	like ?)"
		+"	order by	name"
		+"	limit		?"
		+"	offset		?";

	_ps	= _cn.prepareStatement (_q);
	_i	= 1;
	_ps.setString (_i++	, "%"+ query +"%");
	_ps.setString (_i++	, "%"+ query +"%");
	_ps.setInt (_i++	, limit);
	_ps.setInt (_i++	, start);
	_rs	= _ps.executeQuery ();
	_a	= new JSONArray ();

	while (_rs.next ()) {
		_o	= new JSONObject ();

		_o.put ("id"			, _rs.getInt ("id"));
		_o.put ("name"			, _rs.getString ("name"));
		_o.put ("realname"		, _rs.getString ("realname"));
		_o.put ("old_password"	, _rs.getString ("password"));
		_o.put ("password"		, "");

		_a.add (_o);
	}

	_rs.close ();
	_ps.close ();

	_r.put ("success"	,true);
	_r.put ("data"		,_a);
	_r.put ("total"		,_t);

} catch (Exception e) {
	if (_cn != null) {
		_cn.close ();
	}
	_r.put ("success"	,false);
	_r.put ("data"		,e.getMessage ());
} finally {
	out.print (_r);
}
%>
