<%@ include file="/module/json_begin.jsp" %>
<%
long id = Jaring.getIntParameter (request, "id", -1);

if (id < 0) {
	throw new Exception ("Invalid data ID!");
}

// Check group type, if it's 0 then return
int type = 0;

_q	="	select	type"
	+"	from	_group"
	+"	where	id = ?";

_ps	= _cn.prepareStatement (_q);
_i	= 1;
_ps.setLong (_i++	, id);
_rs = _ps.executeQuery ();

if (_rs.next ()) {
	type = _rs.getInt ("type");

	if (type == 0) {
		throw new Exception ("This group is system group and can't be deleted.");
	}
}

_rs.close ();
_ps.close ();

// Delete group menu access
_q	="	delete from	_group_menu"
	+"	where		_group_id = ?";

_ps	= _cn.prepareStatement (_q);
_i	= 1;
_ps.setLong (_i++	, id);
_ps.executeUpdate ();
_ps.close ();

// Delete group from table
_q	="	delete from		_group"
	+"	where	id		= ?"
	+"	and		type	!= 0";

_ps	= _cn.prepareStatement (_q);
_i	= 1;
_ps.setLong (_i++	, id);
_ps.executeUpdate ();
_ps.close ();

_r.put ("data", Jaring.MSG_SUCCESS_DESTROY);
%>
<%@ include file="/module/json_end.jsp" %>
