<%@ include file="../init.jsp" %>
<%@ page contentType="application/json" %>
<%
try {
	String	action	= request.getParameter ("action");
	int		limit	= Jaring.getIntParameter (request, "limit", Jaring._paging_size);
	int		start	= Jaring.getIntParameter (request, "start", 0);

	_cn	= Jaring.getConnection (request);

	if ("create".equalsIgnoreCase (action)) {
		String enc = Jaring.encrypt (request.getParameter ("password"));

		if (enc.equals ("")) {
			throw new Exception ("Failed to encrypt data!");
		}

		_q	="	insert into _user ("
			+"		name"
			+"	,	realname"
			+"	,	password"
			+"	) values ( ? , ? , ? )";

		_ps	= _cn.prepareStatement (_q);
		_i	= 1;
		_ps.setString (_i++	, request.getParameter ("name"));
		_ps.setString (_i++	, request.getParameter ("realname"));
		_ps.setString (_i++	, enc);
		_ps.executeUpdate ();
		_ps.close ();

		_r.put ("success"	,true);
		_r.put ("data"		,"New data has been saved.");

	} else if ("update".equalsIgnoreCase (action)) {
		long	id	= Jaring.getIntParameter (request, "id", -1);
		String	enc	= Jaring.encrypt (request.getParameter ("password"));

		if (id < 0) {
			throw new Exception ("Invalid data ID!");
		}
		if (enc.equals ("")) {
			throw new Exception ("Failed to encrypt data!");
		}

		_q	="	update	_user"
			+"	set		name		= ?"
			+"	,		realname	= ?"
			+"	,		password	= ?"
			+"	where	id			= ?";

		_ps	= _cn.prepareStatement (_q);
		_i	= 1;
		_ps.setString	(_i++	, request.getParameter ("name"));
		_ps.setString	(_i++	, request.getParameter ("realname"));
		_ps.setString	(_i++	, Jaring.encrypt (request.getParameter ("password")));
		_ps.setLong		(_i++	, id);
		_ps.executeUpdate ();
		_ps.close ();

		_r.put ("success"	,true);
		_r.put ("data"		,"Data has been updated.");

	} else if ("destroy".equalsIgnoreCase (action)) {
		long id = Jaring.getIntParameter (request, "id", -1);

		if (id < 0) {
			throw new Exception ("Invalid data ID!");
		}

		_q	="	delete from _user where id = ?";
		_ps	= _cn.prepareStatement (_q);
		_i	= 1;
		_ps.setLong		(_i++	, id);
		_ps.executeUpdate ();
		_ps.close ();

		_r.put ("success"	,true);
		_r.put ("data"		,"Data has been deleted.");

	/* default action: read */
	} else {
		/* Get total row */
		_q	="	select		count (id) as total"
			+"	from		_user";

		_ps	= _cn.prepareStatement (_q);
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
			+"	order by	name"
			+"	limit		?"
			+"	offset		?";

		_ps	= _cn.prepareStatement (_q);
		_i	= 1;
		_ps.setInt (_i++	, limit);
		_ps.setInt (_i++	, start);
		_rs	= _ps.executeQuery ();
		_a	= new JSONArray ();

		while (_rs.next ()) {
			_o	= new JSONObject ();

			_o.put ("id"		, _rs.getInt ("id"));
			_o.put ("name"		, _rs.getString ("name"));
			_o.put ("realname"	, _rs.getString ("realname"));
			_o.put ("password"	, _rs.getString ("password"));

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
