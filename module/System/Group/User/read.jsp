<%@ include file="/module/json_begin.jsp" %>
<%
String	query		= request.getParameter ("query");
int		limit		= Jaring.getIntParameter (request, "limit", Jaring._paging_size);
int		start		= Jaring.getIntParameter (request, "start", 0);
int		_group_id	= Jaring.getIntParameter (request, "_group_id", 0);

// Get total row
_q	="	select		count (A.id) as total"
	+"	from		_user_group	A"
	+"	,			_user		B"
	+"	where		_group_id	= ?"
	+"	and			A._user_id	= B.id"
	+"	and			(B.name		like ?"
	+"	or			B.realname	like ?)";

_ps	= _cn.prepareStatement (_q);
_i	= 1;
_ps.setInt		(_i++, _group_id);
_ps.setString	(_i++,	"%"+ query +"%");
_ps.setString	(_i++,	"%"+ query +"%");
_rs	= _ps.executeQuery ();

if (_rs.next ()) {
	_t = _rs.getLong ("total");
}

_ps.close ();
_rs.close ();

/* Get data */
_q	="	select		A.id"
	+"	,			A._user_id"
	+"	,			A._group_id"
	+"	,			B.name"
	+"	,			B.realname"
	+"	from		_user_group	A"
	+"	,			_user		B"
	+"	where		A._group_id	= ?"
	+"	and			A._user_id	= B.id"
	+"	and			(B.name		like ?"
	+"	or			B.realname	like ?)"
	+"	order by	B.name"
	+"	limit		?"
	+"	offset		?";

_ps	= _cn.prepareStatement (_q);
_i	= 1;
_ps.setInt	(_i++	, _group_id);
_ps.setString	(_i++,	"%"+ query +"%");
_ps.setString	(_i++,	"%"+ query +"%");
_ps.setInt	(_i++	, limit);
_ps.setInt	(_i++	, start);
_rs	= _ps.executeQuery ();
_a	= new JSONArray ();

while (_rs.next ()) {
	_o	= new JSONObject ();

	_o.put ("id"				, _rs.getInt	("id"));
	_o.put ("_user_id"			, _rs.getInt	("_user_id"));
	_o.put ("_user_name"		, _rs.getString	("name"));
	_o.put ("_user_realname"	, _rs.getString	("realname"));
	_o.put ("_group_id"			, _rs.getInt	("_group_id"));

	_a.add (_o);
}

_rs.close ();
_ps.close ();

_r.put ("data"		,_a);
_r.put ("total"		,_t);
%>
<%@ include file="/module/json_end.jsp" %>
