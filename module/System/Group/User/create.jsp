<%@ include file="/module/json_begin.jsp" %>
<%
int _user_id	= Jaring.getIntParameter (request, "_user_id", 0);
int _group_id	= Jaring.getIntParameter (request, "_group_id", 0);

if (_user_id <= 0) {
	throw new Exception ("Invalid user ID : '"+ _user_id +"'!");
}
if (_group_id <= 0) {
	throw new Exception ("Invalid group ID : '"+ _group_id +"'!");
}

_q	="	insert into _user_group ("
	+"		_group_id"
	+"	,	_user_id"
	+"	) values ( ? , ? )";

_ps	= _cn.prepareStatement (_q);
_i	= 1;
_ps.setInt (_i++	, _group_id);
_ps.setInt (_i++	, _user_id);
_ps.executeUpdate ();
_ps.close ();

_r.put ("data", Jaring.MSG_SUCCESS_CREATE);
%>
<%@ include file="/module/json_end.jsp" %>
