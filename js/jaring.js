/*
	Copyright 2013 x10c-lab.com
	Authors:
		- mhd.sulhan (sulhan@x10c-lab.com)
*/
/*
	Global javascript for application.
 */
Jx = {
	pageSize:_g_paging_size
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

		if (config.url) {
			this.getProxy ().api = {
					read	:config.url +"?action=read"
				,	create	:config.url +"?action=create"
				,	update	:config.url +"?action=update"
				,	destroy	:config.url +"?action=destroy"
				}
		} else if (config.api) {
			this.getProxy ().api = config.api;
		}
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
		perm			:0
	,	buttonAdd		:Ext.create ("Ext.button.Button", {
				text		:"Add"
			,	itemId		:"add"
			,	iconCls		:"add"
			,	disabled	:true
			})

	,	buttonEdit		:Ext.create ("Ext.button.Button", {
				text		:"Edit"
			,	itemId		:"edit"
			,	iconCls		:"edit"
			,	disabled	:true
			})

	,	buttonDelete	:Ext.create ("Ext.button.Button", {
				text		:"Delete"
			,	itemId		:"delete"
			,	iconCls		:"delete"
			,	disabled	:true
			})

	,	buttonRefresh	:Ext.create ("Ext.button.Button", {
				text		:"Refresh"
			,	itemId		:"refresh"
			,	iconCls		:"refresh"
			,	disabled	:false
			})

	,	doAdd		:function ()
		{
			if (this.perm < 2) {
				return;
			}
		}

	,	doEdit		:function ()
		{
			if (this.perm < 3) {
				return;
			}
		}

	,	doDelete	:function ()
		{
			if (this.perm < 4) {
				return;
			}
		}

	,	doRefresh	:function (perm)
		{
			this.perm = perm;

			this.down ("#add").setDisabled (perm < 2);

			this.getStore ().load ();
		}

	,	onSelectionChange	:function (model, data, e)
		{
			var s = (data.length <= 0);

			if (this.perm >= 4) {
				this.buttonDelete.setDisabled (s);
			}
			if (this.perm >= 3) {
				this.buttonEdit.setDisabled (s);
			}
		}
	}

,	constructor	:function (config)
	{
		var barName;

		this.callParent (arguments);
		this.initConfig (config);

		this.buttonAdd.setHandler (this.doAdd);
		this.buttonEdit.setHandler (this.doEdit);
		this.buttonDelete.setHandler (this.doDelete);
		this.buttonRefresh.setHandler (this.doRefresh);

		/* Add buttons bar to the top of grid panel. */
		barName			= "ButtonBar";
		this.buttonBar	= Ext.create ("Ext.toolbar.Toolbar", {
				id			:(config.id
								? config.id + barName
								: (config.itemId
									? config.itemId + barName
									: "JxGridPaging"+ barName
								)
							)
			,	dock		:"top"
			,	items		:
				[
					this.buttonDelete
				,	this.buttonRefresh
				,	this.buttonEdit
				,	this.buttonAdd
				]
			});

		this.addDocked (this.buttonBar);

		/* Add paging toolbar to the bottom of grid panel. */
		barName			= "PagingBar";
		this.pagingBar	= Ext.create ("Ext.toolbar.Paging", {
				id			:(config.id
								? config.id + barName
								: (config.itemId
									? config.itemId + barName
									: "JxGridPaging" + barName
								)
							)
			,	store		:config.store
			,	displayInfo	:true
			,	dock		:"bottom"
			});

		this.addDocked (this.pagingBar);

		/* Listen to user selection on grid row */
		this.on ("selectionchange", this.onSelectionChange, this);
	}
});
