/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

Ext.QuickTips.init();

/*
	Various fixes for ExtJS bugs.
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
	- Add function renderData to store, to render column using store.
*/
Ext.override (Ext.data.Store, {
	renderData	:function (valueField, displayField)
		{
			var store = this;
			return function (v) {
				var i = store.find (valueField, v);
				if (i < 0) {
					return v;
				}
				var r = store.getAt (i);
				return r ? r.get (displayField) : "[no data found]";
			};
		}
	});

Ext.override (Ext.Loader, {
	preserveScript	:false
,	garbageCollect	:true
,	enabled			:true
});

/*
	Register our application.
*/
Ext.application ({
	name		:"Jx"
,	appFolder	:_g_root +"js/jx"
,	appProperty	:""
});

Ext.apply (Jx, {
	pageSize	:_g_paging_size
,	msg			:
	{
		el				:""
	,	AJAX_FAILURE	:"AJAX communication failed."
	,	AJAX_SUCCESS	:"Data has been saved."
	,	ACTION_UNKNOWN	:"Unknown action "
	,	CLIENT_INVALID	:"Form fields may not be submitted with invalid values."
	,	SERVER_ERROR	:"Server request error."

	,	display 		:function (title, format, cls, delay)
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

	,	saveChanges	:function (cb, scope)
		{
			Ext.Msg.show ({
				title	:'Save Changes?'
			,	msg		:'You are leaving module that has unsaved changes. Would you like to save your changes?'
			,	buttons	:Ext.Msg.YESNOCANCEL
			,	icon	:Ext.Msg.QUESTION
			,	fn		:cb
			,	scope	:scope
			});
		}
	}
,	mask		:undefined
,	showMask	:function ()
	{
		if (undefined === this.mask) {
			this.mask = Ext.create ("Ext.LoadMask", {
				target		:Ext.getBody ()
			});
		}
		this.mask.show ();
	}
,	hideMask	:function ()
	{
		if (undefined !== this.mask) {
			this.mask.hide ();
		}
	}

	/*
		@return: module directory.
	*/
,	generateModDir	:function (id)
	{
		return _g_module_dir + id.replace (/_/g, "/") +"/";
	}

,	generateItemId	:function (config, prefix, name)
	{
		if (undefined === config) {
			return prefix + name;
		}
		if (config.id) {
			return config.id + name;
		}
		if (config.itemId) {
			return config.itemId + name;
		}
		return prefix + name;
	}

,	chainStoreLoad :function (stores, lastCall, idx)
	{
		if (idx === stores.length) {
			if ("function" === typeof lastCall) {
				lastCall.call ();
			}
			return;
		}
		stores[idx].load (function (r,o,s) {
			Jx.chainStoreLoad (stores, lastCall, idx + 1);
		});
	}
});
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
/*
	Plugin requirements:
	- parent component containt store.
 */
Ext.define ("Jx.plugin.CrudButtons", {
	extend	:"Ext.AbstractPlugin"
,	alias	:"plugin.crudbuttons"

,	config	:
	{
		// order of buttons on toolbar
		buttonBarList		:["delete", "-", "edit", "add", "-", "refresh"]

		// true to show icon and text on buttons.
	,	buttonShowText		:false
	}

,	constructor	:function (config)
	{
		Ext.apply(this, config);
		this.callParent (arguments);
	}

,	init	:function (cmp)
	{
		/* Get or create top toolbar */
		var b		= undefined;
		var tbar	= undefined;
		var tbars	= cmp.getDockedItems ("toolbar[dock='top']");

		if (tbars.length > 0) {
			tbar = tbars[0];
		}

		if (undefined === tbar) {
			tbar		= Ext.create ("Ext.toolbar.Toolbar", {
				dock	:"top"
			});
			cmp.addDocked (tbar);
		}

		cmp.buttonSep = new Array ();

		/* Show/hide button based on user configuration */
		for (var i = 0; i < this.buttonBarList.length; i++) {
			switch (this.buttonBarList[i]) {
			case "-":
				var len = cmp.buttonSep.push (Ext.create ("Ext.toolbar.Separator"));

				tbar.add (cmp.buttonSep[len]);
				break;

			case "add":
				cmp.buttonAdd		= Ext.create ("Ext.button.Button", {
						text		:this.buttonShowText ? "Add" : ""
					,	itemId		:"add"
					,	iconCls		:"add"
					,	disabled	:true
					,	tooltip		:"Add new record"
					});

				cmp.buttonAdd.setHandler (this._doAdd, this);
				tbar.add (cmp.buttonAdd);
				break;

			case "edit":
				cmp.buttonEdit		= Ext.create ("Ext.button.Button", {
						text		:this.buttonShowText ? "Edit" : ""
					,	itemId		:"edit"
					,	iconCls		:"edit"
					,	disabled	:true
					,	tooltip		:"Edit selected record"
					});

				cmp.buttonEdit.setHandler (this._doEdit, this);
				tbar.add (cmp.buttonEdit);
				break;

			case "delete":
				cmp.buttonDelete	= Ext.create ("Ext.button.Button", {
						text		:this.buttonShowText ? "Delete" : ""
					,	itemId		:"delete"
					,	iconCls		:"delete"
					,	disabled	:true
					,	tooltip		:"Delete selected record"
					});

				cmp.buttonDelete.setHandler (this._doDelete, this);
				tbar.add (cmp.buttonDelete);
				break;

			case "refresh":
				cmp.buttonRefresh	= Ext.create ("Ext.button.Button", {
						text		:this.buttonShowText ? "Refresh" : ""
					,	itemId		:"refresh"
					,	iconCls		:"refresh"
					,	disabled	:false
					,	tooltip		:"Refresh data"
					});

				cmp.buttonRefresh.setHandler (this._doRefresh, this);
				tbar.add (cmp.buttonRefresh);
				break;
			}
		}

		cmp.on ("selectionchange", this._onSelectionChange, this);
		cmp.on ("refresh", this._doRefresh, this);
	}

,	destroy	:function ()
	{
		this.cmp.un ("refresh", this._doRefresh, this);
		this.cmp.un ("selectionchange", this._onSelectionChange, this);

		Ext.destroy (this.cmp.buttonRefresh);
		Ext.destroy (this.cmp.buttonDelete);
		Ext.destroy (this.cmp.buttonEdit);
		Ext.destroy (this.cmp.buttonAdd);

		this.cmp.buttonSep.forEach (Ext.destroy, Ext);

		this.callParent (arguments);
	}

/*
	beforeAdd	:function, overridden by instance, return false to cancel.
	afterAdd	:function, overridden by instance.
*/
,	_doAdd		:function ()
	{
		if (this.cmp.beforeAdd && typeof (this.cmp.beforeAdd) === "function") {
			if (this.cmp.beforeAdd () === false) {
				return false;
			}
		}

		if (this.cmp.perm < 2) {
			return false;
		}

		this.cmp.store.proxy.extraParams.action	= this.cmp.store.action = "create";

		if (this.cmp.doAdd && (typeof (this.cmp.doAdd) === "function")) {
			this.cmp.doAdd ();
		}

		if (this.cmp.afterAdd && typeof (this.cmp.afterAdd) === "function") {
			this.cmp.afterAdd ();
		}

		return true;
	}

/*
	beforeEdit	:function, overridden by instance, return false to cancel.
	afterEdit	:function, overridden by instance.
*/
,	_doEdit		:function ()
	{
		if (this.cmp.beforeEdit && typeof (this.cmp.beforeEdit) === "function") {
			if (this.cmp.beforeEdit () === false) {
				return false;
			}
		}
		if (this.cmp.perm < 3) {
			return false;
		}

		this.cmp.store.proxy.extraParams.action	= this.cmp.store.action = "update";

		if (this.cmp.selectedData.length <= 0) {
			return false;
		}

		if (this.cmp.doEdit && (typeof (this.cmp.doEdit) === "function")) {
			this.cmp.doEdit ();
		}
		if (this.cmp.afterEdit && typeof (this.cmp.afterEdit) === "function") {
			this.cmp.afterEdit ();
		}

		return true;	// return true to allow row editor
	}

/*
	beforeDelete	:function (), overridden by instance, return false to cancel.
	afterDelete		:function (), overridden by instance.
*/
,	_doDelete	:function ()
	{
		if (this.cmp.beforeDelete && typeof (this.cmp.beforeDelete) === "function") {
			if (this.cmp.beforeDelete () === false) {
				return false;
			}
		}
		if (this.cmp.perm < 4) {
			return false;
		}

		if (this.cmp.selectedData.length <= 0) {
			return false;
		}

		Jx.msg.confirm (
			function ()
			{
				this.cmp.store.proxy.extraParams.action	= this.cmp.store.action = "destroy";

				if (this.cmp.doDelete && (typeof (this.cmp.doDelete) === "function")) {
					this.cmp.doDelete ();
				}

				if (this.cmp.afterDelete && typeof (this.cmp.afterDelete) === "function") {
					this.cmp.afterDelete ();
				}
			}
		,	this
		);
	}

/*
	beforeRefresh	:function, overridden by instance, return false to cancel.
	afterRefresh	:function, overridden by instance.
*/
,	_doRefresh		:function (perm)
	{
		if (this.cmp.beforeRefresh && typeof (this.cmp.beforeRefresh) === "function") {
			if (this.cmp.beforeRefresh () === false) {
				return;
			}
		}

		this.cmp.perm = perm;

		if (this.cmp.buttonAdd) {
			this.cmp.buttonAdd.setDisabled (perm < 2);
		}
		if ("function" === typeof (this.cmp.getSelectionModel)) {
			this.cmp.getSelectionModel ().deselectAll ();
		}
		this.cmp.store.proxy.extraParams.action	= this.cmp.store.action = "read";
		this.cmp.store.load ();

		if (this.cmp.afterRefresh && typeof (this.cmp.afterRefresh) === "function") {
			this.cmp.afterRefresh ();
		}

		return false;
	}

/*
	beforeSelectionChange	:function, overridden by instance, return false to cancel.
	afterSelectionChange	:function, overridden by instance.
*/
,	_onSelectionChange		:function (model, data, e)
	{
		var s = (data.length <= 0);

		this.cmp.selectedData = data;

		if (this.cmp.buttonDelete) {
			this.cmp.buttonDelete.setDisabled (this.cmp.perm < 4 || s);
		}
		if (this.cmp.buttonEdit) {
			this.cmp.buttonEdit.setDisabled (this.cmp.perm < 3 || s);
		}
	}
});

Ext.preg ("crudbuttons", Jx.plugin.CrudButtons);
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

Ext.define ("Jx.plugin.SearchField", {
	extend			:"Ext.AbstractPlugin"
,	alias			:"plugin.searchfield"
,	searchField		:undefined
,	lastSearchStr	:""

,	constructor	:function (config)
	{
		if (config) {
			Ext.apply(this, config);
		}
	}

,	init	:function (cmp)
	{
		/* Get or create top toolbar */
		var tbar	= undefined;
		var tbars	= cmp.getDockedItems ("toolbar[dock='top']");

		if (tbars.length > 0) {
			tbar = tbars[0];
		}

		if (undefined === tbar) {
			tbar = Ext.create ("Ext.toolbar.Toolbar", {
				dock		:"top"
			});
			cmp.addDocked (tbar);
		}

		this.searchField		= Ext.create ("Ext.form.field.Trigger", {
				itemId			:"searchfield"
			,	emptyText		:"Search ..."
			,	tooltip			:"Type any string and enter to filter data"
			,	triggerCls		:"x-form-clear-trigger"
			,	onTriggerClick	:function ()
				{
					this.setRawValue ("");
				}
			});

		tbar.add ("->");
		tbar.add (this.searchField);

		this.searchField.on ("specialkey", this.doSearch, this);
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

		if (this.cmp.beforeSearch
		&& typeof (this.cmp.beforeSearch) === "function") {
			if (this.cmp.beforeSearch (v) == false) {
				return;
			}
		}

		this.lastSearchStr						= v;
		this.cmp.store.proxy.extraParams.action	= this.cmp.store.action = "read";
		this.cmp.store.proxy.extraParams.query	= v;
		this.cmp.store.load ();

		if (this.cmp.afterSearch
		&& typeof (this.cmp.afterSearch) === "function") {
			this.cmp.afterSearch (v);
		}
	}
});
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
/*
	Inject a copy button to top bar which function is to duplicate selected
	data in grid / view
*/
Ext.define ("Jx.plugin.CopyButton", {
	extend	:"Ext.AbstractPlugin"
,	alias	:"plugin.copybutton"

,	config	:
	{
	}

,	constructor	:function (config)
	{
		Ext.apply(this, config);
		this.callParent (arguments);
	}

,	init	:function (cmp)
	{
		/* Get or create top toolbar */
		var b		= undefined;
		var tbar	= undefined;
		var tbars	= cmp.getDockedItems ("toolbar[dock='top']");

		if (tbars.length > 0) {
			tbar = tbars[0];
		}

		if (undefined === tbar) {
			tbar		= Ext.create ("Ext.toolbar.Toolbar", {
				dock	:"top"
			});
			cmp.addDocked (tbar);
		}

		cmp.copyNumber			= Ext.create ("Ext.form.field.Number", {
				allowDecimals	:false
			,	minValue		:1
			,	fieldLabel		:"Copy data x times"
			});

		cmp.copyButton	= Ext.create ("Ext.button.Button", {
				text	:"Copy"
			,	handler	:this._doCopy
			,	scope	:this
			});

		cmp.copyMenu	= Ext.create("Ext.menu.Menu", {
				id		: "copy_menu"
			,	style	: {
					overflow: "visible"
				}
			,	items	: [
					cmp.copyNumber
				,	cmp.copyButton
				]
			});

		cmp.copyButtonMenu	= Ext.create ("Ext.button.Button", {
				text		:"Copy"
			,	itemId		:"copy"
			,	iconCls		:"copy"
			,	disabled	:true
			,	tooltip		:"Copy data"
			,	menu		:cmp.copyMenu
			});

		tbar.add (cmp.copyButtonMenu);

		cmp.on ("selectionchange", this._onSelectionChange, cmp);
	}

,	destroy	:function ()
	{
		Ext.destroy (this.cmp.copyButton);
		Ext.destroy (this.cmp.copyNumber);
		Ext.destroy (this.cmp.copyMenu);
		Ext.destroy (this.cmp.copyButtonMenu);

		this.callParent (arguments);
	}

//{{{ what this plugin do when user change selection
,	_onSelectionChange : function (model, data)
	{
		var s = (data.length <= 0);

		this.copyButtonMenu.setDisabled (s);
	}
//}}}

//{{{ what this plugin do when button clicked
,	_doCopy : function ()
	{
		var ncopy = this.cmp.copyNumber.getValue ();

		// get selected data
		var data = this.cmp.getSelectionModel ().getSelection ();

		if (data.length < 0) {
			return;
		}

		// get store
		var store = this.cmp.getStore ();

		// add n copy of model to store
		for (var i = 0; i < ncopy; i++) {
			var copy = data[0].copy ();

			store.add (copy);
		}

		store.sync ();
	}
//}}}
});

Ext.preg ("copybutton", Jx.plugin.CopyButton);
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

/*
	Plugins to add button menu import to grid.
 */
Ext.define ("Jx.plugin.ImportButton", {
	extend	:"Ext.AbstractPlugin"
,	alias	:"plugin.importbutton"

,	config	:
	{
		// server script that will be executed
		importUrl	:undefined
	,	importForm	:undefined
	}

,	constructor	:function (config)
	{
		Ext.apply(this, config);
		this.callParent (arguments);
	}

,	init	:function (cmp)
	{
		/* Get or create top toolbar */
		var b		= undefined;
		var tbar	= undefined;
		var tbars	= cmp.getDockedItems ("toolbar[dock='top']");

		if (tbars.length > 0) {
			tbar = tbars[0];
		}

		if (undefined === tbar) {
			tbar		= Ext.create ("Ext.toolbar.Toolbar", {
				dock	:"top"
			});
			cmp.addDocked (tbar);
		}

		cmp.importButton	= Ext.create ("Ext.button.Button", {
				text		:"Import"
			,	itemId		:"import"
			,	iconCls		:"import"
			,	tooltip		:"Import data from file"
			,	handler		:this._doImport
			,	scope		:this
			});

		tbar.add (cmp.importButton);
	}

,	destroy	:function ()
	{
		Ext.destroy (this.cmp.importButton);

		this.callParent (arguments);
	}

,	submitImport : function ()
	{
		this.importForm.getForm ().submit ({
				scope	:this
			,	success	:function (form, action)
				{
					Jx.msg.info (action.result.data);
					this.cmp.doRefresh ();
				}
			,	failure	:function (form, action)
				{
					Jx.msg.info (action.result.data);
				}
			});
	}

//{{{ what this plugin do when button clicked
,	_doImport : function ()
	{
		var file			= Ext.create ("Ext.form.field.File", {
				fieldLabel	:"File"
			,	buttonText	:"Select file ..."
			,	name		:"import_file"
			,	allowBlank	:false
			});

		this.importForm		= Ext.create ("Ext.form.Panel", {
				layout		:"anchor"
			,	bodyPadding	:5
			,	url			:this.importUrl
			,	defaults	:
				{
					anchor		:"100%"
				}
			,	items		:
				[
					file
				]
			,	buttons		:
				[{
					text		:"Import"
				,	formBind	:true
				,	disabled	:true
				,	handler		:this.submitImport
				,	scope		:this
				}]
			});

		var win				= Ext.create ("Ext.window.Window", {
				title		:"Import Data"
			,	layout		:"fit"
			,	modal		:true
			,	autoShow	:true
			,	draggable	:false
			,	resizable	:false
			,	items		:
				[
					this.importForm
				]
			});
	}
//}}}
});

Ext.preg ("importbutton", Jx.plugin.ImportButton);
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)

	Custom store with AJAX and JSON.
*/
var storeDefaultConfig = {
	autoLoad		:false
,	autoSync		:false
,	autoDestroy		:true
,	proxy			:
	{
		type			:"ajax"
	,	url				:""
	,	filterParam		:undefined
	,	extraParams		:
		{
			action			:"read"
		,	query			:""
		,	subaction		:""
		}
	,	reader			:
		{
			type			:"json"
		,	root			:"data"
		}
	,	writer			:
		{
			type			:"json"
		,	allowSingle		:false
		,	writeRecordId	:false
		}
	}

	// store's current action (read, create, update, destroy).
,	action		:"read"
,	singleApi	:true
,	extension	:_g_ext
,	idProperty	:"id"

,	api			:
	{
		read		:"read"
	,	create		:"create"
	,	update		:"update"
	,	destroy		:"destroy"
	}

,	storeInit :function ()
	{
		this.rebuildUrl ();

		/* Check and merge for extra parameters */
		if (this.extraParams && typeof (this.extraParams) === "object") {
			Ext.merge (this.proxy.extraParams, this.extraParams);
		}

		/* Set idProperty */
		this.model.prototype.idProperty = this.idProperty;
	}

,	rebuildUrl	:function ()
	{
		if (this.url) {
			if (this.singleApi) {
				this.proxy.api = {
						read	:this.url
					,	create	:this.url
					,	update	:this.url
					,	destroy	:this.url
					};
			} else {
				this.proxy.api = {
						read	:this.url + this.api.read		+ this.extension
					,	create	:this.url + this.api.create		+ this.extension
					,	update	:this.url + this.api.update 	+ this.extension
					,	destroy	:this.url + this.api.destroy	+ this.extension
					};
			}
		} else if (this.api) {
			this.proxy.api = this.api;
		}
	}

,	getIdProperty	:function ()
	{
		return this.model.prototype.idProperty;
	}
};

Ext.define ("Jx.Store", {
	extend	:"Ext.data.Store"
,	alias	:"jx.store"
,	config	:
	{
		remoteFilter	:true
	,	pageSize		:Jx.pageSize
	}
,	constructor	:function (config)
	{
		var opts = {};

		Ext.merge (opts, storeDefaultConfig);
		Ext.merge (opts, this.config);
		Ext.merge (opts, config);

		this.callParent ([opts]);
		this.initConfig (opts)

		this.storeInit ();
	}
});

/**
 * Store with RESTful.
 */
Ext.define ("Jx.StoreRest", {
	extend		:"Jx.Store"
,	alias		:"jx.storerest"
,	config		:
	{
		proxy		:
		{
			type		:"rest"
		,	appendId	:false
		}
	}
,	constructor	:function (config)
	{
		var opts = Ext.merge ({}, this.config);

		Ext.merge (opts, config);

		this.callParent ([opts]);
	}
});

/*
	Custom store tree with REST + JSON.
*/
Ext.define ("Jx.StoreTree", {
	extend				:"Ext.data.TreeStore"
,	alias				:"jx.storetree"
,	config				:
	{
		defaultRootProperty	:"children"
	,	root				:
		{
			text				:""
		,	expanded			:true
		,	children			:[]
		}
	,	proxy				:
		{
			type				:"rest"
		,	appendId			:false
		,	reader			:
			{
				type			:"json"
			,	root			:"children"
			}
		}
	}

,	constructor	:function (config)
	{
		var opts = {};

		Ext.merge (opts, storeDefaultConfig);
		Ext.merge (opts, this.config);
		Ext.merge (opts, config);

		this.callParent ([opts]);
		this.initConfig (opts)

		this.storeInit ();
	}
});
/*
	Copyright 2013 x10c-lab.com
	Authors:
		- mhd.sulhan (sulhan@x10c-lab.com)

	Custom combobox with paging and searching.
*/
Ext.define ("Jx.ComboPaging", {
	extend			:"Ext.form.field.ComboBox"
,	alias			:"widget.combopaging"
,	forceSelection	:true
,	pageSize		:_g_paging_size
,	shrinkWrap		:3
,	typeAhead		:true
,	typeAheadDelay	:500
,	listConfig		:
	{
		loadingText		:"Loading ..."
	,	emptyText		:"Data not found."
	}

,	initComponent	:function ()
	{
		this.callParent (arguments);
	}
});
/*
	Copyright 2013 - x10c-lab.com
	Authors:
		- mhd.sulhan (sulhan@x10c-lab.com)
		- agus sugianto (agus@x10c-lab.com)

	Custom form panel with capabilities to use store to sync data.

	- createButtonBar
		+ true		:create buttom bar with addition button, save and cancel (default).
		+ false		:no buttom bar created.

	- syncUseStore
		+ true		:sync data using store.
		+ false		:sync data using form submit.
*/
Ext.define ("Jx.Form", {
	extend			:"Ext.form.Panel"
,	alias			:"jx.form"
,	config			:
	{
		autoScroll		:true
	,	jsonSubmit		:true
	,	bodyPadding		:10
	,	bodyStyle		:'border:0px;'
	,	border			:false
	,	defaultType		:"textfield"
	,	titleAlign		:"center"
	,	ui				:"default"
	,	defaults		:
		{
			anchor			:"100%"
		,	labelAlign		:"right"
		}
		/* custom configurations */
	,	createButtonBar	:true
	,	syncUseStore	:true

	,	afterFormSave	:function (success)
		{
			if (success) {
				this.hide ();
			}
		}
	,	afterFormCancel :function ()
		{
			this.hide ();
		}
	}

,	constructor	:function (cfg)
	{
		this.callParent (arguments);

		var opts = Ext.merge ({}, this.config);
			opts = Ext.merge (opts, cfg);

		this.initConfig (opts);

		this.doCreateButtonBar (opts);

		// Register events.
		this.addEvents ("savesuccess");
		this.addEvents ("savefail");
		this.addEvents ("canceled");
	}

,	doCreateButtonBar :function (cfg)
	{
		if (false === cfg.createButtonBar) {
			return;
		}

		this.buttonSave		= Ext.create ("Ext.button.Button", {
				text		:"Save"
			,	itemId		:"save"
			,	iconCls		:"form-save"
			,	formBind	:true
			,	tooltip		:"Save record"
			});

		this.buttonCancel	= Ext.create ("Ext.button.Button", {
				text		:"Cancel"
			,	itemId		:"cancel"
			,	iconCls		:"form-cancel"
			,	tooltip		:"Cancel record operation"
			});

		this.buttonSave.setHandler (this.doSave, this);
		this.buttonCancel.setHandler (this.doCancel, this);

		var id = Jx.generateItemId (cfg, "JxForm", "ButtonBar");

		this.buttonBar	= Ext.create ("Ext.toolbar.Toolbar", {
				itemId	:id
			,	dock	:"bottom"
			,	border	:true
			,	shadow	:true
			,	ui		:"footer"
			,	items	:
				[
					this.buttonCancel
				,	"-"
				,	"->"
				,	"-"
				,	this.buttonSave
				]
			});

		this.addDocked (this.buttonBar);
	}

,	columnsToFields : function (columns)
	{
		/* Add each column's editor to form */
		for (var i = 0, c = null; i < columns.length; i++) {
			c = columns[i];

			if (undefined != c.columns) {
				var cfg = {};

				Ext.merge (cfg, {
						title			:c.header
					,	layout			:"anchor"
					,	defaultType		:"textfield"
					,	flex			:1
					,	fieldDefaults	:
						{
							anchor			:"100%"
						,	msgTarget		:"side"
						,	labelAlign		:"right"
						}
					});
				Ext.merge (cfg, c.fsConfig);

				var fs	= Ext.create ("Ext.form.FieldSet", cfg);

				for (var k = 0, cc = null; k < c.columns.length; k++) {
					cc = c.columns[k];

					if (undefined != cc.editor) {
						if (undefined == cc.editor.fieldLabel) {
							cc.editor.fieldLabel = cc.header || cc.text;
						}
						cc.editor.name = cc.dataIndex;

						fs.add (cc.editor);
					}
				}

				this.add (fs);
			} else if (undefined != c.editor) {
				if (undefined == c.editor.fieldLabel) {
					c.editor.fieldLabel	= c.header || c.text;
				}
				c.editor.name		= c.dataIndex;

				this.add (c.editor);
			}
		}
	}

,	doSave		:function ()
	{
		if (this.beforeFormSave
		&& typeof (this.beforeFormSave) === "function") {
			if (this.beforeFormSave () === false) {
				return;
			}
		}

		var f = this.getForm ();

		f.setValues (this.store.proxy.extraParams);

		if (!f.isValid ()) {
			Jx.msg.error ("Invalid form values!<br/>Please correct or fill form's field with red mark.");
			return;
		}

		/* If syncUseStore is true, use store.api to sync data */
		if (true === this.syncUseStore) {
			switch (this.store.action) {
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
				Jx.msg.error (Jx.msg.ACTION_UNKNOWN +"'"+ this.store.action +"'");
				return;
			}

			this.store.proxy.extraParams.action = this.store.action;

			this.store.sync ({
				scope	:this
			,	success	:function (batch, action)
				{
					var data = this.store.proxy.reader.rawData.data;

					Jx.msg.info (data || Jx.msg.AJAX_SUCCESS);
					this.afterSaveSuccess ();
				}
			,	failure	:function (batch, action)
				{
					this.store.rejectChanges ();
					this.afterSaveFailure (action);
				}
			});

		} else { /* Otherwise use basic form submit */
			var url;
			var method = "GET";

			/* Generate url based on user action */
			switch (this.store.action) {
			case "read":
				url		= this.store.proxy.api.read;
				method	= "GET";
				break;
			case "create":
				url		= this.store.proxy.api.create;
				method	= "POST";
				break;
			case "update":
				url = this.store.proxy.api.update;

				if (this.store.singleApi) {
					method	= "PUT";
				} else {
					method	= "POST";
				}
				break;
			case "destroy":
				url = this.store.proxy.api.destroy;

				if (this.store.singleApi) {
					method	= "DELETE";
				} else {
					method	= "POST";
				}

				break;
			default:
				Jx.msg.error (Jx.msg.ACTION_UNKNOWN +"'"+ this.store.action +"'");
				return;
			}

			f.submit ({
				url		:url
			,	method	:method
			,	params	:
				{
					action		:this.store.action
				,	subaction	:this.store.proxy.extraParams.subaction
				}
			,	scope	:this
			,	success	:function (form, action)
				{
					Jx.msg.info (action.result.data);
					this.afterSaveSuccess ();
				}
			,	failure	:function (form, action)
				{
					this.store.rejectChanges ();
					this.afterSaveFailure (action);
				}
			,	clientValidation	:false
			});
		}
	}

,	afterSaveSuccess	:function ()
	{
		this.store.proxy.extraParams.action = this.store.action = "read";
		this.store.reload ({
				scope		:this
			,	callback	:function (r, op, success)
				{
					this.fireEvent ("savesuccess");

					if (this.afterFormSave
					&& typeof (this.afterFormSave) === "function") {
						if (this.afterFormSave (success) === false) {
							return;
						}
					}
				}
			});
	}

,	afterSaveFailure	:function (action)
	{
		this.fireEvent ("savefail");

		if (undefined !== action.failureType) {
			switch (action.failureType) {
			case Ext.form.action.Action.CLIENT_INVALID:
				Jx.msg.error (Jx.msg.CLIENT_INVALID);
				break;
			case Ext.form.action.Action.CONNECT_FAILURE:
				Jx.msg.error (Jx.msg.AJAX_FAILURE);
				break;
			case Ext.form.action.Action.SERVER_INVALID:
				if (action.result) {
					Jx.msg.error (action.result.data);
				} else {
					Jx.msg.error (this.store.proxy.reader.rawData.data);
				}
				break;
			default:
				Jx.msg.error (Jx.msg.SERVER_ERROR);
				break;
			}
		} else {
			if (action.result) {
				Jx.msg.error (action.result.data);
			} else {
				Jx.msg.error (this.store.proxy.reader.rawData.data);
			}
		}

		if (this.afterFormSave
		&& typeof (this.afterFormSave) === "function") {
			if (this.afterFormSave (false) === false) {
				return;
			}
		}
	}

,	doCancel	:function ()
	{
		this.fireEvent ("canceled");

		if (this.beforeFormCancel
		&& typeof (this.beforeFormCancel) === "function") {
			if (this.beforeFormCancel () === false) {
				return;
			}
		}

		if (this.afterFormCancel
		&& typeof (this.afterFormCancel) === "function") {
			this.afterFormCancel ();
		}
	}
});
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
		// paging bar
	,	pagingBar				:undefined
	,	showPagingBar			:true
		// should row number displayed?
	,	showRowNumber			:false
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

		if (opts.showRowNumber) {
			opts.columns.splice (0, 0, { xtype : "rownumberer" });
		}

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
		var id = Jx.generateItemId (this, "JxGridPaging", "PagingBar");

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
/*
	Copyright 2013 - x10c-lab.com
	Authors:
		- mhd.sulhan (sulhan@x10c-lab.com)

	Custom grid panel with paging and row editor.
*/
Ext.define ("Jx.GridPaging.RowEditor", {
	extend			:"Jx.GridPaging"
,	alias			:"jx.gridpaging.roweditor"
,	config			:
	{
		rowEditor		:undefined
	}

,	constructor		: function (config)
	{
		this.callParent (arguments);
		this.initConfig (config);

		this.createRowEditor (config);
	}

,	createRowEditor	:function (cfg)
	{
		var id = Jx.generateItemId (cfg, "JxForm", "RowEditor");

		this.rowEditor			= Ext.create ("Ext.grid.plugin.RowEditing", {
				pluginId		:id
			,	clicksToEdit	:2
			,	autoCancel		:false
			});

		/* Add listener for grid row editor */
		this.rowEditor.on ("beforeedit"	, this.onBeforeEdit	, this);
		this.rowEditor.on ("edit"		, this.doRowSave	, this);
		this.rowEditor.on ("canceledit"	, this.doRowCancel	, this);

		this.rowEditor.init (this);
	}

,	onBeforeEdit : function ()
	{
		if (this.store.action == "create") {
			return true;
		}

		this.store.proxy.extraParams.action	= this.store.action = "update";

		// check user selection
		this.getSelectedData ();
		if (this.selectedData.length <= 0) {
			return false;
		}

		return true;
	}

/*
	beforeAdd	:function, overridden by instance, return false to cancel.
	afterAdd	:function, overridden by instance.
*/
,	doAdd		:function ()
	{
		this.rowEditor.cancelEdit ();

		var r = this.store.model.create ();

		this.store.insert (0, r);
		this.rowEditor.startEdit (0, 0);
	}

,	doEdit		:function ()
	{
		this.rowEditor.cancelEdit ();
		this.rowEditor.startEdit (this.store.indexOf (this.selectedData[0]), 0);
	}

,	doDelete	:function ()
	{
		this.store.remove (this.selectedData);
		this.store.sync ();
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

		this.store.proxy.extraParams.action = this.store.action;

		this.store.sync ({
				params		:this.store.proxy.extraParams
			,	scope		:this
			,	success		:function (batch, op)
				{
					Jx.msg.info (Jx.msg.AJAX_SUCCESS);

					this.store.proxy.extraParams.action = this.store.action = "read";

					// reload store to retrieve ID of data (for table that depend on ID)
					this.store.reload ();

					if (this.afterRowSave && typeof (this.afterRowSave) === "function") {
						this.afterRowSave ();
					}
				}
			,	failure		:function (batch, op)
				{
					Jx.msg.error (Jx.msg.AJAX_FAILURE);
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
/*
	Copyright 2014 Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)

	Custom grid panel with paging and form editor.
*/
Ext.define ("Jx.GridPaging.FormEditor", {
	extend		:"Ext.panel.Panel"
,	alias		:"jx.gridpaging.formeditor"
,	config		:
	{
		panelConfig	:
		{
			layout		:"border"
		,	titleAlign	:"center"
		}
	,	grid		:undefined
	,	gridConfig	:
		{
			region		:"center"
		,	doAdd		:function ()
			{
				this.ownerCt.form.setTitle ("Create new data");
				this.ownerCt.form.getForm ().reset ();
				this.ownerCt.form.show ();
			}
		,	doEdit		:function ()
			{
				this.ownerCt.form.setTitle ("Updating data");
				this.ownerCt.form.getForm ().reset ();
				this.ownerCt.form.loadRecord (this.selectedData[0]);
				this.ownerCt.form.show ();
			}
		,	doDelete	:function ()
			{
				this.ownerCt.form.getForm ().reset ();
				this.ownerCt.form.loadRecord (this.selectedData[0]);
				this.ownerCt.form.doSave ();
			}
		,	onSelectionChange	:function (model, data, e)
			{
				if (data.length > 0) {
					this.ownerCt.form.loadRecord (data[0]);
				}
			}
		}

	,	form			:undefined
	,	formConfig		:
		{
			region			:"east"		// position of form in grid.
		,	syncUseStore	:true
		,	hidden			:true
		,	split			:true
		}
	}

,	constructor	:function (cfg)
	{
		var id = Jx.generateItemId (cfg, "JxGridPagingFormEditor", "");

		var opts = Ext.merge ({
								itemId: id
							}, this.panelConfig);
			opts = Ext.merge (opts, cfg.panelConfig);

		this.callParent ([opts]);

		this.createGrid (cfg);
		this.createForm (cfg);
	}

,	createGrid	:function (cfg)
	{
		var opts	= {};
		var id		= Jx.generateItemId (cfg, "JxGridPagingFormEditor", "Grid");

		Ext.merge (opts, {
							itemId	: id
						,	_parent	: this
						,	store	: cfg.store
						,	columns	: cfg.columns
						});
		Ext.merge (opts, this.gridConfig);

		this.grid = Ext.create ("Jx.GridPaging", opts);

		this.add (this.grid);
	}

,	createForm	:function (cfg)
	{
		var opts	= {};
		var id		= Jx.generateItemId (cfg, "JxGridPagingFormEditor", "Form");

		Ext.merge (opts, {
							store	:cfg.store
						,	itemId	:id
						});
		Ext.merge (opts, this.formConfig);
		Ext.merge (opts, cfg.formConfig);

		this.form = Ext.create ("Jx.Form", opts);

		this.form.columnsToFields (cfg.columns);

		this.add (this.form);
	}

,	doRefresh : function (perm)
	{
		this.grid.doRefresh (perm);
	}

,	clearData	:function ()
	{
		this.grid.clearData ();
	}
});
/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

Ext.define ("Jx.CardGridForm", {
	extend		:"Ext.panel.Panel"
,	alias		:"jx.cardgridform"
,	layout		:"card"
,	titleAlign	:"center"
,	config		:
	{
		perm		:0
	,	itemId		:""
	,	url			:""
	,	store		:undefined
	,	fields		:[]
	,	grid		:undefined
	,	form		:undefined
	,	formConfig	:{}

	,	closable	:true
	}

,	statics		:
	{
//{{{ function: convert column to field.
		columnToField : function (c)
		{
			var f = {};

			if (undefined !== c.dataIndex) {
				f.name = c.dataIndex;

				if (undefined !== c.type) {
					f.type = c.type;
				} else if (undefined !== c.xtype) {
					// use column xtype as field type
					switch (c.xtype) {
					case "datecolumn":
						f.type = "date";
						if (undefined !== c.dateFormat) {
							f.dateFormat = c.dateFormat;
						} else {
							f.dateFormat = "c"
						}
						break;
					}
				}
			}

			return f;
		}
//}}}
//{{{ store
	,	createStore : function (self, opts)
		{
			if (undefined !== opts.store) {
				return;
			}

			var fields	= [];
			var nfield	= opts.fields.length;

			for (var i = 0, c = undefined, f = undefined; i < nfield; i++) {
				c = opts.fields[i];
				f = {};

				if (undefined !== c.columns) {
					for (var k = 0, cc = undefined; k < c.columns.length; k++) {
						cc	= c.columns[k];
						f	= self.self.columnToField (cc);
						fields.push (f);
					}
				} else {
					f = self.self.columnToField (c);
					fields.push (f);
				}
			}

			self.store		= Ext.create ("Jx.StoreRest", {
					url		: opts.url
				,	fields	: fields
				});
		}
//}}}
//{{{ grid
	,	createGrid : function (self, opts)
		{
			var id = Jx.generateItemId (opts, "JxCardGridForm", "Grid");

			/* Add row number to grid */
			opts.fields.splice (0, 0, { xtype : "rownumberer" });

			var cfg = {};

			Ext.merge (cfg, {
					itemId			: id
				,	_parent			: self
				,	store			: self.store
				,	columns			: opts.fields
				,	region			:"center"

				,	doAdd	:function ()
					{
						self.form.setTitle ("Create new data");
						self.form.getForm ().reset ();
						self.getLayout ().setActiveItem (self.form);
					}
				,	doEdit	:function ()
					{
						self.form.setTitle ("Updating data");
						self.form.getForm ().reset ();
						self.form.loadRecord (this.selectedData[0]);
						self.getLayout ().setActiveItem (self.form);
					}
				,	doDelete :function ()
					{
						self.form.getForm ().reset ();
						self.form.loadRecord (this.selectedData[0]);
						self.form.doSave ();
					}
				,	onSelectionChange :function (model, data)
					{
						if (data.length > 0) {
							self.form.loadRecord (data[0]);
						}
					}
				});

			Ext.merge (cfg, opts.gridConfig);

			self.grid = Ext.create ("Jx.GridPaging", cfg);

			self.grid.on ("selectionchange", self.grid.onSelectionChange, self.grid);

			self.add (self.grid);
		}
//}}}
//{{{ form
	,	createForm : function (self, opts)
		{
			var id	= Jx.generateItemId (opts, "JxCardGridForm", "Form");
			var cfg	= {};

			Ext.merge (cfg, {
					itemId				:id
				,	_parent				:self
				,	store				:self.store
					// replace original save and cancel handler
				,	afterFormSave		:function (success)
					{
						if (success) {
							self.getLayout ().setActiveItem (self.grid);
						}
					}
				,	afterFormCancel		:function ()
					{
						self.getLayout ().setActiveItem (self.grid);
					}
				});

			Ext.merge (cfg, opts.formConfig);

			self.form = Ext.create ("Jx.Form", cfg);

			self.form.columnsToFields (opts.fields);

			self.add (this.form);
		}
//}}}
	}
//{{{ constructor
,	constructor	:function (cfg)
	{
		var opts = {};

		Ext.merge (opts, this.config);
		Ext.merge (opts, cfg);

		this.callParent ([opts]);
		this.initConfig (opts);

		this.self.createStore (this, opts);
		this.self.createGrid (this, opts);
		this.self.createForm (this, opts);
	}
//}}}
,	doRefresh : function (perm)
	{
		this.perm = perm;
		this.grid.doRefresh (perm);
	}
});
