<%@ include file="../../init.jsp" %>
<%@ page contentType="application/json" %>
<%
try {
	String	action	= request.getParameter ("action");
	int		limit	= Jaring.getIntParameter (request, "limit", Jaring._paging_size);
	int		start	= Jaring.getIntParameter (request, "start", 0);
	long	id		= 0;

	_cn	= Jaring.getConnection (request);

	if ("create".equalsIgnoreCase (action)) {
		_q	="	insert into _group ("
			+"		name"
			+"	) values ( ? )";

		_ps	= _cn.prepareStatement (_q);
		_i	= 1;
		_ps.setString (_i++	, request.getParameter ("name"));
		_ps.executeUpdate ();
		_ps.close ();

		_r.put ("success"	,true);
		_r.put ("data"		,"New data has been created.");

	} else if ("update".equalsIgnoreCase (action)) {
		id	= Jaring.getIntParameter (request, "id", -1);

		if (id < 0) {
			throw new Exception ("Invalid data ID!");
		}

		_q	="	update	_group"
			+"	set		name		= ?"
			+"	where	id			= ?";

		_ps	= _cn.prepareStatement (_q);
		_i	= 1;
		_ps.setString	(_i++	, request.getParameter ("name"));
		_ps.setLong		(_i++	, id);
		_ps.executeUpdate ();
		_ps.close ();

		_r.put ("success"	,true);
		_r.put ("data"		,"Data has been updated.");

	} else if ("destroy".equalsIgnoreCase (action)) {
		id = Jaring.getIntParameter (request, "id", -1);

		if (id < 0) {
			throw new Exception ("Invalid data ID!");
		}

		/* Check group type, if it's 0 then return */
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

		/* Delete group from table */
		_q	="	delete from		_group"
			+"	where	id		= ?"
			+"	and		type	!= 0";

		_ps	= _cn.prepareStatement (_q);
		_i	= 1;
		_ps.setLong (_i++	, id);
		_ps.executeUpdate ();
		_ps.close ();

		_r.put ("success"	,true);
		_r.put ("data"		,"Data has been deleted.");

	/* default action: read */
	} else {
		/* Get total row */
		_q	="	select		count (id) as total"
			+"	from		_group";

		_ps	= _cn.prepareStatement (_q);
		_rs	= _ps.executeQuery ();

		if (_rs.next ()) {
			_t = _rs.getLong ("total");
		}

		_ps.close ();
		_rs.close ();

		/* Get data */
		_q	="	select		id"
			+"	,			name"
			+"	from		_group"
			+"	order by	name"
			+"	limit		?"
			+"	offset		?";

		_ps	= _cn.prepareStatement (_q);
		_i	= 1;
		_ps.setInt (_i++	, limit);
		_ps.setInt (_i++	, start);
		_rs	= _ps.executeQuery ();
		_a	= new JSONArray ();

		while (_rs.next ()) {
			_o	= new JSONObject ();

			_o.put ("id"		, _rs.getInt ("id"));
			_o.put ("name"		, _rs.getString ("name"));

			_a.add (_o);
		}

		_rs.close ();
		_ps.close ();

		_r.put ("success"	,true);
		_r.put ("data"		,_a);
		_r.put ("total"		,_t);
	}

	_cn.close ();

} catch (Exception e) {
	if (_cn != null) {
		_cn.close ();
	}
	_r.put ("success"	,false);
	_r.put ("data"		,e.getMessage ());
}
out.print (_r);
%>
