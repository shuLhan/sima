<%!
private String q="	select		A.id"
				+"	,			A.pid"
				+"	,			A.label"
				+"	,			A.icon"
				+"	,			A.module"
				+"	,			coalesce (B._group_id, ?)	_group_id"
				+"	,			B.permission"
				+"	from		_menu		A"
				+"	left join	_group_menu	B"
				+"		on		A.id		= B._menu_id"
				+"		and		B._group_id	= ?"
				+"	left join	("
				+"			select 	id"
				+"			,		pid"
				+"			,		label"
				+"			,		icon"
				+"			,		module"
				+"			from	_menu	M2"
				+"			where	pid		= ?"
				+"			and		type	in (0, 1, 3)"
				+"		) M2"
				+"		on M2.id = A.pid"
				+"	where		A.pid		= ?"
				+"	and			A.type	in (0, 1, 3)"
				+"	order by	id";

private JSONArray getSystemMenu (Connection db_con, int gid, int pid, int depth)
{
	JSONArray			a	= new JSONArray ();
	JSONObject			o	= null;
	JSONArray			c	= null;
	PreparedStatement	ps	= null;
	ResultSet			rs	= null;
	int					i	= 0;
	int					id	= 0;
	int					index	= 0;

	try {
		ps	= db_con.prepareStatement (q);
		i	= 1;
		ps.setInt	(i++	, gid);
		ps.setInt	(i++	, gid);
		ps.setInt	(i++	, pid);
		ps.setInt	(i++	, pid);
		rs	= ps.executeQuery ();

		while (rs.next ()) {

			o	= new JSONObject ();
			id	= rs.getInt ("id");

			if (index == 0) {
				o.put ("isFirst", true);
			} else {
				o.put ("isFirst", false);
			}

			o.put ("id"			, id);
			o.put ("index"		, index++);
			o.put ("depth"		, depth);
			o.put ("parentId"	, rs.getInt		("pid"));
			o.put ("label"		, rs.getString	("label"));
			o.put ("iconCls"	, rs.getString	("icon"));
			o.put ("module"		, rs.getString	("module"));
			o.put ("_group_id"	, rs.getInt		("_group_id"));
			o.put ("permission"	, rs.getInt		("permission"));

			c = getSystemMenu (db_con, gid, id, depth + 1);

			if (c.size () <= 0) {
				o.put ("leaf"	, true);
			} else {
				o.put ("children", c);
				o.put ("expandable", true);
				o.put ("expanded", true);
				o.put ("loaded", true);
			}

			a.add (o);
		}

		rs.close ();
		ps.close ();
	} catch (Exception e) {
		throw e;
	} finally {
		return a;
	}
}
%>

<%@ include file="/module/json_begin.jsp" %>
<%
int gid = Jaring.getIntParameter (request, "_group_id", 0);

if (gid <= 0) {
	throw new Exception ("Invalid group ID : '"+ gid +"'!");
}

_a = getSystemMenu (_cn, gid, 0, 0);

_r.put ("children"	,_a);
%>
<%@ include file="/module/json_end.jsp" %>
