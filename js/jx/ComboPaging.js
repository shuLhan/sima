/*
	Copyright 2013 x10c-lab.com
	Authors:
		- mhd.sulhan (sulhan@x10c-lab.com)

	Custom combobox with paging and searching.
*/
Ext.define ("Jx.ComboPaging", {
	extend			:"Ext.form.field.ComboBox"
,	alias			:"jx.combopaging"
,	forceSelection	:true
,	pageSize		:_g_paging_size
,	shrinkWrap		:3
,	typeAhead		:true
,	typeAheadDelay	:500

,	initComponent	:function ()
	{
		this.callParent (arguments);
	}
});
