/*
	Copyright 2013 x10c-lab.com
	Authors:
		- mhd.sulhan (sulhan@x10c-lab.com)
*/

Ext.QuickTips.init();

/*
	Various fixes for ExtJS bug.
*/

/* Tooltip windows too small */
delete Ext.tip.Tip.prototype.minWidth;

/* Row editor is not sending "edit" event when column locked is true */
Ext.override (Ext.grid.locking.View, {
	focus: function() {
		var p = this.getSelectionModel().getCurrentPosition(),
			v = p && p.view ? p.view : this.normalView;

		v.focus();
    }
});

/*
	Default properties for Ext components.
*/

/*
	Ext.data.Store.
	- Set "autoLoad" and "autoSync" default to false.
	- Set "autoDestroy" to true.
	- Add function renderData to store, to render column using store.
*/
Ext.override (Ext.data.Store, {
		autoLoad	:false
	,	autoSync	:false
	,	autoDestroy	:true
	,	renderData	:function (valueField, displayField)
		{
			var store = this;
			return function (v) {
				var i = store.find (valueField, v);
				if (i < 0) {
					return v;
				}
				var r = store.getAt (i);
				return r ? r.get (displayField) : "[no data found]";
			}
		}
	});

/*
	Ext.form.Panel
	- Set default label align to "right".
	- Set default layout to "anchor".
	- Set default item type to "textfield".
	- Set default form item anchor to "100%".
*/
Ext.override (Ext.form.Panel, {
		autoScroll	:true
	,	bodyPadding	:10
	,	border		:false
	,	layout		:"anchor"
	,	titleAlign	:"center"
	,	defaults	:
		{
			xtype		:"textfield"
		,	anchor		:"100%"
		,	labelAlign	:"right"
		}
});

/*
	Global javascript for application.
 */
Jx = {
	pageSize:_g_paging_size
,	msg		: {
		el				:""
	,	AJAX_FAILURE	:"AJAX communication failed!"
	,	AJAX_SUCCESS	:"Data has been saved!"
	,	ACTION_UNKNOWN	:"Unknown action "
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
			m.slideIn ("t").ghost ("t", { delay: delay, remove: true });
		}

	,	info	:function (format)
		{
			this.display ("Information", format, "info", 2000);
		}

	,	error	:function (format)
		{
			this.display ("Error", format, "error", 4000);
		}

	,	confirm	:function (yesCallback, scope)
		{
			Ext.Msg.confirm (
				"Confirmation"
			,	"Selected data will be deleted. <br/> Are you sure?"
			,	function (buttonId, text, me)
				{
					if (buttonId == "yes") {
						if (yesCallback && typeof (yesCallback) === "function") {
							yesCallback.call (scope);
						}
					}
				}
			);
		}
	}
};

/*
	Custom store with AJAX and JSON.
*/
Ext.define ("Jx.Store", {
	extend		:"Ext.data.Store"
,	alias		:"jx.store"
,	config		:
	{
		proxy		:
		{
			type		:"ajax"
		,	reader		:
			{
				type		:"json"
			,	root		:"data"
			}
		,	writer		:
			{
				type		:"json"
			,	allowSingle	:false
			}
		}
	}

,	constructor	:function (config)
	{
		this.callParent (arguments);
		this.initConfig (config);

		if (config.url) {
			this.getProxy ().api = {
					read	:config.url
				,	create	:config.url
				,	update	:config.url
				,	destroy	:config.url
				}
		} else if (config.api) {
			this.getProxy ().api = config.api;
		}

		/* Check and merge for extra parameters */
		if (config.extraParams && typeof (config.extraParams) === "object") {
			this.proxy.extraParams = Ext.merge (this.proxy.extraParams, config.extraParams);
		}
	}
});

/*
	Custom store for Jx.GridPaging with AJAX, JSON, paging, and searching capability.
*/
Ext.define ("Jx.StorePaging", {
	extend		:"Jx.Store"
,	alias		:"jx.storepaging"
,	config		:
	{
		remoteFilter:true
	,	pageSize	:Jx.pageSize
	,	fieldId		:"id"		// used later by GridPaging.compDetails.
	,	proxy		:
		{
			type		:"ajax"
		,	filterParam	:undefined
		,	extraParams	:
			{
				action			:"read"
			,	query			:""
			}
		,	reader		:
			{
				type			:"json"
			,	root			:"data"
			,	totalProperty	:"total"
			}
		,	writer		:
			{
				type			:"json"
			,	allowSingle		:false
			}
		}
	}

,	constructor	:function (config)
	{
		this.callParent (arguments);
		this.initConfig (config);
	}

,	getFieldId	:function ()
	{
		return this.fieldId
	}
});

/*
	Custom combobox with paging and searching.
*/
Ext.define ("Jx.ComboPaging", {
	extend			:"Ext.form.field.ComboBox"
,	alias			:"jx.combopaging"
,	forceSelection	:true
,	pageSize		:_g_paging_size
,	shrinkWrap		:3
,	typeAhead		:true
,	typeAheadDelay	:500
,	config			:
	{
	}

,	initComponent	:function ()
	{
		this.callParent (arguments);
	}
});

/*
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
	,	action				:"read"		// grid current action (read, create, update, delete).
	,	compDetails			:[]			// list of data details, for master-detail grid.
	,	formDock			:"right"	// position of form in grid.
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

		this.form			= Ext.create ("Ext.form.Panel", {
				id			:id
			,	dock		:this.formDock
			,	titleAlign	:"center"
			,	bodyPadding	:10
			,	border		:false
			,	layout		:"anchor"
			,	autoScroll	:true
			,	hidden		:true
			,	defaults	:
				{
					anchor		:"100%"
				,	labelAlign	:"right"
				}
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

		this.createFormButtonBar ();
		this.addDocked (this.form);
	}

	/*
		Add button bar to form.
	*/
,	createFormButtonBar	:function ()
	{
		this.form.buttonSave	= Ext.create ("Ext.button.Button", {
				text		:"Save"
			,	itemId		:"save"
			,	iconCls		:"save"
			,	formBind	:true
			,	tooltip		:"Save record"
			});

		this.form.buttonCancel	= Ext.create ("Ext.button.Button", {
				text			:"Cancel"
			,	itemId			:"cancel"
			,	iconCls			:"cancel"
			,	tooltip			:"Cancel record operation"
			});

		this.form.buttonSave.setHandler (this.doFormSave, this);
		this.form.buttonCancel.setHandler (this.doFormCancel, this);

		var	barName			= "FormButtonBar";
		var id				= (this.id
								? this.id + barName
								: (this.itemId
									? this.itemId + barName
									: "JxGridPaging"+ barName
								)
							);

		this.form.buttonBar	= Ext.create ("Ext.toolbar.Toolbar", {
				id			:id
			,	dock		:"bottom"
			,	border		:true
			,	shadow		:true
			,	items		:
				[
					this.form.buttonCancel
				,	"-"
				,	"->"
				,	"-"
				,	this.form.buttonSave
				]
			});

		this.form.addDocked (this.form.buttonBar);
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

		this.action	= "create";

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

		this.action	= "update";

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
				this.action	= "destroy";

				if (true == this.autoCreateForm) {
					this.doFormSave ();
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

		this.perm = perm;
		this.buttonAdd.setDisabled (perm < 2);
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
,	doFormSave		:function ()
	{
		var f = this.form.getForm ();

		if (!f.isValid ()) {
			Jx.msg.error ("Invalid form values!<br/>Please corret/fill form's field with red mark.");
			return;
		}

		if (this.beforeFormSave && typeof (this.beforeFormSave) === "function") {
			if (this.beforeFormSave () == false) {
				return;
			}
		}

		f.setValues (this.store.proxy.extraParams);

		/* If syncUseStore is true, use store.api to sync data */
		if (true == this.syncUseStore) {
			switch (this.action) {
			case "create":
				this.store.add (f.getValues ());
				break;
			case "update":
				f.updateRecord ();
				break;
			case "destroy":
				this.store.remove (f.getRecord ());
				break;
			default:
				Jx.msg.error (Jx.msg.ACTION_UNKNOWN +"'"+ this.action +"'");
				return;
			}

			this.store.proxy.extraParams.action = this.action;

			this.store.sync ({
				scope	:this
			,	success	:function (batch, action)
				{
					Jx.msg.info (Jx.msg.AJAX_SUCCESS);
					this.store.reload ();
					this.form.hide ();

					if (this.afterFormSave && typeof (this.afterFormSave) === "function") {
						if (this.afterFormSave () == false) {
							return;
						}
					}
				}
			,	failure	:function (batch, action)
				{
					switch (action.failureType) {
					case Ext.form.action.Action.CLIENT_INVALID:
						Jx.msg.error ("Form fields may not be submitted with invalid values");
						break;
					case Ext.form.action.Action.CONNECT_FAILURE:
						Jx.msg.error (Jx.msg.AJAX_FAILURE);
						break;
					case Ext.form.action.Action.SERVER_INVALID:
						Jx.msg.error (action.result.data);
					}
				}
			});

		} else { /* Otherwise use basic form submit */
			var url;

			switch (this.action) {
			case "read":
				url = this.store.proxy.api.read;
				break;
			case "create":
				url = this.store.proxy.api.create;
				break;
			case "update":
				url = this.store.proxy.api.update;
				break;
			case "destroy":
				url = this.store.proxy.api.destroy;
				break;
			default:
				Jx.msg.error (Jx.msg.ACTION_UNKNOWN +"'"+ this.action +"'");
				return;
			}

			/* Generate url based on user action */
			f.submit ({
				url		:url
			,	params	:
				{
					action	:this.action
				}
			,	scope	:this
			,	success	:function (form, action)
				{
					Jx.msg.info (action.result.data);
					this.store.reload ();
					this.form.hide ();

					if (this.afterFormSave && typeof (this.afterFormSave) === "function") {
						if (this.afterFormSave () == false) {
							return;
						}
					}
				}
			,	failure	:function (form, action)
				{
					switch (action.failureType) {
					case Ext.form.action.Action.CLIENT_INVALID:
						Jx.msg.error ("Form fields may not be submitted with invalid values");
						break;
					case Ext.form.action.Action.CONNECT_FAILURE:
						Jx.msg.error (Jx.msg.AJAX_FAILURE);
						break;
					case Ext.form.action.Action.SERVER_INVALID:
						Jx.msg.error (action.result.data);
					}
				}
			});
		}
	}

/*
	beforeFormCancel	:function, overridden by instance, return false to cancel.
	afterFormCancel		:function, overridden by instance.
*/
,	doFormCancel		:function ()
	{
		if (this.beforeFormCancel && typeof (this.beforeFormCancel) === "function") {
			if (this.beforeFormCancel () == false) {
				return;
			}
		}

		this.form.hide ();

		if (this.afterFormCancel && typeof (this.afterFormCancel) === "function") {
			this.afterFormCancel ();
		}
	}

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

		this.store.proxy.extraParams.action = this.action;

		this.store.sync ({
				params		:this.store.proxy.extraParams
			,	scope		:this
			,	success		:function (batch, op)
				{
					Jx.msg.info ("Data has been saved.");
					this.action = 'read';
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

		if ("create" == this.action) {
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
