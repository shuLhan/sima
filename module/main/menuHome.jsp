<%@ include file="../init.jsp" %>
<%@ page contentType="application/json" %>
<%
try {
	_cn	= Jaring.getConnection (request);

	_r.put ("success"	, true);

	_q	="	select	A.id"
		+"	,		A.label"
		+"	,		A.image"
		+"	,		A.module"
		+"	,		A.description"
		+"	,		B.permission"
		+"	from	_menu		A"
		+"	,		_group_menu	B"
		+"	,		_user_group	C"
		+"	where	A.pid		= 1"
		+"	and		A.type		= 2"
		+"	and		A.id		= B._menu_id"
		+"	and		B._group_id	= C._group_id"
		+"	and		C._user_id	= ?";

	_ps	= _cn.prepareStatement (_q);
	_i	= 1;
	_ps.setLong (_i++	, Jaring._c_uid);

	_rs	= _ps.executeQuery ();
	_a	= new JSONArray ();

	while (_rs.next ()) {
		_o	= new JSONObject ();

		_o.put ("id"			, _rs.getInt 	("id"));
		_o.put ("label"			, _rs.getString ("label"));
		_o.put ("image"			, _rs.getString ("image"));
		_o.put ("module"		, _rs.getString ("module"));
		_o.put ("description"	, _rs.getString ("description"));
		_o.put ("permission"	, _rs.getString ("permission"));

		_a.add (_o);
	}

	_rs.close ();
	_ps.close ();

	_r.put ("data"		, _a);
	
	_cn.close ();

} catch (Exception e) {
	_r.put ("success"	, false);
	_r.put ("data"		, e);
}
out.print (_r);
%>
