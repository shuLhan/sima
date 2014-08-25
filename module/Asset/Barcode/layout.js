/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
function JxAssetBarcode ()
{
	this.id				= "Asset_Barcode";
	this.dir			= Jx.generateModDir (this.id);
	var idPanelAsset	= this.id + "_Asset";
	var idPanelPrint	= this.id + "_Print";

//{{{ store
	this.storePrint	= Ext.create ("Jx.Store", {
			fields	:
			[
				"type_id"
			,	"barcode"
			,	"print_count"
			,{
				name			:"print_count"
			,	type			:"int"
			,	defaultValue	:"1"
			}]
		});
//}}}

//{{{ panel: asset
	this.panelAsset			= Ext.create ("Jx.app.Asset.Viewer", {
			itemId			:idPanelAsset
		,	region			:"center"
		,	viewConfig		:
			{
				plugins			:
				[{
					ptype			:"gridviewdragdrop"
				,	dragGroup		:idPanelAsset
				,	dropGroup		:idPanelPrint
				}]
			}
		});

	var cols = Ext.Array.clone (this.panelAsset.columns);

	cols.push ({
			xtype		:"actioncolumn"
		,	iconCls		:"add"
		,	width		:30
		,	handler		:function (view, rowidx, colidx, item, e, record)
			{
				Asset_Barcode.panelAsset.store.remove (record);
				record.set ("print_count", 1);
				Asset_Barcode.storePrint.add (record);
			}
		});

	this.panelAsset.reconfigure (this.panelAsset.store, cols);
//}}}

//{{{ print barcode
	this.doPrint = function ()
	{
		var form = document.createElement('form');

		form.target	= "barcode";
		form.method	= "POST";
		form.action	= this.dir +"print.php";

		var postInput = document.createElement ('input');
		postInput.type = "hidden";
		postInput.name = "data";
		postInput.value = Ext.encode (Ext.pluck(this.storePrint.data.items, 'data'));

		form.appendChild (postInput);
		document.body.appendChild (form);

		sterek = window.open ("", form.target);

		if (sterek) {
			form.submit();
		} else {
			Jx.msg.error ("You must allow popups for this function to work.");
		}

		document.body.removeChild (form);
	};
//}}}

//{{{ panel print
	this.buttonPrint	= Ext.create ("Ext.button.Button", {
			text		:"Print"
		,	iconCls		:"print"
		,	handler		:this.doPrint
		,	scope		:this
		});

	this.panelPrint		= Ext.create ("Ext.grid.Panel", {
			itemId		:idPanelPrint
		,	store		:this.storePrint
		,	region		:"east"
		,	split		:true
		,	width		:"40%"
		,	plugins		:
			[{
				ptype		:"cellediting"
			}]
		,	viewConfig	:
			{
				plugins		:
				[{
					ptype		:"gridviewdragdrop"
				,	dragGroup	:idPanelPrint
				,	dropGroup	:idPanelAsset
				}]
			,	listeners	:
				{
					drop		:function (node, data)
					{
						if (data.records.length > 0) {
							data.records[0].set ("print_count", 1);
						}
					}
				}
			}
		,	tbar	:
			[
				this.buttonPrint
			]
		,	columns	:
			[{
				xtype		:"actioncolumn"
			,	iconCls		:"delete"
			,	width		:30
			,	handler		:function (view, rowidx, colidx, item, e, record)
				{
					Asset_Barcode.panelAsset.store.add (record);
					Asset_Barcode.storePrint.remove (record);
				}
			},{
				header		:"Barcode"
			,	dataIndex	:"barcode"
			,	width		:130
			},{
				header		:"Type"
			,	dataIndex	:"type_id"
			,	renderer	:Jx.app.store.Asset.Type.renderData ("id", "name")
			,	flex		:true
			},{
				header		:"Print #"
			,	dataIndex	:"print_count"
			,	width		:80
			,	editor		:
				{
					xtype			:"numberfield"
				,	allowDecimals	:false
				,	minValue		:1
				}
			}]
		});
//}}}

//{{{ main panel
	this.panel			= Ext.create ("Ext.container.Container", {
			itemId		:this.id
		,	title		:"Asset > Barcode"
		,	closable	:true
		,	layout		:"border"
		,	items		:
			[
				this.panelAsset
			,	this.panelPrint
			]
		});
//}}}

//{{{ refresh
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
					self.storePrint.removeAll ();
				}
			,	0);
	};
//}}}
}

var Asset_Barcode = new JxAssetBarcode ();

//# sourceURL=module/Asset/Barcode/layout.js
