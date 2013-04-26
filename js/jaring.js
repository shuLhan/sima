/*
	Copyright 2013 x10c-lab.com
	Authors:
		- mhd.sulhan (sulhan@x10c-lab.com)
*/
/*
	Global javascript for application.
 */
Jx = {
	pageSize:50
,	msg		: {
		el		:''
	,	display :function (title, format, cls, delay)
		{
			if (! this.el) {
				this.el = Ext.DomHelper.insertFirst (document.body, {id:'jx-msg'}, true);
			}
			var s = Ext.String.format.apply (String, Array.prototype.slice.call(arguments, 1));
			var m = Ext.DomHelper.append (this.el
					, '<div class="'+ cls +'"><h3>' + title + '</h3><p>' + s + '</p></div>'
					, true);
			m.hide();
			m.slideIn ('t').ghost ("t", { delay: delay, remove: true });
		}

	,	info	:function (format)
		{
			this.display ('Informasi', format, 'info', 2000);
		}

	,	error	:function (format)
		{
			this.display ('Kesalahan', format, 'error', 4000);
		}
	}
};

/*
	Custom store for Jx.GridPaging with AJAX and JSON capability.
*/
Ext.define ("Jx.StorePaging", {
	extend		:"Ext.data.Store"
,	alias		:"jx.storepaging"
,	config		:
	{
		autoLoad	:false
	,	autoSync	:false
	,	pageSize	:Jx.pageSize
	,	proxy		:
		{
			type		:"ajax"
		,	extraParams	:
			{
				action			:"read"
			}
		,	reader		:
			{
				type			:"json"
			,	root			:"data"
			,	totalProperty	:"total"
			}
		}
	}

,	constructor	:function (config)
	{
		this.callParent (arguments);
		this.initConfig (config);
	}
});

/*
	Custom grid panel with default buttons (add, edit, refresh, delete) and paging.
*/
Ext.define ("Jx.GridPaging", {
	extend		:"Ext.grid.Panel"
,	alias		:"jx.gridpaging"
,	config		:
	{
		perm		:0
	,	tbar		:
		[{
			text		:"Delete"
		,	itemId		:"delete"
		,	iconCls		:"delete"
		,	disabled	:true
		,	handler		:function (b)
			{
				b.up ("grid").do_delete ();
			}
		},"-",{
			text		:"Refresh"
		,	itemId		:"refresh"
		,	iconCls		:"refresh"
		,	disabled	:false
		,	handler		:function (b)
			{
				b.up ("grid").do_refresh ();
			}
		},"-",{
			text		:"Edit"
		,	itemId		:"edit"
		,	iconCls		:"edit"
		,	disabled	:true
		,	handler		:function (b)
			{
				b.up ("grid").do_edit ();
			}
		},"-",{
			text		:"Add"
		,	itemId		:"add"
		,	iconCls		:"add"
		,	disabled	:true
		,	handler		:function (b)
			{
				b.up ("grid").do_add ();
			}
		}]
	,	bbar		:[{
			xtype		:"pagingtoolbar"
		,	displayInfo	:true
		}]

	,	do_delete	:function ()
		{
			if (this.perm < 4) {
				return;
			}
		}

	,	do_refresh	:function (perm)
		{
			this.perm = perm;

			this.down ("#add").setDisabled (perm < 2);

			this.getStore ().load ();

			console.log ("parent");
		}

	,	do_edit		:function ()
		{
			if (this.perm < 3) {
				return;
			}
		}

	,	do_add		:function ()
		{
			if (this.perm < 2) {
				return;
			}
		}
	}

,	constructor	:function (config)
	{
		this.callParent (arguments);
		this.initConfig (config);
	}
});
