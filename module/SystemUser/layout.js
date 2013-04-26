/*
	Copyright 2013 x10c-lab.com

	Authors:
		- mhd.sulhan (sulhan@x10c-lab.com)
*/
var JxSystemUserStore	= Ext.create ("Jx.StorePaging", {
	storeId	:"JxSystemUserStore"
,	fields	:
	[
		"id"
	,	"name"
	,	"password"
	]
,	url		:"/module/SystemUser/data.jsp"
});

var JxSystemUser	= Ext.create ("Jx.GridPaging", {
	id			:"JxSystemUser"
,	title		:"System User"
,	closable	:true
,	autoDestroy	:true
,	store		:JxSystemUserStore
,	columns		:
	[{
		header		:"User name"
	,	dataIndex	:"name"
	}]

,	do_refresh	:function ()
	{
		console.log ("instance");
	}
});
