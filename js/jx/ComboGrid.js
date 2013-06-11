/*
	Copyright 2013 x10c-lab.com
	Authors:
		- Agus Sugianto (agus@x10c-lab.com)
*/
Ext.define ("Jx.ComboGrid", {
	extend			:"Ext.form.field.ComboBox"
,	requires		:
	[
		"Ext.grid.Panel"
    ]
,	alias			:"widget.jx.combogrid"
,	createPicker	:function()
	{
		var me 		= this
		,	picker
        ,	menuCls = Ext.baseCSSPrefix + "menu"
        ,	opts 	= Ext.apply (
						{
							selModel		:
							{
								mode		:me.multiSelect ? "SIMPLE" : "SINGLE"
							}
						,	viewConfig		:
							{
								stripeRows	:false
							}
						,	floating		:true
						,	hidden			:true
						,	ownerCt			:me.ownerCt
						,	cls				:me.el.up("." + menuCls) ? menuCls : ""
						,	store			:me.store
						,	pageSize		:me.pageSize
						,	displayField	:me.displayField
						,	hideHeaders		:me.hideHeaders
						,	focusOnToFront	:false
						,	border			:5
						}
						, me.listConfig
						, me.defaultListConfig
					);

		// picker = me.picker = Ext.create('Ext.view.BoundList', opts);
		picker = me.picker = Ext.create ("Jx.LiveSearchAddGridPanel", opts);

		// hack: pass getNode() to the view
		picker.getNode = function ()
		{
			picker.getView ().getNode (arguments);
		};

        me.mon (
			picker
		,	{
					itemclick	:me.onItemClick
				,	refresh		:me.onListRefresh
				,	scope		:me
        	}
		);

        me.mon (
			picker.getSelectionModel()
		,	{
				selectionChange	:me.onListSelectionChange
			,	scope			:me
			}
		);

        return picker;
    }
});
