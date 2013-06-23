Ext.define ("Jx.SearchField", {
	extend			:"Ext.form.field.Trigger"
,	alias			:"widget.jx.searchfield"
,	emptyText		:"Search ..."
,	tooltip			:"Type any string and enter to filter data"
,	initComponent	: function ()
	{
		var me = this;

		me.triggerCls = "x-form-clear-trigger"; // native ExtJS class & icon

		me.callParent (arguments);
	}

,	onTriggerClick: function ()
	{
		this.setRawValue('');
	}
});
