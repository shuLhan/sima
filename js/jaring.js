/*
	Copyright 2014 - Mhd Sulhan
	Authors:
		- mhd.sulhan (m.shulhan@gmail.com)
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
	- Add function renderData to store, to render column using store.
*/
Ext.override (Ext.data.Store, {
	renderData	:function (valueField, displayField)
		{
			var store = this;
			return function (v) {
				var i = store.find (valueField, v, 0, false, false, true);
				if (i < 0) {
					return v;
				}
				var r = store.getAt (i);
				return r ? r.get (displayField) : "[no data found]";
			};
		}
	});

Ext.override (Ext.Loader, {
	preserveScript	:false
,	garbageCollect	:true
,	enabled			:true
});

/*
	Register our application.
*/
Ext.application ({
	name		:"Jx"
,	appFolder	:_g_root +"js/jx"
,	appProperty	:""
});

Ext.apply (Jx, {
	pageSize	:_g_paging_size
,	msg			:
	{
		el				:""
	,	AJAX_FAILURE	:"AJAX communication failed."
	,	AJAX_SUCCESS	:"Data has been saved."
	,	ACTION_UNKNOWN	:"Unknown action "
	,	CLIENT_INVALID	:"Form fields may not be submitted with invalid values."
	,	SERVER_ERROR	:"Server request error."

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

	,	saveChanges	:function (cb, scope)
		{
			Ext.Msg.show ({
				title	:'Save Changes?'
			,	msg		:'You are leaving module that has unsaved changes. Would you like to save your changes?'
			,	buttons	:Ext.Msg.YESNOCANCEL
			,	icon	:Ext.Msg.QUESTION
			,	fn		:cb
			,	scope	:scope
			});
		}
	}
,	mask		:undefined
,	showMask	:function ()
	{
		if (undefined === this.mask) {
			this.mask = Ext.create ("Ext.LoadMask", {
				target		:Ext.getBody ()
			});
		}
		this.mask.show ();
	}
,	hideMask	:function ()
	{
		if (undefined !== this.mask) {
			this.mask.hide ();
		}
	}

	/*
		@return: module directory.
	*/
,	generateModDir	:function (id)
	{
		return _g_module_dir + id.replace (/_/g, "/") +"/";
	}

,	generateItemId	:function (config, prefix, name)
	{
		if (undefined === config) {
			return prefix + name;
		}
		if (config.id) {
			return config.id + name;
		}
		if (config.itemId) {
			return config.itemId + name;
		}
		return prefix + name;
	}

,	chainStoreLoad :function (stores, lastCall, idx)
	{
		if (idx === stores.length) {
			if ("function" === typeof lastCall) {
				lastCall.call ();
			}
			return;
		}
		stores[idx].load (function (r,o,s) {
			Jx.chainStoreLoad (stores, lastCall, idx + 1);
		});
	}
});
