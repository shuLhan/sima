/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

function JxReferenceAssetType ()
{
	this.id		= "Reference_Asset_Type";
	this.dir	= Jx.generateModDir (this.id);

	this.store		= Ext.create ("Jx.StoreRest", {
			url		:this.dir
		,	fields	:
			[
				"id"
			,	"name"
			]
		});

	this.panel			= Ext.create ("Jx.GridPaging.FormEditor", {
			itemId		:this.id
		,	store		:this.store
		,	panelConfig	:
			{
				title		:"Referensi > Tipe Aset"
			,	closable	:true
			}
		,	columns		:
			[{
				header		:"ID"
			,	dataIndex	:"id"
			,	hidden		:true
			,	editor		:
				{
					xtype		:"textfield"
				,	hidden		:true
				}
			},{
				header		:"Name"
			,	dataIndex	:"name"
			,	flex		:1
			,	editor		:
				{
					xtype		:"textfield"
				,	vtype		:"alphanum"
				,	allowBlank	:false
				}
			}]
		});

	this.doRefresh	= function (perm)
	{
		this.panel.doRefresh (perm);
	};
};

var Reference_Asset_Type = new JxReferenceAssetType ();

//# sourceURL=module/Reference/Asset/Type/layout.js
