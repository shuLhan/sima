<%--
	Copyright 2013 x10c-lab.com
	Authors:
		- mhd.sulhan (sulhan@x10c-lab.com)
--%>
<%@ include file="../init.jsp" %>
<%
try {
	String		c_name	= "";
	Cookie[]	cookies	= request.getCookies ();

	/* Remove application cookies */
	if (null != cookies) {
		for (int i = 0; i < cookies.length; i++) {
			c_name = cookies[i].getName ();
			if (c_name.equalsIgnoreCase (Jaring._name +".user.id")
			||  c_name.equalsIgnoreCase (Jaring._name +".user.name")
			) {
				cookies[i].setMaxAge (0);
				cookies[i].setPath (Jaring._path);
				response.addCookie (cookies[i]);
			}
		}
	}

	/* Forward user to home page */
	response.sendRedirect (Jaring._path);

} catch (Exception e) {
}
%>
