<%--
	Copyright 2013 x10c-lab.com
	Authors:
		- mhd.sulhan (sulhan@x10c-lab.com)
--%>
<%@ page import="java.security.MessageDigest" %>
<%@ include file="../init.jsp" %>
<%
try {
	String	username	= request.getParameter ("username");
	String	password	= request.getParameter ("password");
	int		id			= 0;
	String	realname	= "";
	int		status		= 0;

	if (null == username || null == password) {
		throw new Exception ("Invalid username or password!");
	}

	_cn	= Jaring.getConnection (request);

	if (_cn == null) {
		throw new Exception ("Cannot get database connection!");
	}

	/* Check if username and password is valid */
	_q	="	select	id"
		+"	,		realname"
		+"	,		status"
		+"	from	_user"
		+"	where	name		= ?"
		+"	and		password	= ?";

	_ps = _cn.prepareStatement (_q);
	_i	= 1;
	_ps.setString (_i++, username);
	_ps.setString (_i++, Jaring.encrypt (password));
	_rs	= _ps.executeQuery ();

	if (! _rs.next ()) {
		throw new Exception ("Invalid username or password!");
	}

	id 			= _rs.getInt ("id");
	realname 	= _rs.getString ("realname");
	status 		= _rs.getInt ("status");

	if (status == 0) {
		throw new Exception ("User has not been activated, please contact Administrator.");
	}

	_rs.close ();
	_ps.close ();

	_q	="	update	_user"
		+"	set		last_login	= now()"
		+"	where	id			= ?";

	_ps	= _cn.prepareStatement (_q);
	_i	= 1;
	_ps.setInt (_i++, id);
	_ps.executeUpdate ();
	_ps.close ();

	_cn.close ();

	/* Save user id to cookie */
	Cookie	c;

	c = new Cookie ((Jaring._name +".user.id"), Integer.toString(id));
	c.setPath (Jaring._path);
	response.addCookie (c);

	c = new Cookie ((Jaring._name +".user.name"), realname);
	c.setPath (Jaring._path);
	response.addCookie (c);

	/* Forward user to main page */
	_r.put ("success"	,true);
	_r.put ("data"		,"Logging in ...");

} catch (Exception e) {
	_r.put ("success"	,false);
	_r.put ("data"		,e.getMessage ());
}
out.print (_r);
%>
