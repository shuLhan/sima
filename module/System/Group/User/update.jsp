<%@ include file="/module/json_begin.jsp" %>
<%
int	id			= Jaring.getIntParameter (request, "id", 0);
int	_user_id	= Jaring.getIntParameter (request, "_user_id", 0);

if (id <= 0 || _user_id <= 0) {
	throw new Exception ("Invalid user ID!");
}

_q	="	update	_user_group"
	+"	set		_user_id	= ?"
	+"	where	id			= ?";

_ps	= _cn.prepareStatement (_q);
_i	= 1;
_ps.setInt (_i++	, _user_id);
_ps.setInt (_i++	, id);
_ps.executeUpdate ();
_ps.close ();

_r.put ("data", Jaring.MSG_SUCCESS_UPDATE);
%>
<%@ include file="/module/json_end.jsp" %>
