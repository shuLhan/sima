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
