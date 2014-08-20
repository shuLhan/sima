/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)

	Grid display column in tree.
*/
Ext.define ("Jx.GridTree", {
	extend		:"Ext.tree.Panel"
,	alias		:"widget.jx.gridtree"
,	titleAlign	:"center"
,	useArrows	:true
,	rootVisible	:false
,	config		:
	{
		perm					:0
	,	selectedData			:[]
		// crud buttons.
	,	plugCrudButtons			:undefined
	,	plugCrudButtonsConfig	:{}
	,	showCrudButtons			:true
		// search bar
	,	plugSearchField			:undefined
	,	plugSearchFieldConfig	:{}
	,	showSearchField			:true
	}

//{{{ constructor
,	constructor		:function (config)
	{
		Ext.merge (this, config);

		this.callParent ();

		// Inject CRUD buttons to panel.
		if (this.showCrudButtons) {
			this.plugCrudButtons	= Ext.create ("Jx.plugin.CrudButtons"
									, this.plugCrudButtonsConfig
									);
			this.addPlugin (this.plugCrudButtons);
		}

		// Inject search field.
		if (this.showSearchField) {
			this.plugSearchField	= Ext.create ("Jx.plugin.SearchField"
									, this.plugSearchFieldConfig
									);

			this.addPlugin (this.plugSearchField);
		}

		// Register events.
		this.addEvents ("refresh");

		this.on ("selectionchange", this._onSelectionChange, this);
	}
//}}}
//{{{ function : remove all data in store.
,	clearData	:function ()
	{
		this.store.loadData ([], false);
	}
//}}}
//{{{ event handler : on row selected.
,	_onSelectionChange		:function (model, data, e)
	{
		var s	= (data.length <= 0);
		var id	= 0;

		if (this.beforeSelectionChange && typeof (this.beforeSelectionChange) === "function") {
			if (this.beforeSelectionChange (model, data, e) === false) {
				return false;
			}
		}

		this.selectedData = data;

		if (this.onSelectionChange
		&& typeof (this.onSelectionChange) === "function") {
			this.onSelectionChange (model, data, e);
		}

		if (this.afterSelectionChange
		&& typeof (this.afterSelectionChange) === "function") {
			this.afterSelectionChange (model, data, e);
		}
	}
//}}}
//{{{ function : refresh this grid
,	doRefresh	:function (perm)
	{
		this.perm = perm;
		this.fireEvent ("refresh", perm);
	}
//}}}
});
