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

//{{{ panel asset
	this.panelAsset			= Ext.create ("Jx.GridPaging", {
			itemId			:idPanelAsset
		,	store			:Jx.app.store.Asset
		,	showCrudButtons	:false
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
		});
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
		,	width		:"50%"
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
