<%@ include file="/module/json_begin.jsp" %>
<%
_q	="	update	_group"
	+"	set		name		= ?"
	+"	where	id			= ?";

long id = Jaring.getIntParameter (request, "id", -1);

if (id < 0) {
	throw new Exception ("Invalid data ID!");
}

_ps	= _cn.prepareStatement (_q);
_i	= 1;
_ps.setString	(_i++	, request.getParameter ("name"));
_ps.setLong		(_i++	, id);
_ps.executeUpdate ();
_ps.close ();

_r.put ("data", Jaring.MSG_SUCCESS_UPDATE);
%>
<%@ include file="/module/json_end.jsp" %>
