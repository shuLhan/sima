/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
*/
function JxSystemMedia ()
{
	this.id		= "System_Media";
	this.dir	= Jx.generateModDir (this.id);

	this.store		= Ext.create ("Jx.Store", {
		url			:this.dir
	,	fields		:
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

	this.panel			= Ext.create ("Jx.GridPaging.FormEditor", {
			itemId		:this.id
		,	store		:this.store
		,	panelConfig	:
			{
				title		:"System Media"
			,	closable	:true
			}
		,	formConfig	:
			{
				syncUseStore	:false
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
			,	editor		:
				{
					xtype		:"textfield"
				}
			},{
				header		:"Extension"
			,	dataIndex	:"extension"
			,	editor		:
				{
					xtype		:"textfield"
				,	hidden		:true
				}
			},{
				header		:"Size"
			,	dataIndex	:"size"
			,	hidden		:true
			,	editor		:
				{
					xtype		:"numberfield"
				,	hidden		:true
				}
			},{
				header		:"Mime"
			,	dataIndex	:"mime"
			,	editor		:
				{
					xtype		:"textfield"
				,	hidden		:true
				}
			},{
				header		:"Description"
			,	dataIndex	:"description"
			,	flex		:1
			,	editor		:
				{
					xtype		:"textarea"
				}
			},{
				header		:"Path"
			,	dataIndex	:"path"
			,	hidden		:true
			,	editor		:
				{
					xtype		:"textfield"
				,	hidden		:true
				}
			},{
				header		:"Content"
			,	dataIndex	:"content"
			,	hidden		:true
			,	editor		:
				{
					xtype		:"filefield"
				,	itemId		:"content"
				,	buttonText	:"Select File"
				,	editable	:false
				}
			}]
		});

	this.doRefresh	= function (perm)
	{
		this.panel.doRefresh (perm);
	};
};

var System_Media = new JxSystemMedia ();

//# sourceURL=module/System/Media/layout.js
