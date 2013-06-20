<%@ include file="/module/init.jsp" %>
<%@ page contentType="application/json" %>
<%
try {
	String enc = "";

	_cn	= Jaring.getConnection (request);

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

	_r.put ("success"	,true);
	_r.put ("data"		,Jaring.MSG_SUCCESS_CREATE);

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
