<%@ include file="../init.jsp" %>
<%@ page contentType="application/json" %>
<%
try {
	int		i		= 0;
	long	id		= 0;
	String	action	= request.getParameter ("action");

	_cn	= Jaring.getConnection (request);

	if ("update".equalsIgnoreCase (action)) {
		_a	= Jaring.getRequestBodyJson (request);

		_q	="	update	_user"
			+"	set		realname	= ?"
			+"	where	id			= ?";

		_ps	= _cn.prepareStatement (_q);

		for (i = 0; i < _a.size (); i++) {
			_o	= _a.getJSONObject (i);
			id	= _o.getIntValue ("id");

			if (id < 0) {
				throw new Exception ("Invalid data ID!");
			}

			_i	= 1;
			_ps.setString	(_i++	, _o.getString ("realname"));
			_ps.setLong		(_i++	, id);
			_ps.executeUpdate ();
		}

		_ps.close ();

		_r.put ("success"	,true);
		_r.put ("data"		,Jaring.MSG_SUCCESS_UPDATE);

	/* default action: read */
	} else {
		Jaring.getCookiesValue (request);

		_q	="	select		A.id"
			+"	,			A.name"
			+"	,			A.realname"
			+"	,			C.name		as group_name"
			+"	from		_user		A"
			+"	,			_user_group	B"
			+"	,			_group		C"
			+"	where		A.id		= ?"
			+"	and			A.id		= B._user_id"
			+"	and			B._group_id	= C.id";
			
		_ps	= _cn.prepareStatement (_q);
		_i	= 1;
		_ps.setLong (_i++	, Jaring._c_uid);
		_rs	= _ps.executeQuery ();
		_a	= new JSONArray ();

		while (_rs.next ()) {
			_o	= new JSONObject ();

			_o.put ("id"			, _rs.getInt ("id"));
			_o.put ("name"			, _rs.getString ("name"));
			_o.put ("realname"		, _rs.getString ("realname"));
			_o.put ("group_name"	, _rs.getString ("group_name"));

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
