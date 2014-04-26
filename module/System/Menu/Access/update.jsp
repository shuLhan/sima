<%@ include file="/module/json_begin.jsp" %>
<%
int		gid		= 0;
int		menu_id	= 0;
int		perm	= 0;

_a = Jaring.getRequestBodyJson (request);

for (int x = 0; x < _a.size (); x++) {
	_o		= _a.getJSONObject (x);

	perm	= _o.getIntValue ("permission");
	gid		= _o.getIntValue ("_group_id");
	menu_id	= _o.getIntValue ("id");

	if (perm < 0) {
		throw new Exception ("Invalid permission value :'"+ perm +"'!");
	}
	if (gid <= 0) {
		throw new Exception ("Invalid group ID :'"+ gid +"'!");
	}
	if (menu_id <= 0) {
		throw new Exception ("Invalid menu ID :'"+ menu_id +"'!");
	}
	_q	="	delete	from _group_menu"
		+"	where	_menu_id	= ?"
		+"	and		_group_id	= ?";

	_ps	= _cn.prepareStatement (_q);
	_i	= 1;
	_ps.setInt	(_i++	, menu_id);
	_ps.setInt	(_i++	, gid);
	_ps.executeUpdate ();
	_ps.close ();

	_q	="	insert	into _group_menu ("
		+"		_menu_id"
		+"	,	_group_id"
		+"	,	permission"
		+"	) values ( ? , ? , ? )";

	_ps	= _cn.prepareStatement (_q);
	_i	= 1;
	_ps.setInt	(_i++	, menu_id);
	_ps.setInt	(_i++	, gid);
	_ps.setInt	(_i++	, perm);
	_ps.executeUpdate ();
	_ps.close ();
}

_r.put ("data", Jaring.MSG_SUCCESS_UPDATE);
%>
<%@ include file="/module/json_end.jsp" %>
