<%@ include file="/module/json_begin.jsp" %>
<%
_q	="	insert into _group ("
	+"		name"
	+"	) values ( ? )";

_ps	= _cn.prepareStatement (_q);
_i	= 1;
_ps.setString (_i++	, request.getParameter ("name"));
_ps.executeUpdate ();
_ps.close ();

_r.put ("data", Jaring.MSG_SUCCESS_CREATE);
%>
<%@ include file="/module/json_end.jsp" %>
