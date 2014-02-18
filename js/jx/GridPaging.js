/*
	Copyright 2013 - x10c-lab.com
	Authors:
		- mhd.sulhan (sulhan@x10c-lab.com)

	Custom grid panel with default buttons (add, edit, refresh, delete) and paging.
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
	/*
		Custom properties.
	*/
,	config			:
	{
		perm				:0			// user permission on this module.
	,	buttonAdd			:undefined
	,	buttonEdit			:undefined
	,	buttonDelete		:undefined
	,	buttonRefresh		:undefined
	,	searchField			:undefined
	,	showSearchField		:true
	,	buttonBar			:undefined
	,	pagingBar			:undefined
		// list of buttons that will be showed at the top of the bar.
	,	buttonBarList		:["add", "edit", "delete", "refresh"]
	,	compDetails			:[]			// list of data details, for master-detail grid.
	,	showButtonText		:false		// true, to show icon and text on buttons.
	,	lastSearchStr		:""
	,	selectedData		:[]			// array of selected row
	,	buttons				:[]
	}

,	constructor		:function (config)
	{
		var	opts = Ext.merge ({}, this.config);
			opts = Ext.merge (opts, config);

		this.callParent (arguments);
		this.initConfig (opts);

		this.createButtonBar (opts);
		this.createPagingBar ();

		this.on ("selectionchange", this._onSelectionChange, this);
	}

,	createButtonBar	:function (config)
	{
		this.buttonAdd		= Ext.create ("Ext.button.Button", {
				text		:config.showButtonText ? "Add" : ""
			,	itemId		:"add"
			,	iconCls		:"add"
			,	disabled	:true
			,	hidden		:true
			,	tooltip		:"Add new record"
			});

		this.buttonEdit		= Ext.create ("Ext.button.Button", {
				text		:config.showButtonText ? "Edit" : ""
			,	itemId		:"edit"
			,	iconCls		:"edit"
			,	disabled	:true
			,	hidden		:true
			,	tooltip		:"Edit selected record"
			});

		this.buttonDelete	= Ext.create ("Ext.button.Button", {
				text		:config.showButtonText ? "Delete" : ""
			,	itemId		:"delete"
			,	iconCls		:"delete"
			,	disabled	:true
			,	hidden		:true
			,	tooltip		:"Delete selected record"
			});

		this.buttonRefresh	= Ext.create ("Ext.button.Button", {
				text		:config.showButtonText ? "Refresh" : ""
			,	itemId		:"refresh"
			,	iconCls		:"refresh"
			,	disabled	:false
			,	hidden		:true
			,	tooltip		:"Refresh data"
			});

		this.searchField	= Ext.create ("Jx.SearchField", {
				itemId		:"searchfield"
			});

		this.buttonAdd.setHandler (this._doAdd, this);
		this.buttonEdit.setHandler (this._doEdit, this);
		this.buttonDelete.setHandler (this._doDelete, this);
		this.buttonRefresh.setHandler (this.doReload, this);

		/* Add buttons bar to the top of grid panel. */
		var barName		= "ButtonBar";
		var id			= (config.id
								? config.id + barName
								: (config.itemId
									? config.itemId + barName
									: "JxGridPaging"+ barName
								)
						);

		this.buttonBar	= Ext.create ("Ext.toolbar.Toolbar", {
				id			:id
			,	dock		:"top"
			});

		this.buttonBar.add (this.buttonDelete);
		this.buttonBar.add ("-");
		this.buttonBar.add (this.buttonEdit);
		this.buttonBar.add (this.buttonAdd);
		this.buttonBar.add ("-");
		this.buttonBar.add (this.buttonRefresh);

		if (config.addButtons && config.addButtons.length > 0) {
			this.buttonBar.add ("-");
			for (var i = 0; i < config.addButtons.length; i++) {
				this.buttonBar.add (config.addButtons[i]);
			}
		}

		if (config.showSearchField == true) {
			this.buttonBar.add ("->");
			this.buttonBar.add (this.searchField);
		}

		this.addDocked (this.buttonBar);

		/* Show/hide button based on user configuration */
		for (var i = 0; i < config.buttonBarList.length; i++) {
			switch (config.buttonBarList[i]) {
			case "add":
				this.buttonAdd.show ();
				break;
			case "edit":
				this.buttonEdit.show ();
				break;
			case "delete":
				this.buttonDelete.show ();
				break;
			case "refresh":
				this.buttonRefresh.show ();
				break;
			}
		}

		this.searchField.on ("specialkey", this.doSearch, this);
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

,	getSelectedData	:function ()
	{
		this.selectedData = this.getSelectionModel ().getSelection ();
	}

/*
	beforeSearch	:function, overridden by instance, return false to cancel.
	afterSearch		:function, overridden by instance.
*/
,	doSearch	:function (f, e)
	{
		var v = f.getValue ();

		if (e.getKey ()	!= e.ENTER) {
			return;
		}
		if (this.beforeSearch && typeof (this.beforeSearch) === "function") {
			if (this.beforeSearch (v) == false) {
				return;
			}
		}

		this.lastSearchStr					= v;
		this.store.proxy.extraParams.action	= this.store.action = "read";
		this.store.proxy.extraParams.query	= v;
		this.store.load ();

		if (this.afterSearch && typeof (this.afterSearch) === "function") {
			this.afterSearch (v);
		}
	}

/*
	beforeAdd	:function, overridden by instance, return false to cancel.
	afterAdd	:function, overridden by instance.
*/
,	_doAdd		:function ()
	{
		if (this.beforeAdd && typeof (this.beforeAdd) === "function") {
			if (this.beforeAdd () == false) {
				return false;
			}
		}
		if (this.perm < 2) {
			return false;
		}

		this.store.proxy.extraParams.action	= this.store.action = "create";

		if (this.doAdd && (typeof (this.doAdd) === "function")) {
			this.doAdd ();
		}

		if (this.afterAdd && typeof (this.afterAdd) === "function") {
			this.afterAdd ();
		}

		return true;
	}

/*
	beforeEdit	:function, overridden by instance, return false to cancel.
	afterEdit	:function, overridden by instance.
*/
,	_doEdit		:function ()
	{
		if (this.beforeEdit && typeof (this.beforeEdit) === "function") {
			if (this.beforeEdit () == false) {
				return false;
			}
		}
		if (this.perm < 3) {
			return false;
		}

		this.store.proxy.extraParams.action	= this.store.action = "update";

		// check user selection
		this.getSelectedData ();

		if (this.selectedData.length <= 0) {
			return false;
		}
		if (this.doEdit && (typeof (this.doEdit) === "function")) {
			this.doEdit ();
		}
		if (this.afterEdit && typeof (this.afterEdit) === "function") {
			this.afterEdit ();
		}

		return true;	// return true to allow row editor
	}

/*
	beforeDelete	:function (), overridden by instance, return false to cancel.
	afterDelete		:function (), overridden by instance.
*/
,	_doDelete	:function ()
	{
		if (this.beforeDelete && typeof (this.beforeDelete) === "function") {
			if (this.beforeDelete () == false) {
				return false;
			}
		}
		if (this.perm < 4) {
			return false;
		}

		// check user selection
		this.getSelectedData ();

		if (this.selectedData.length <= 0) {
			return false;
		}

		Jx.msg.confirm (
			function ()
			{
				this.store.proxy.extraParams.action	= this.store.action = "destroy";

				if (this.doDelete && (typeof (this.doDelete) === "function")) {
					this.doDelete ();
				}

				if (this.afterDelete && typeof (this.afterDelete) === "function") {
					this.afterDelete ();
				}
			}
		,	this
		);
	}

,	doReload		:function ()
	{
		this.doRefresh (this.perm);
	}

/*
	beforeRefresh	:function, overridden by instance, return false to cancel.
	afterRefresh	:function, overridden by instance.
*/
,	doRefresh		:function (perm)
	{
		if (this.beforeRefresh && typeof (this.beforeRefresh) === "function") {
			if (this.beforeRefresh () == false) {
				return;
			}
		}

		this.perm			= perm;
		this.buttonAdd.setDisabled (perm < 2);
		this.getSelectionModel ().deselectAll ();
		this.store.proxy.extraParams.action	= this.store.action = "read";
		this.store.load ();

		if (this.afterRefresh && typeof (this.afterRefresh) === "function") {
			this.afterRefresh ();
		}
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
			if (this.beforeSelectionChange (model, data, e) == false) {
				return;
			}
		}
		if (this.perm >= 4) {
			this.buttonDelete.setDisabled (s);
		}
		if (this.perm >= 3) {
			this.buttonEdit.setDisabled (s);
		}

		/* Refresh grid details */
		if (data.length > 0) {
			id	= data[0].get (this.getStore ().getFieldId ());

			for (var i = 0, c = null; i < this.compDetails.length; i++) {
				this.compDetails[i].doRefresh (this.perm, id);
			}

			if (this.onSelectionChange && typeof (this.onSelectionChange) === "function") {
				this.onSelectionChange (model, data, e);
			}

			if (this.afterSelectionChange && typeof (this.afterSelectionChange) === "function") {
				this.afterSelectionChange (model, data, e);
			}
		}
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
