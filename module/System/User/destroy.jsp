<%@ include file="/module/json_begin.jsp" %>
<%
	long id = 0;

	_q	="	delete from _user where id = ?";

	_a	= Jaring.getRequestBodyJson (request);
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

	_r.put ("data"		,Jaring.MSG_SUCCESS_DESTROY);
%>
<%@ include file="/module/json_end.jsp" %>
