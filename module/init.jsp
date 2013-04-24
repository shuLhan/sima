<%@ page import="java.sql.Connection" %>
<%@ page import="java.sql.PreparedStatement" %>
<%@ page import="java.sql.ResultSet" %>
<%@ page import="java.sql.Statement" %>

<%@ page import="com.alibaba.fastjson.JSONArray" %>
<%@ page import="com.alibaba.fastjson.JSONObject" %>

<%@ page import="com.x10clab.jaring.Jaring" %>
<%
	Connection			_cn			= Jaring.getConnection (request);
	Statement			_st			= null;
	PreparedStatement	_ps			= null;
	ResultSet			_rs			= null;
	String				_q			= "";
	int					_i			= 0;

	JSONObject			_r			= new JSONObject ();
	JSONArray			_a			= null;
	JSONObject			_o			= null;

	Cookie[]			_cookies	= request.getCookies ();
	long				_uid		= 0;

	if (null != _cookies) {
		for (int i = 0; i < _cookies.length; i++) {
			String	c_name = _cookies[i].getName ();
			if (c_name.equalsIgnoreCase (Jaring._name +".user.id")) {
				_uid = Integer.parseInt (_cookies[i].getValue ());
			}
		}
	}
%>
