<%@ page import="java.security.MessageDigest" %>

<%@ include file="../init.jsp" %>
<%
try {
	String	username	= request.getParameter ("username");
	String	password	= request.getParameter ("password");
	String	id			= "";

	if (null == username || null == password) {
		throw new Exception ("Invalid user ID or password!");
	}

	/* Get SHA256 value of password */
	MessageDigest	md		= MessageDigest.getInstance("SHA-256");
	byte[]			hash	= md.digest (password.getBytes ());
	StringBuffer	sb		= new StringBuffer ();

	for (int i = 0; i < hash.length; i++) {
		sb.append (String.format ("%02x", hash[i]));
	}

	/* Check if username and password is valid */
	_q	="	select	id"
		+"	from	_user"
		+"	where	name		= ?"
		+"	and		password	= ?";

	_cn	= Jaring.getConnection (request);
	_ps = _cn.prepareStatement (_q);
	_i	= 1;
	_ps.setString (_i++, username);
	_ps.setString (_i++, sb.toString ());
	_rs	= _ps.executeQuery ();

	if (! _rs.next ()) {
		throw new Exception ("Invalid user ID or password!");
	}

	id = _rs.getString ("id");

	_rs.close ();
	_ps.close ();
	_cn.close ();

	/* Save user id to cookie */
	Cookie	c_uid		= new Cookie ((Jaring._name +".user.id"), id);

	c_uid.setPath (Jaring._path);

	response.addCookie (c_uid);

	/* Forward user to main page */
	_r.put ("success"	,true);
	_r.put ("data"		,"Logging in ...");

} catch (Exception e) {
	_r.put ("success"	,false);
	_r.put ("data"		,e.getMessage ());
}
out.print (_r);
%>
