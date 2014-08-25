/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

function JxReferenceAssetProcurement ()
{
	this.id		= "Reference_Asset_Procurement";
	this.dir	= Jx.generateModDir (this.id);

	this.panel			= Ext.create ("Jx.GridPaging.FormEditor", {
			itemId		:this.id
		,	store		:Jx.app.store.Asset.Procurement
		,	panelConfig	:
			{
				title		:"Reference > Asset Procurement"
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
				,	allowBlank	:false
				}
			}]
		});

	this.doRefresh	= function (perm)
	{
		this.panel.doRefresh (perm);
	};
};

var Reference_Asset_Procurement = new JxReferenceAssetProcurement ();

//# sourceURL=module/Reference/Asset/Procurement/layout.js
