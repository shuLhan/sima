<%@ include file="/module/init.jsp" %>
<%@ page contentType="application/json" %>
<%
try {
	long	id		= 0;
	String	pwd		= "";
	String	enc		= "";

	_cn	= Jaring.getConnection (request);

	_a	= Jaring.getRequestBodyJson (request);

	_q	="	delete from _user where id = ?";

	_ps	= _cn.prepareStatement (_q);
	
	for (int x = 0; x < _a.size (); x++) {
		_o	= _a.getJSONObject (x);
		id	= _o.getIntValue ("id");

		if (id < 0) {
			throw new Exception ("Invalid data ID!");
		}

		_i	= 1;
		_ps.setLong		(_i++	, id);
		_ps.executeUpdate ();
	}

	_ps.close ();
	_r.put ("success"	,true);
	_r.put ("data"		,Jaring.MSG_SUCCESS_DESTROY);

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
