<%@ include file="/module/json_begin.jsp" %>
<%
int id = Jaring.getIntParameter (request, "id", 0);

if (id <= 0) {
	throw new Exception ("Invalid ID!");
}

_q	="	delete from	_user_group"
	+"	where		id	= ?";

_ps	= _cn.prepareStatement (_q);
_i	= 1;
_ps.setInt (_i++, id);
_ps.executeUpdate ();
_ps.close ();

_r.put ("data", Jaring.MSG_SUCCESS_DESTROY);
%>
<%@ include file="/module/json_end.jsp" %>
