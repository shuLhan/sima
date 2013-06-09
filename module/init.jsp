<%@ page import="java.sql.Connection" %>
<%@ page import="java.sql.PreparedStatement" %>
<%@ page import="java.sql.ResultSet" %>
<%@ page import="java.sql.Statement" %>
<%@ page import="java.sql.Date" %>
<%@ page import="java.sql.Types" %>

<%@ page import="com.alibaba.fastjson.JSONArray" %>
<%@ page import="com.alibaba.fastjson.JSONObject" %>

<%@ page import="com.x10clab.jaring.Jaring" %>
<%
	Connection			_cn			= null;
	Statement			_st			= null;
	PreparedStatement	_ps			= null;
	ResultSet			_rs			= null;
	String				_q			= "";
	int					_i			= 0;
	long				_t			= 0;

	JSONObject			_r			= new JSONObject ();
	JSONArray			_a			= null;
	JSONObject			_o			= null;
%>
