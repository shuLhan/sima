/*
	Copyright 2013 x10c-lab.com
	Authors:
		- mhd.sulhan (sulhan@x10c-lab.com)
*/

Ext.QuickTips.init();

/*
	Various fixes for ExtJS bugs.
*/

/* Tooltip windows too small */
delete Ext.tip.Tip.prototype.minWidth;

/* Row editor is not sending "edit" event when column locked is true */
Ext.override (Ext.grid.locking.View, {
	focus: function() {
		var p = this.getSelectionModel().getCurrentPosition(),
			v = p && p.view ? p.view : this.normalView;

		v.focus();
    }
});

/*
	Default properties for Ext components.
*/

/*
	Ext.data.Store.
	- Set "autoLoad" and "autoSync" default to false.
	- Set "autoDestroy" to true.
	- Add function renderData to store, to render column using store.
*/
Ext.override (Ext.data.Store, {
		autoLoad	:false
	,	autoSync	:false
	,	autoDestroy	:true
	,	action		:"read"		// store current action (read, create, update, destroy).
	,	renderData	:function (valueField, displayField)
		{
			var store = this;
			return function (v) {
				var i = store.find (valueField, v);
				if (i < 0) {
					return v;
				}
				var r = store.getAt (i);
				return r ? r.get (displayField) : "[no data found]";
			}
		}
	});

/*
	Ext.form.Panel
	- Set default label align to "right".
	- Set default layout to "anchor".
	- Set default item type to "textfield".
	- Set default form item anchor to "100%".
*/
Ext.override (Ext.form.Panel, {
		autoScroll	:true
	,	bodyPadding	:10
	,	border		:false
	,	layout		:"anchor"
	,	titleAlign	:"center"
	,	defaultType	:"textfield"
	,	defaults	:
		{
			anchor		:"100%"
		,	labelAlign	:"left"
		}
});

/*
	Register our application.
*/
Ext.application ({
	name		:"Jx"
,	appFolder	:"js/jx"
,	appProperty	:""
});

Jx = {
	pageSize	:_g_paging_size
,	msg			:
	{
		el				:""
	,	AJAX_FAILURE	:"AJAX communication failed!"
	,	AJAX_SUCCESS	:"Data has been saved!"
	,	ACTION_UNKNOWN	:"Unknown action "

	,	display 		:function (title, format, cls, delay)
		{
			if (! this.el) {
				this.el = Ext.DomHelper.insertFirst (document.body, {id:'jx-msg'}, true);
			}
			var s = Ext.String.format.apply (String, Array.prototype.slice.call(arguments, 1));
			var m = Ext.DomHelper.append (this.el
					, '<div class="'+ cls +'"><h3>' + title + '</h3><p>' + s + '</p></div>'
					, true);
			m.hide();
			m.slideIn ("t").ghost ("t", { delay: delay, remove: true });
		}

	,	info	:function (format)
		{
			this.display ("Information", format, "info", 2000);
		}

	,	error	:function (format)
		{
			this.display ("Error", format, "error", 4000);
		}

	,	confirm	:function (yesCallback, scope)
		{
			Ext.Msg.confirm (
				"Confirmation"
			,	"Selected data will be deleted. <br/> Are you sure?"
			,	function (buttonId, text, me)
				{
					if (buttonId == "yes") {
						if (yesCallback && typeof (yesCallback) === "function") {
							yesCallback.call (scope);
						}
					}
				}
			);
		}
	}
};
