<%@ include file="/module/init.jsp" %>
<%@ page contentType="application/json" %>
<%
try {
	long	id		= 0;
	String	pwd		= "";
	String	enc		= "";

	_cn	= Jaring.getConnection (request);

	_a	= Jaring.getRequestBodyJson (request);

	_q	="	update	_user"
			+"	set		name		= ?"
			+"	,		realname	= ?"
			+"	,		password	= ?"
			+"	where	id			= ?";

	_ps	= _cn.prepareStatement (_q);

	for (int x = 0; x < _a.size (); x++) {
		_o	= _a.getJSONObject (x);
		id	= _o.getIntValue ("id");
		pwd	= _o.getString ("password");

		if (id < 0) {
			throw new Exception ("Invalid data ID!");
		}

		if (pwd.isEmpty ()) {
			enc = _o.getString ("old_password");
		} else {
			enc	= Jaring.encrypt (pwd);
			if (enc.isEmpty ()) {
				throw new Exception ("Failed to encrypt data!");
			}
		}

		_i	= 1;
		_ps.setString	(_i++	, _o.getString ("name"));
		_ps.setString	(_i++	, _o.getString ("realname"));
		_ps.setString	(_i++	, enc);
		_ps.setLong		(_i++	, id);
		_ps.executeUpdate ();
	}

	_ps.close ();
	_r.put ("success"	,true);
	_r.put ("data"		,Jaring.MSG_SUCCESS_UPDATE);

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
