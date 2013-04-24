<%@ page import="java.io.File" %>

<%@ page import="com.x10clab.jaring.Jaring" %>
<%

/* Initialize application object dan database connection pooling */
Jaring.init (application, request);

/*
	Check cookie for [app].user.id.
	If it exist forward user to module "main".
	if not exist then forward user to module "home".
*/
String		fs		= File.separator;
String		m_main	= fs + Jaring._path_mod + fs + "main/";
String		m_home	= fs + Jaring._path_mod + fs + "home/";
Cookie[]	cookies = request.getCookies ();
String		c_name	= "";

if (null != cookies) {
	for (int i = 0; i < cookies.length; i++) {
		c_name = cookies[i].getName ();
		if (c_name.equalsIgnoreCase (Jaring._name +".user.id")) {
			%><jsp:forward page="<%= m_main %>" /><%
		}
	}
}
%>
<jsp:forward page="<%= m_home %>" />
