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
,	alias			:"widget.jx.gridpaging"
,	layout			:"fit"
,	titleAlign		:"center"
,	enableLocking	:true
,	viewConfig		:
	{
		enableTextSelection	:true
	}

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
	,	selectedData			:[]
		// list of data details, for master-detail grid.
	,	compDetails				:[]
	,	buttons					:[]
	}

,	constructor		:function (config)
	{
		var	opts = Ext.merge ({}, this.config);
			opts = Ext.merge (opts, config);

		this.callParent (arguments);
		this.initConfig (opts);

		this.createPagingBar ();

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

	/*
		Add paging toolbar to the bottom of grid panel.
	*/
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
				id			:id
			,	store		:this.store
			,	displayInfo	:true
			,	dock		:"bottom"
			,	pageSize	:_g_paging_size
			,	plugins		:new Ext.ux.ProgressBarPager()
			});

		this.addDocked (this.pagingBar);
	}

,	clearData	:function ()
	{
		this.store.loadData ([], false);
	}

/*
	beforeSelectionChange	:function, overridden by instance, return false to cancel.
	afterSelectionChange	:function, overridden by instance.
*/
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
			id	= data[0].get (this.getStore ().getIdProperty ());

			if (this.onSelectionChange
			&& typeof (this.onSelectionChange) === "function") {
				this.onSelectionChange (model, data, e);
			}

			if (this.afterSelectionChange
			&& typeof (this.afterSelectionChange) === "function") {
				this.afterSelectionChange (model, data, e);
			}
		}
	}

,	doRefresh	:function (perm)
	{
		this.fireEvent ("refresh", perm);
	}

/*
	beforeFormSave	:function, overridden by instance, return false to cancel.
	afterFormSave	:function, overridden by instance.
*/

/*
	beforeFormCancel	:function, overridden by instance, return false to cancel.
	afterFormCancel		:function, overridden by instance.
*/
});
