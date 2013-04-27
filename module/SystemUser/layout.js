/*
	Copyright 2013 x10c-lab.com
	Authors:
		- mhd.sulhan (sulhan@x10c-lab.com)
*/

function JxSystemUser ()
{
	this.id		= "SystemUser";
	this.dir	= _g_module_dir +"/"+ this.id;

	this.store	= Ext.create ("Jx.StorePaging", {
		storeId		:this.id +"Store"
	,	url			:this.dir +"/data.jsp"
	,	fields		:
		[
			"id"
		,	"name"
		,	"password"
		]
	})

,	this.panel	= Ext.create ("Jx.GridPaging", {
		id			:this.id
	,	title		:"System User"
	,	autoDestroy	:true
	,	store		:this.store
	,	columns		:[{
			header		:"User name"
		,	dataIndex	:"name"
		,	flex		:1
		},{
			header		:"User name"
		,	dataIndex	:"name"
		,	flex		:1
		}]
	})

,	this.doRefresh	= function (perm)
	{
		this.panel.doRefresh (perm);
	}
};

/* moduleName = className */
var SystemUser = new JxSystemUser ();
