/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

function JxAssetAssign ()
{
	this.id		= "Asset_Assign";
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
		,	dataIndex	:"assign_date"
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
			header		:"User"
		,	dataIndex	:"_user_id"
		,	renderer	:Jx.app.store.System.User.renderData ("id", "realname")
		,	editor		:
			{
				xtype			:"combobox"
			,	store			:Jx.app.store.System.User
			,	valueField		:"id"
			,	displayField	:"realname"
			}
		},{
			header		:"Location"
		,	dataIndex	:"location_id"
		,	renderer	:Jx.app.store.Asset.Location.renderData ("id", "name")
		,	editor		:
			{
				xtype			:"combobox"
			,	store			:Jx.app.store.Asset.Location
			,	valueField		:"id"
			,	displayField	:"name"
			}
		},{
			header		:"Detail Location"
		,	dataIndex	:"location_detail"
		,	hidden		:true
		,	editor		:
			{
				xtype		:"textarea"
			}
		},{
			header		:"Description"
		,	dataIndex	:"description"
		,	hidden		:true
		,	editor		:
			{
				xtype		:"textarea"
			}
		}];
//}}}

//{{{ panel: asset
	this.panelAsset			= Ext.create ("Jx.GridPaging", {
			store			:Jx.app.store.Asset
		,	title			:"Aset"
		,	region			:"center"
		,	showCrudButtons	:false
		,	columns			:
			[{
				header			:"Barcode"
			,	dataIndex		:"barcode"
			,	width			:130
			},{
				header			:"Type"
			,	dataIndex		:"type_id"
			,	renderer		:Jx.app.store.Asset.Type.renderData ("id", "name")
			,	flex			:true
			},{
				header			:"Merk"
			,	dataIndex		:"merk"
			,	flex			:true
			},{
				header			:"Model"
			,	dataIndex		:"model"
			,	flex			:true
			}]

		,	onSelectionChange : function (model, data)
			{
				var id = 0;

				if (data.length > 0) {
					id = data[0].get ("id");
				}

				Asset_Assign.panelAssetAssignLog.doReload (this.perm, id);
			}
		});
//}}}
//{{{ panel: assign log
	this.panelAssetAssignLog = Ext.create ("Jx.CardGridForm", {
			title			:"Riwayat Relokasi"
		,	url				:this.dir
		,	region			:"east"
		,	width			:"50%"
		,	split			:true
		,	collapsible		:true
		,	fields			:this.fields
		,	closable		:false
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
		,	title		:"Relokasi Aset"
		,	closable	:true
		,	items		:
			[
				this.panelAsset
			,	this.panelAssetAssignLog
			]
		});
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
					self.panelAssetAssignLog.doReload (perm, 0);
				}
			,	0);
	};
//}}}
}

var Asset_Assign = new JxAssetAssign ();

//# sourceURL=module/Asset/Assign/layout.js
