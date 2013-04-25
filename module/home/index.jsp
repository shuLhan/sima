<%@ page import="com.x10clab.jaring.Jaring" %>
<%@ page contentType="text/html" %>
<html>
<head>
	<title><%= Jaring._title %></title>

	<script>
		var _g_root			= "<%= Jaring._path %>";
		var _g_module_dir	= "<%= Jaring._path + Jaring._path_mod %>"
		var _g_module_path	= "${pageContext.request.requestURI}";
		var _g_title		= "<%= Jaring._title %>";
	</script>

	<link rel="stylesheet" type="text/css" href="<%= Jaring._path %>/js/extjs/resources/css/ext-all-neptune.css" />
	<link rel="stylesheet" type="text/css" href="<%= Jaring._path %>/css/jaring.css" />

	<script type="text/javascript" src="<%= Jaring._path %>/js/extjs/ext-all-debug.js"></script>
	<script type="text/javascript" src="<%= Jaring._path %>/js/jaring.js"></script>

	<script type="text/javascript" src="${pageContext.request.requestURI}layout.js"></script>
</head>
<body>
</body>
</html>
