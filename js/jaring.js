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
	,	fieldId		:"id"		// used later by GridPaging.compDetails.
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

		/* Check and merge for extra parameters */
		if (config.extraParams && typeof (config.extraParams) === "object") {
			this.proxy.extraParams = Ext.merge (this.proxy.extraParams, config.extraParams);
		}
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
		perm			:0			// user permission on this module.
	,	autoCreateForm	:true		// automatically create form for add/edit data in grid.
	,	action			:"read"		// grid current action (read, create, update, delete).
	,	compDetails		:[]			// list of data details, for master-detail grid.
	,	formDock		:"right"	// position of form in grid.
	,	showButtonText	:true		// false, to show only icon on buttons.
	}

,	initComponent	:function ()
	{
		this.callParent (arguments);

		/* Add row number to grid */
		this.columns.splice (0, 0, { xtype : "rownumberer" });

		this.createButtonBar ();
		this.createPagingBar ();
		this.createForm ();

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
			});

		this.buttonEdit		= Ext.create ("Ext.button.Button", {
				text		:this.showButtonText ? "Edit" : ""
			,	itemId		:"edit"
			,	iconCls		:"edit"
			,	disabled	:true
			});

		this.buttonDelete	= Ext.create ("Ext.button.Button", {
				text		:this.showButtonText ? "Delete" : ""
			,	itemId		:"delete"
			,	iconCls		:"delete"
			,	disabled	:true
			});

		this.buttonRefresh	= Ext.create ("Ext.button.Button", {
				text		:this.showButtonText ? "Refresh" : ""
			,	itemId		:"refresh"
			,	iconCls		:"refresh"
			,	disabled	:false
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
				,	'-'
				,	this.buttonAdd
				,	this.buttonEdit
				,	' '
				,	this.buttonRefresh
				]
			});

		this.addDocked (this.buttonBar);
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
		if (undefined != this.autoCreateForm && false == this.autoCreateForm) {
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
			});

		this.form.buttonCancel	= Ext.create ("Ext.button.Button", {
				text			:"Cancel"
			,	itemId			:"cancel"
			,	iconCls			:"cancel"
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

,	clearData	:function ()
	{
		this.store.loadData ([], false);
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
				return;
			}
		}
		if (this.perm < 3) {
			return;
		}

		this.action	= "update";

		if (true == this.autoCreateForm) {
			this.form.setTitle ("Updating data");
			this.form.show ();
		}

		if (this.afterEdit && typeof (this.afterEdit) === "function") {
			this.afterEdit ();
		}
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

		/* Generate url based on user action */
		f.submit ({
			url		:this.getStore ().url +"?action="+ this.action
		,	scope	:this
		,	success	:function (form, action)
			{
				Jx.msg.info (action.result.data);
				this.getStore ().reload ();
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
					Jx.msg.error ("Ajax communication failed");
					break;
				case Ext.form.action.Action.SERVER_INVALID:
					Jx.msg.error (action.result.data);
				}
			}
		});
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
});
