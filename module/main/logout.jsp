<%@ include file="../init.jsp" %>
<%
try {
	String c_name = "";

	/* Remove application cookies */
	if (null != _cookies) {
		for (int i = 0; i < _cookies.length; i++) {
			c_name = _cookies[i].getName ();
			if (c_name.equalsIgnoreCase (Jaring._name +".user.id")) {
				_cookies[i].setMaxAge (0);
				_cookies[i].setPath (Jaring._path);
				response.addCookie (_cookies[i]);
			}
		}
	}

	/* Forward user to home page */
	response.sendRedirect (Jaring._path);

} catch (Exception e) {
}
%>
