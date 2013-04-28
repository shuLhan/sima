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
	extend			:"Ext.grid.Panel"
,	alias			:"jx.gridpaging"
,	layout			:"fit"
,	titleAlign		:"center"
,	enableLocking	:true
,	viewConfig		:
	{
        enableTextSelection	:true
    }
,	config			:
	{
		perm			:0		// user permission on this module.
	,	autoCreateForm	:true	// automatically create form for add/edit data in grid.
	,	action			:"read"	// grid current action (read, create, update, delete).
	}

,	constructor	:function (config)
	{
		var barName;
		var i;
		var column;

		config.columns.splice (0, 0, { xtype : "rownumberer" });

		this.callParent (arguments);
		this.initConfig (config);

		this.buttonAdd		= Ext.create ("Ext.button.Button", {
				text		:"Add"
			,	itemId		:"add"
			,	iconCls		:"add"
			,	disabled	:true
			});

		this.buttonEdit		= Ext.create ("Ext.button.Button", {
				text		:"Edit"
			,	itemId		:"edit"
			,	iconCls		:"edit"
			,	disabled	:true
			});

		this.buttonDelete	= Ext.create ("Ext.button.Button", {
				text		:"Delete"
			,	itemId		:"delete"
			,	iconCls		:"delete"
			,	disabled	:true
			});

		this.buttonRefresh	= Ext.create ("Ext.button.Button", {
				text		:"Refresh"
			,	itemId		:"refresh"
			,	iconCls		:"refresh"
			,	disabled	:false
			});
			
		this.buttonAdd.setHandler (this.doAdd, this);
		this.buttonEdit.setHandler (this.doEdit, this);
		this.buttonDelete.setHandler (this.doDelete, this);
		this.buttonRefresh.setHandler (this.doRefresh, this);

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
				,	'-'
				,	this.buttonAdd
				,	this.buttonEdit
				,	' '
				,	this.buttonRefresh
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
			,	pageSize	:_g_paging_size
			,	plugins		:new Ext.ux.ProgressBarPager()
			});

		this.addDocked (this.pagingBar);

		/* Listen to user selection on grid row */
		this.on ("selectionchange", this.onSelectionChange, this);

		/* Create form only if user enable it */
		if (undefined != config.autoCreateForm && false == config.autoCreateForm) {
			return;
		}

		this.form			= Ext.create ("Ext.form.Panel", {
				id			:(config.id
								? config.id + barName
								: (config.itemId
									? config.itemId + barName
									: "JxGridPaging" + barName
								)
							)
			,	dock		:"right"
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
		for (var i = 0; i < config.columns.length; i++) {
			c = config.columns[i];
			if (undefined != c.editor) {
				c.editor.fieldLabel	= c.header;
				c.editor.name		= c.dataIndex;

				this.form.add (c.editor);
			}
		}

		/* Add button bar to form */
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

		barName				= "FormButtonBar";
		this.form.buttonBar	= Ext.create ("Ext.toolbar.Toolbar", {
				id			:(config.id
								? config.id + barName
								: (config.itemId
									? config.itemId + barName
									: "JxGridPaging"+ barName
								)
							)
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

		this.addDocked (this.form);
	}

,	doAdd		:function ()
	{
		if (this.perm < 2) {
			return;
		}
		this.action	= "create";
		this.form.setTitle ("Create new data");
		this.form.show ();
	}

,	doEdit		:function ()
	{
		if (this.perm < 3) {
			return;
		}
		this.action	= "update";
		this.form.setTitle ("Updating data");
		this.form.show ();
	}

,	doDelete	:function ()
	{
		if (this.perm < 4) {
			return;
		}
		Jx.msg.confirm (
			function ()
			{
				this.action	= "destroy";
				this.doFormSave ();
			}
		,	this
		);
	}

,	doRefresh	:function (perm)
	{
		this.perm = perm;

		this.buttonAdd.setDisabled (perm < 2);

		this.store.load ();
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
		if (s) {
			return;
		}
		if (true == this.autoCreateForm) {
			this.form.loadRecord (data[0]);
		}
	}

,	doFormSave		:function ()
	{
		var f = this.form.getForm ();

		if (!f.isValid ()) {
			Jx.msg.error ("Invalid form values!<br/>Please corret/fill form's field with red mark.");
			return;
		}

		/* Generate url based on user action */
		f.submit ({
			url		:this.getStore ().url +"?action="+ this.action
		,	scope	:this
		,	success	:function (form, action)
			{
				Jx.msg.info (action.result.data);
				this.getStore ().reload ();
				this.form.hide ();
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

,	doFormCancel	:function ()
	{
		this.form.hide ();
	}
});
