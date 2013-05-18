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
			+"	set		password	= ?"
			+"	where	id			= ?"
			+"	and		password	= ?";

		_ps	= _cn.prepareStatement (_q);

		for (i = 0; i < _a.size (); i++) {
			_o	= _a.getJSONObject (i);
			id	= _o.getIntValue ("id");

			if (id < 0) {
				throw new Exception ("Invalid data ID!");
			}

			_i	= 1;
			_ps.setString	(_i++	, Jaring.encrypt (_o.getString ("password_new")));
			_ps.setLong		(_i++	, id);
			_ps.setString	(_i++	, Jaring.encrypt (_o.getString ("password_current")));
			i = _ps.executeUpdate ();

			if (i <= 0) {
				throw new Exception ("Current password is invalid!");
			}
		}

		_ps.close ();

		_r.put ("success"	,true);
		_r.put ("data"		,Jaring.MSG_SUCCESS_UPDATE);

	} else {
		throw new Exception ("Invalid action '"+ action +"'!");
	}

} catch (Exception e) {
	_r.put ("success"	,false);
	_r.put ("data"		,e.getMessage ());
} finally {
	try {
		if (_cn != null) {
			_cn.close ();
		}
	} catch (Exception e)
	{
	}
}
out.print (_r);
%>
