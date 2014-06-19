/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)

	Custom grid panel with,
	- CRUD buttons (add, edit, refresh, delete)
	- search
	- paging
*/
Ext.define ("Jx.GridPaging", {
	extend			:"Ext.grid.Panel"
,	alias			:"widget.gridpaging"
,	config			:
	{
		perm					:0
		// crud buttons.
	,	plugCrudButtons			:undefined
	,	plugCrudButtonsConfig	:{}
	,	showCrudButtons			:true
		// search bar
	,	plugSearchField			:undefined
	,	plugSearchFieldConfig	:{}
	,	showSearchField			:true

	,	pagingBar				:undefined
	,	showPagingBar			:true
	,	selectedData			:[]

		// grid properties
	,	titleAlign		:"center"
	,	viewConfig		:
		{
			enableTextSelection	:true
		}
	}
//{{{ constructor
,	constructor		:function (config)
	{
		var	opts = {};

		Ext.merge (opts, this.config);
		Ext.merge (opts, config);

		this.callParent ([opts]);
		this.initConfig (opts);

		if (opts.showPagingBar) {
			this.createPagingBar ();
		}

		// Inject CRUD buttons to panel.
		if (opts.showCrudButtons) {
			this.plugCrudButtons	= Ext.create ("Jx.plugin.CrudButtons"
									, opts.plugCrudButtonsConfig
									);
			this.addPlugin (this.plugCrudButtons);
		}

		// Inject search field.
		if (opts.showSearchField) {
			this.plugSearchField	= Ext.create ("Jx.plugin.SearchField"
									, opts.plugSearchFieldConfig
									);

			this.addPlugin (this.plugSearchField);
		}

		// Register events.
		this.addEvents ("refresh");

		this.on ("selectionchange", this._onSelectionChange, this);
	}
//}}}
//{{{ Add paging toolbar to the bottom of grid panel.
,	createPagingBar	:function ()
	{
		var barName		= "PagingBar";
		var id			= (this.id
								? this.id + barName
								: (this.itemId
									? this.itemId + barName
									: "JxGridPaging" + barName
								)
						);

		this.pagingBar	= Ext.create ("Ext.toolbar.Paging", {
				itemId		:id
			,	store		:this.store
			,	displayInfo	:true
			,	dock		:"bottom"
			,	pageSize	:_g_paging_size
			,	plugins		:new Ext.ux.ProgressBarPager()
			});

		this.addDocked (this.pagingBar);
	}
//}}}
//{{{ function : remove all data in store.
,	clearData	:function ()
	{
		this.store.loadData ([], false);
	}
//}}}
/*
	beforeSelectionChange	:function, overridden by instance, return false to cancel.
	afterSelectionChange	:function, overridden by instance.
*/
//{{{ event handler : on row selected.
,	_onSelectionChange		:function (model, data, e)
	{
		var s	= (data.length <= 0);
		var id	= 0;

		if (this.beforeSelectionChange && typeof (this.beforeSelectionChange) === "function") {
			if (this.beforeSelectionChange (model, data, e) === false) {
				return false;
			}
		}

		this.selectedData = data;

		/* Refresh grid details */
		if (data.length > 0) {
			id	= data[0].get (this.store.getIdProperty ());
		}

		if (this.onSelectionChange
		&& typeof (this.onSelectionChange) === "function") {
			this.onSelectionChange (model, data, e);
		}

		if (this.afterSelectionChange
		&& typeof (this.afterSelectionChange) === "function") {
			this.afterSelectionChange (model, data, e);
		}
	}
//}}}
//{{{ function : refresh this grid
,	doRefresh	:function (perm)
	{
		this.perm = perm;
		this.fireEvent ("refresh", perm);
	}
//}}}
});
