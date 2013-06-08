/*
	Copyright 2013 - x10c-lab.com
	Authors:
		- mhd.sulhan (sulhan@x10c-lab.com)

	Custom grid panel with default buttons (add, edit, refresh, delete) and paging.
*/
Ext.define ("Jx.GridPaging", {
	extend			:"Ext.grid.Panel"
,	alias			:"jx.gridpaging"
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
	,	buttonBar			:undefined
	,	pagingBar			:undefined
	,	autoCreateForm		:true		// automatically create form for add/edit data in grid.
	,	syncUseStore		:true		// default insert, update, delete using store (page body)
	,	form				:
		{
			buttonSave			:undefined
		,	buttonCancel		:undefined
		,	buttonBar			:undefined
		}
		// list of buttons that will be showed at the top of the bar.
	,	buttonBarList		:["add", "edit", "delete", "refresh"]
	,	autoCreateRowEditor	:false		// automatically create row editor if true
	,	rowEditor			:undefined
	,	compDetails			:[]			// list of data details, for master-detail grid.
	,	dockPosition		:"right"	// position of form in grid.
	,	showButtonText		:false		// true, to show icon and text on buttons.
	,	lastSearchStr		:""
	}

,	initComponent	:function ()
	{
		this.callParent (arguments);

		/* Add row number to grid */
		this.columns.splice (0, 0, { xtype : "rownumberer" });

		this.createButtonBar ();
		this.createPagingBar ();
		this.createForm ();
		this.createRowEditor ();

		/* Listen to user selection on grid row */
		this.on ("selectionchange", this.onSelectionChange, this);
	}

,	createButtonBar	:function ()
	{
		this.buttonAdd		= Ext.create ("Ext.button.Button", {
				text		:this.showButtonText ? "Add" : ""
			,	itemId		:"add"
			,	iconCls		:"add"
			,	disabled	:true
			,	hidden		:true
			,	tooltip		:"Add new record"
			});

		this.buttonEdit		= Ext.create ("Ext.button.Button", {
				text		:this.showButtonText ? "Edit" : ""
			,	itemId		:"edit"
			,	iconCls		:"edit"
			,	disabled	:true
			,	hidden		:true
			,	tooltip		:"Edit selected record"
			});

		this.buttonDelete	= Ext.create ("Ext.button.Button", {
				text		:this.showButtonText ? "Delete" : ""
			,	itemId		:"delete"
			,	iconCls		:"delete"
			,	disabled	:true
			,	hidden		:true
			,	tooltip		:"Delete selected record"
			});

		this.buttonRefresh	= Ext.create ("Ext.button.Button", {
				text		:this.showButtonText ? "Refresh" : ""
			,	itemId		:"refresh"
			,	iconCls		:"refresh"
			,	disabled	:false
			,	hidden		:true
			,	tooltip		:"Refresh data"
			});

		this.searchField	= Ext.create ("Ext.form.field.Text", {
				itemId		:"searchfield"
			,	fieldLabel	:"Search"
			,	labelAlign	:"right"
			,	tooltip		:"Type any string and enter to filter data"
			});

		this.buttonAdd.setHandler (this.doAdd, this);
		this.buttonEdit.setHandler (this.doEdit, this);
		this.buttonDelete.setHandler (this.doDelete, this);
		this.buttonRefresh.setHandler (this.doRefresh, this);

		/* Add buttons bar to the top of grid panel. */
		var barName		= "ButtonBar";
		var id			= (this.id
								? this.id + barName
								: (this.itemId
									? this.itemId + barName
									: "JxGridPaging"+ barName
								)
						);

		this.buttonBar	= Ext.create ("Ext.toolbar.Toolbar", {
				id			:id
			,	dock		:"top"
			,	items		:
				[
					this.buttonDelete
				,	this.buttonAdd
				,	this.buttonEdit
				,	this.buttonRefresh
				,	"->"
				,	this.searchField
				]
			});

		this.addDocked (this.buttonBar);

		/* Show/hide button based on user configuration */
		for (var i = 0; i < this.buttonBarList.length; i++) {
			switch (this.buttonBarList[i]) {
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

,	createForm	:function ()
	{
		/* Create form only if user enable it */
		if (false == this.autoCreateForm) {
			return;
		}

		var barName			= "Form";
		var id				= (this.id
								? this.id + barName
								: (this.itemId
									? this.itemId + barName
									: "JxGridPaging" + barName
								)
							);

		this.form			= Ext.create ("Jx.Form", {
				id			:id
			,	dock		:this.dockPosition
			,	hidden		:true
			,	owner		:this
			,	store		:this.store
			,	syncUseStore:this.syncUseStore
			});

		/* Add each column's editor to form */
		for (var i = 0, c = null; i < this.columns.length; i++) {
			c = this.columns[i];
			if (undefined != c.editor) {
				c.editor.fieldLabel	= c.header;
				c.editor.name		= c.dataIndex;

				this.form.add (c.editor);
			}
		}

		this.addDocked (this.form);
	}

,	createRowEditor	:function ()
	{
		if (true == this.autoCreateRowEditor)
		{
			this.rowEditor		= Ext.create ("Ext.grid.plugin.RowEditing", {
					pluginId	:this.id +"RowEditor"
				});

			/* Add listener for grid row editor */
			this.rowEditor.on ("beforeedit"	, this.doEdit		, this);
			this.rowEditor.on ("edit"		, this.doRowSave	, this);
			this.rowEditor.on ("canceledit"	, this.doRowCancel	, this);

			this.rowEditor.init (this);
		}
	}

,	clearData	:function ()
	{
		this.store.loadData ([], false);
	}

/*
	beforeSearch	:function, overridden by instance, return false to cancel.
	afterSearch		:function, overridden by instance.
*/
,	doSearch	:function (f, e)
	{
		var v = f.getValue ();

		if (e.getKey ()	!= e.ENTER
		||	v			== this.lastSearchStr) {
			return;
		}
		if (this.beforeSearch && typeof (this.beforeSearch) === "function") {
			if (this.beforeSearch () == false) {
				return;
			}
		}

		this.lastSearchStr					= v;
		this.store.proxy.extraParams.query	= v;
		this.store.load ();

		if (this.afterSearch && typeof (this.afterSearch) === "function") {
			this.afterSearch ();
		}
	}

/*
	beforeAdd	:function, overridden by instance, return false to cancel.
	afterAdd	:function, overridden by instance.
*/
,	doAdd		:function ()
	{
		if (this.beforeAdd && typeof (this.beforeAdd) === "function") {
			if (this.beforeAdd () == false) {
				return;
			}
		}
		if (this.perm < 2) {
			return;
		}

		this.store.action	= "create";

		if (true == this.autoCreateForm) {
			this.form.setTitle ("Create new data");
			this.form.getForm ().reset ();
			this.form.show ();
		} else if (true == this.autoCreateRowEditor) {
			this.rowEditor.cancelEdit ();

			var r = this.store.create ();

			this.store.insert (0, r);
			this.rowEditor.startEdit (0, 0);
		}

		if (this.afterAdd && typeof (this.afterAdd) === "function") {
			this.afterAdd ();
		}
	}

/*
	beforeEdit	:function, overridden by instance, return false to cancel.
	afterEdit	:function, overridden by instance.
*/
,	doEdit		:function ()
	{
		if (this.beforeEdit && typeof (this.beforeEdit) === "function") {
			if (this.beforeEdit () == false) {
				return false;
			}
		}
		if (this.perm < 3) {
			return false;
		}

		this.store.action	= "update";

		if (true == this.autoCreateForm) {
			this.form.setTitle ("Updating data");
			this.form.show ();
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
,	doDelete	:function ()
	{
		if (this.beforeDelete && typeof (this.beforeDelete) === "function") {
			if (this.beforeDelete () == false) {
				return;
			}
		}
		if (this.perm < 4) {
			return;
		}
		Jx.msg.confirm (
			function ()
			{
				this.store.action	= "destroy";

				if (true == this.autoCreateForm) {
					this.form.doSave ();
				}
				if (this.afterDelete && typeof (this.afterDelete) === "function") {
					this.afterDelete ();
				}
			}
		,	this
		);
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
		this.store.action	= "read";
		this.store.load ();

		if (this.afterRefresh && typeof (this.afterRefresh) === "function") {
			this.afterRefresh ();
		}
	}

/*
	beforeSelectionChange	:function, overridden by instance, return false to cancel.
	afterSelectionChange	:function, overridden by instance.
*/
,	onSelectionChange		:function (model, data, e)
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
		if (!s) {
			if (true == this.autoCreateForm) {
				this.form.loadRecord (data[0]);
			}
		}

		/* Refresh grid details */
		if (data.length > 0) {
			id	= data[0].get (this.getStore ().getFieldId ());
		}
		for (var i = 0, c = null; i < this.compDetails.length; i++) {
			this.compDetails[i].doRefresh (this.perm, id);
		}
		if (this.afterSelectionChange && typeof (this.afterSelectionChange) === "function") {
			this.afterSelectionChange (model, data, e);
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

/*
	beforeRowSave	:function, overridden by instance, return false to cancel.
	afterRowSave	:function, overridden by instance.
*/
,	doRowSave	:function ()
	{
		if (this.beforeRowSave && typeof (this.beforeRowSave) === "function") {
			if (this.beforeRowSave () == false) {
				return false;
			}
		}

		this.store.proxy.extraParams.action = this.store.action;

		this.store.sync ({
				params		:this.store.proxy.extraParams
			,	scope		:this
			,	success		:function (batch, op)
				{
					Jx.msg.info ("Data has been saved.");

					this.store.proxy.extraParams.action = this.store.action = "read";

					// reload store to retrieve ID of data (for table that depend on ID)
					this.store.reload ();

					if (this.afterRowSave && typeof (this.afterRowSave) === "function") {
						this.afterRowSave ();
					}
				}
			,	failure		:function (batch, op)
				{
					Jx.msg.error ("Ajax communication failed!");
				}
			});
	}

/*
	beforeRowCancel	:function, overridden by instance, return false to cancel.
	afterRowCancel	:function, overridden by instance.
*/
,	doRowCancel	:function ()
	{
		if (this.beforeRowCancel && typeof (this.beforeRowCancel) === "function") {
			if (this.beforeRowCancel () == false) {
				return false;
			}
		}

		if ("create" == this.store.action) {
			this.store.removeAt (0);
			if (this.store.count () > 0) {
				this.getSelectionModel ().select (0);
			}
		}

		if (this.afterRowCancel && typeof (this.afterRowCancel) === "function") {
			this.afterRowCancel ();
		}
	}
});
