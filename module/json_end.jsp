<%
} catch (Exception e) {
	if (_cn != null) {
		_cn.close ();
	}
	_r.put ("success"	,false);
	_r.put ("data"		,e.getMessage ());
} finally {
	if (_cn != null) {
		try {
			_cn.close ();
		} catch (Exception e) {
			_r.put ("success"	,false);
			_r.put ("data"		,e.getMessage ());
		}
	}
	out.print (_r);
}
%>
