/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

Ext.define ("Jx.Media.Table.Viewer", {
	extend		:"Ext.panel.Panel"
,	alias		:"widget.mediatableviewer"
,	config		:
	{
		table		:""
	,	store		:undefined
	,	tpl			:undefined
	,	view		:undefined
	,	crudbar		:undefined
	}

,	statics		:
	{
		createView : function (self, cfg)
		{
			var id	= "System_Media_Table";
			var dir	= Jx.generateModDir (id);

			self.store = Ext.create ("Jx.Store", {
					url		:dir
				,	proxy	:
					{
						extraParams	:
						{
							table		:cfg.table
						,	table_id	:""
						}
					}
				,	fields	:
					[
						"id"
					,	"name"
					,	"extension"
					,	"size"
					,	"mime"
					,	"description"
					,	"path"
					]
				});

			self.tpl = new Ext.XTemplate (
					'<tpl for=".">'
				+		'<div style="margin-bottom: 10px;">'
				+			'<img src="{path}.{extension}" />'
				+		'</div>'
				+	'</tpl>'
				);

			self.view		= Ext.create ("Ext.view.View", {
					store	:self.store
				,	tpl		:self.tpl
				});

			self.add (self.view);
		}

	}

,	constructor	: function (cfg)
	{
		var opts = {};

		Ext.merge (opts, this.config);
		Ext.merge (opts, cfg);

		this.callParent ([opts]);
		this.initConfig (opts);

		this.plugCrudButtons	= Ext.create ("Jx.plugin.CrudButtons",
			{
				buttonBarList : [ "delete", "-", "add", "-", "refresh" ]
			});

		this.addPlugin (this.plugCrudButtons);

		this.crudbar = this.getDockedItems ('toolbar[dock="top"]')[0];

		this.crudbar.hide ();

		this.self.createView (this, opts);
	}

,	doRefresh : function (perm, id)
	{
		this.store.proxy.extraParams.table_id = id;

		this.fireEvent ("refresh", perm);
	}
});
