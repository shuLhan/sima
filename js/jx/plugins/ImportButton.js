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
