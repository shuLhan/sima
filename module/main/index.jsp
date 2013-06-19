<%@ page import="com.x10clab.jaring.Jaring" %>
<%@ page contentType="text/html" %>
<%
	Jaring.getCookiesValue (request);
%>
<html>
<head>
	<title><%= Jaring._title %></title>

	<link rel="shortcut icon" href="<%= Jaring._path %>/images/favicon.ico"/>

	<script>
		var _g_root			= "<%= Jaring._path %>";
		var _g_module_dir	= "<%= Jaring._path + Jaring._path_mod %>/";
		var _g_module_path	= "${pageContext.request.requestURI}";
		var _g_content_type	= <%= Jaring._content_type %>;
		var _g_paging_size	= <%= Jaring._paging_size %>;
		var _g_title		= "<%= Jaring._title %>";
		var _g_c_username	= "<%= Jaring._c_username %>";
		var _g_menu_mode	= <%= Jaring._menu_mode %>;
	</script>

	<link rel="stylesheet" type="text/css" href="<%= Jaring._path %>/js/extjs/resources/css/ext-all-neptune.css" />
	<link rel="stylesheet" type="text/css" href="<%= Jaring._path %>/css/jaring.css" />
	<link rel="stylesheet" type="text/css" href="${pageContext.request.requestURI}layout.css" />

	<script type="text/javascript" src="<%= Jaring._path %>/js/extjs/ext-all-debug.js"></script>
	<script type="text/javascript" src="<%= Jaring._path %>/js/extjs/ext-theme-neptune.js"></script>

	<script type="text/javascript" src="<%= Jaring._path %>/js/extjs/ux/StatusBar.js"></script>
	<script type="text/javascript" src="<%= Jaring._path %>/js/extjs/ux/BoxReorderer.js"></script>
	<script type="text/javascript" src="<%= Jaring._path %>/js/extjs/ux/CheckCombo.js"></script>
	<script type="text/javascript" src="<%= Jaring._path %>/js/extjs/ux/DataTip.js"></script>
	<script type="text/javascript" src="<%= Jaring._path %>/js/extjs/ux/LiveSearchAddGridPanel.js"></script>
	<script type="text/javascript" src="<%= Jaring._path %>/js/extjs/ux/LiveSearchGridPanel.js"></script>
	<script type="text/javascript" src="<%= Jaring._path %>/js/extjs/ux/GridHeaderToolTip.js"></script>
	<script type="text/javascript" src="<%= Jaring._path %>/js/extjs/ux/ProgressBarPager.js"></script>

	<script type="text/javascript" src="<%= Jaring._path %>/js/jaring.js"></script>
	<script type="text/javascript" src="<%= Jaring._path %>/js/jx/StorePaging.js"></script>
	<script type="text/javascript" src="<%= Jaring._path %>/js/jx/ComboPaging.js"></script>
	<script type="text/javascript" src="<%= Jaring._path %>/js/jx/Form.js"></script>
	<script type="text/javascript" src="<%= Jaring._path %>/js/jx/GridPagingRowEditor.js"></script>
	<script type="text/javascript" src="<%= Jaring._path %>/js/jx/GridPagingFormEditor.js"></script>

	<script type="text/javascript" src="${pageContext.request.requestURI}layout.js"></script>
</head>
<body>
    <div id="loading-mask" style=""></div>
    <div id="loading">
        <div class="loading-indicator">
            <img src="<%= Jaring._path %>/images/loading.gif" width="32" height="32" style="margin-right:8px;float:left;vertical-align:top;"/>
			<%= Jaring._title %>
			-
			<a href="http://www.x10c-lab.com">x10c-lab.com</a>
            <br />
			<span id="loading-msg">Loading application...</span>
        </div>
    </div>
</body>
</html>
