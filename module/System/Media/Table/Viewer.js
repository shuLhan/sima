/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

Ext.define ("Jx.Media.Table.Viewer", {
///{{{ class properties
	extend		:"Ext.panel.Panel"
,	alias		:"widget.mediatableviewer"
,	layout		:"border"
,	plugins		:
	[
		"crudbuttons"
	]
,	config		:
	{
		table_id	:""
	,	store		:undefined
	,	view_tpl	:undefined
	,	viewer		:undefined
	,	crudbar		:undefined
	,	form		:undefined
	}
//}}}
,	statics		:
	{
//{{{ create viewer
		createView : function (self, cfg)
		{
			var id = "System_Media_Table";
			var dir	= Jx.generateModDir (id);

			self.store = Ext.create ("Jx.Store", {
					url		:dir
				,	proxy	:
					{
						extraParams	:
						{
							table_id :cfg.table_id
						}
					}
				,	fields	:
					[
						"table_id"
					,	"_media_id"
					,	"name"
					,	"extension"
					,	"size"
					,	"mime"
					,	"description"
					,	"path"
					]
				});

			self.view_tpl = new Ext.XTemplate (
					'<tpl for=".">'
				+		'<div style="margin-bottom: 10px;" class="image-viewer">'
				+			'<img width="200" height="auto" src="{path}" />'
				+		'</div>'
				+	'</tpl>'
				);

			self.viewer			= Ext.create ("Ext.view.View", {
					itemId		:id +"Viewer"
				,	store		:self.store
				,	tpl			:self.view_tpl
				,	itemSelector:"div.image-viewer"
				,	region		:"center"
				,	baseCls		:"x-panel-body"
				});

			self.add (self.viewer);
		}
//}}}
//{{{ create form
	,	createForm : function (self, cfg)
		{
			self.form = Ext.create ("Jx.Form", {
					store			:self.store
				,	region			:"north"
				,	hidden			:true
				,	syncUseStore	:false
				,	defaults		:
					{
						anchor			:"100%"
					}
				,	items			:
					[{
						xtype			:"textfield"
					,	name			:"table_id"
					,	hidden			:true
					,	value			:self.table_id
					},{
						xtype			:"filefield"
					,	name			:"content"
					,	buttonText		:"Select File"
					,	fieldLabel		:"Upload"
					,	allowBlank		:false
					}]
				});

			self.add (self.form);
		}
//}}}
	}
//{{{ constructor
,	constructor	: function (cfg)
	{
		var id = "System_Media_Table";
		var opts = {
				itemId : id
			};

		Ext.merge (opts, this.config);
		Ext.merge (opts, cfg);

		this.callParent ([opts]);
		this.initConfig (opts);

		this.crudbar = this.getDockedItems ('toolbar[dock="top"]')[0];

		this.crudbar.hide ();

		this.self.createView (this, opts);
		this.self.createForm (this, opts);
	}
//}}}
//{{{ before button add clicked
,	beforeAdd : function ()
	{
		this.form.show ();
	}
//}}}
//{{{ what to do when we want to hide this component?
,	hide : function ()
	{
		this.crudbar.hide ();
		this.form.hide ();
	}
//}}}
//{{{ what to do when we want to show this component?
,	show : function (id)
	{
		this.crudbar.show ();

		if (undefined !== id) {
			this.store.proxy.extraParams.table_id = id;
		}
	}
//}}}
//{{{ refresh component
,	doRefresh : function (perm, id)
	{
		this.store.proxy.extraParams.table_id = id;

		this.fireEvent ("refresh", perm);
	}
//}}}
});
