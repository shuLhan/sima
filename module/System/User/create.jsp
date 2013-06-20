<%@ include file="/module/json_begin.jsp" %>
<%
	String enc = "";

	_a	= Jaring.getRequestBodyJson (request);

	_q	="	insert into _user ("
		+"		name"
		+"	,	realname"
		+"	,	password"
		+"	) values ( ? , ? , ? )";

	_ps	= _cn.prepareStatement (_q);

	for (int x = 0; x < _a.size (); x++) {
		_o	= _a.getJSONObject (x);
		enc = Jaring.encrypt (_o.getString ("password"));

		if (enc.equals ("")) {
			throw new Exception ("Failed to encrypt data!");
		}

		_i	= 1;
		_ps.setString (_i++	, _o.getString ("name"));
		_ps.setString (_i++	, _o.getString ("realname"));
		_ps.setString (_i++	, enc);
		_ps.executeUpdate ();
	}

	_ps.close ();

	_r.put ("data"		,Jaring.MSG_SUCCESS_CREATE);
%>
<%@ include file="/module/json_end.jsp" %>
