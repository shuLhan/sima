/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

function JxReferenceAssetStatus ()
{
	this.id		= "Reference_Asset_Status";
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
				title		:"Referensi > Status Aset"
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

var Reference_Asset_Status = new JxReferenceAssetStatus ();

//# sourceURL=module/Reference/Asset/Type/layout.js
