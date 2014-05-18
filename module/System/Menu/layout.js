/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/

function JxSystemMenu ()
{
	this.id		= "System_Menu";
	this.dir	= Jx.generateModDir (this.id);

	this.store			= Ext.create ("Jx.StoreRest", {
			url			:this.dir
		,	idProperty	:""
		,	fields		:
			[
				"id"
			,	"pid"
			,	"type"
			,	"label"
			,	"icon"
			,	"image"
			,	"module"
			,	"description"
			]
		});

	this.panel			= Ext.create ("Jx.GridPaging.FormEditor", {
			itemId		:this.id
		,	store		:this.store
		,	panelConfig	:
			{
				itemId		:this.id
			,	title		:"System Menu"
			,	closable	:true
			}
		,	columns		:
			[{
				header		:"ID"
			,	dataIndex	:"id"
			,	editor		:
				{
					xtype			:"numberfield"
				,	minValue		:0
				,	allowDecimals	:false
				}
			},{
				header		:"PID"
			,	dataIndex	:"pid"
			,	editor		:
				{
					xtype			:"numberfield"
				,	minValue		:0
				,	allowDecimals	:false
				}
			},{
				header		:"Type"
			,	dataIndex	:"type"
			,	editor		:
				{
					xtype			:"numberfield"
				,	minValue		:0
				,	maxValue		:3
				,	allowDecimals	:false
				}
			},{
				header		:"Label"
			,	dataIndex	:"label"
			,	width		:200
			,	editor		:
				{
				}
			},{
				header		:"Icon"
			,	dataIndex	:"icon"
			,	width		:140
			,	editor		:
				{
				}
			},{
				header		:"Image"
			,	dataIndex	:"image"
			,	width		:200
			,	editor		:
				{
				}
			},{
				header		:"Module"
			,	dataIndex	:"module"
			,	width		:200
			,	editor		:
				{
				}
			},{
				header		:"Description"
			,	dataIndex	:"description"
			,	width		:300
			,	editor		:
				{
					xtype		:"textarea"
				}
			}]
		});

	this.doRefresh	= function (perm)
	{
		this.panel.doRefresh (perm);
	};
}

var System_Menu = new JxSystemMenu ();

//# sourceURL=module/System/Menu/layout.js
