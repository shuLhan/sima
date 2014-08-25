/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

function JxAssetMaintenance ()
{
	this.id		= "Asset_Maintenance";
	this.dir	= Jx.generateModDir (this.id);

//{{{ fields
	this.fields		= [{
			header		:"ID"
		,	dataIndex	:"id"
		,	hidden		:true
		,	type		:"int"
		,	editor		:
			{
				hidden	:true
			}
		},{
			header		:"Asset ID"
		,	dataIndex	:"asset_id"
		,	hidden		:true
		,	type		:"int"
		,	editor		:
			{
				hidden		:true
			}
		},{
			header		:"Date"
		,	xtype		:"datecolumn"
		,	dataIndex	:"maintenance_date"
		,	format		:"d M Y"
		,	editor		:
			{
				xtype		:"datefield"
			,	format		:"d M Y"
			,	submitFormat:"Y-m-d"
			}
		},{
			header		:"Cost"
		,	dataIndex	:"cost"
		,	type		:"float"
		,	editor		:
			{
				xtype		:"numberfield"
			,	minValue	:0
			}
		},{
			header		:"Status"
		,	dataIndex	:"asset_status_id"
		,	renderer	:Jx.app.store.Asset.Status.renderData ("id", "name")
		,	editor		:
			{
				xtype			:"combobox"
			,	store			:Jx.app.store.Asset.Status
			,	valueField		:"id"
			,	displayField	:"name"
			}
		},{
			header		:"Description"
		,	dataIndex	:"maintenance_info"
		,	flex		:true
		,	editor		:
			{
				xtype		:"textarea"
			}
		}];
//}}}
//{{{ button: print
	this.b_print	= Ext.create ("Ext.button.Button", {
			text				:"Print Report"
		,	iconCls				:"print"
		,	disabled			:true
		,	handler				:function ()
			{
				Asset_Maintenance.do_print ();
			}
		});
//}}}
//{{{ panel: asset
	this.panelAsset				= Ext.create ("Jx.app.Asset.Viewer", {
			itemId				:this.id +"_Asset"
		,	region				:"center"
		,	tbar				:
			[
				this.b_print
			]
		,	onSelectionChange	: function (model, data)
			{
				var id = 0;

				if (data.length > 0) {
					id = data[0].get ("id");
				}

				Asset_Maintenance.b_print.setDisabled (data.length <= 0);
				Asset_Maintenance.panelAssetMaintenanceLog.doReload (this.perm, id);
			}
		});
//}}}
//{{{ panel: asset maintenance log
	this.panelAssetMaintenanceLog = Ext.create ("Jx.CardGridForm", {
			title			:"History of Maintenance"
		,	url				:this.dir
		,	closable		:false
		,	region			:"east"
		,	width			:"50%"
		,	split			:true
		,	collapsible		:true
		,	fields			:this.fields
		,	gridConfig		:
			{
				showCrudButtons	:true
			,	showPagingBar	:false
			}

		,	doReload	: function (perm, id)
			{
				if (id <= 0) {
					this.store.removeAll ();
				} else {
					this.store.proxy.extraParams.asset_id = id;
					this.doRefresh (perm);
				}
			}

		,	afterAdd : function ()
			{
				this.form.getForm ().setValues ({
					"asset_id" : this.store.proxy.extraParams.asset_id
				});
			}
		});
//}}}
//{{{ panel: main
	this.panel			= Ext.create ("Ext.container.Container", {
			layout		:"border"
		,	title		:"Asset Maintenance"
		,	closable	:true
		,	items		:
			[
				this.panelAsset
			,	this.panelAssetMaintenanceLog
			]
		});
//}}}
//{{{ function: do print
	this.do_print = function ()
	{
		var id = this.panelAsset.selectedData[0].data.id;
		var form = document.createElement('form');

		form.target	= "asset_maintenance";
		form.method	= "POST";
		form.action	= this.dir +"print.php";

		var postInput	= document.createElement ('input');
		postInput.type	= "hidden";
		postInput.name	= "id";
		postInput.value	= id;

		form.appendChild (postInput);
		document.body.appendChild (form);

		var print = window.open ("", form.target);

		if (print) {
			form.submit ();
		} else {
			Jx.msg.error ("You must allow popups for this function to work.");
		}

		document.body.removeChild (form);
	};
//}}}
//{{{ refresh this module
	this.doRefresh	= function (perm)
	{
		var self = this;

		Jx.chainStoreLoad (
				[
					Jx.app.store.System.User
				,	Jx.app.store.Asset.Type
				,	Jx.app.store.Asset.Procurement
				,	Jx.app.store.Asset.Status
				,	Jx.app.store.Asset.Location
				,	Jx.app.store.Asset
				]
			,	function ()
				{
					self.perm = perm;
					self.panelAsset.doRefresh (perm);
					self.panelAssetMaintenanceLog.doReload (perm, 0);
				}
			,	0);
	};
//}}}
}

var Asset_Maintenance = new JxAssetMaintenance ();

//# sourceURL=module/Asset/Maintenance/layout.js
