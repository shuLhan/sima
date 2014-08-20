/*
	Copyright 2014 - Mhd Sulhan
	Authors:
	- mhd.sulhan (m.shulhan@gmail.com)

	Custom form panel with capabilities to use store to sync data.

	- createButtonBar
		+ true		:create button bar at the bottom with additional button
					 save and cancel (default).
		+ false		:no button bar created.

	- syncUseStore
		+ true		:sync data using store.
		+ false		:sync data using form submit.
*/
Ext.define ("Jx.Form", {
	extend			:"Ext.form.Panel"
,	alias			:"widget.jx.form"
,	config			:
	{
		autoScroll		:true
	,	jsonSubmit		:true
	,	bodyPadding		:10
	,	bodyStyle		:'border:0px;'
	,	border			:false
	,	defaultType		:"textfield"
	,	titleAlign		:"center"
	,	ui				:"default"
	,	defaults		:
		{
			anchor			:"100%"
		,	labelAlign		:"right"
		}
		/* custom configurations */
	,	createButtonBar	:true
	,	syncUseStore	:true

	,	afterFormSave	:function (success)
		{
			if (success) {
				this.hide ();
			}
		}
	,	afterFormCancel :function ()
		{
			this.hide ();
		}
	}

,	constructor	:function (cfg)
	{
		var opts = Ext.merge ({}, this.config);
			opts = Ext.merge (opts, cfg);

		this.callParent ([opts]);
		this.initConfig (opts);

		this.doCreateButtonBar (opts);

		// Register events.
		this.addEvents ("savesuccess");
		this.addEvents ("savefail");
		this.addEvents ("canceled");
	}

,	doCreateButtonBar :function (cfg)
	{
		if (false === cfg.createButtonBar) {
			return;
		}

		this.buttonSave		= Ext.create ("Ext.button.Button", {
				text		:"Save"
			,	itemId		:"save"
			,	iconCls		:"form-save"
			,	formBind	:true
			,	tooltip		:"Save record"
			});

		this.buttonCancel	= Ext.create ("Ext.button.Button", {
				text		:"Cancel"
			,	itemId		:"cancel"
			,	iconCls		:"form-cancel"
			,	tooltip		:"Cancel record operation"
			});

		this.buttonSave.setHandler (this.doSave, this);
		this.buttonCancel.setHandler (this.doCancel, this);

		var id = Jx.generateItemId (cfg, "JxForm", "ButtonBar");

		this.buttonBar	= Ext.create ("Ext.toolbar.Toolbar", {
				itemId	:id
			,	dock	:"bottom"
			,	border	:true
			,	shadow	:true
			,	ui		:"footer"
			,	items	:
				[
					this.buttonCancel
				,	"-"
				,	"->"
				,	"-"
				,	this.buttonSave
				]
			});

		this.addDocked (this.buttonBar);
	}

,	columnsToFields : function (columns)
	{
		/* Add each column's editor to form */
		for (var i = 0, c = null; i < columns.length; i++) {
			c = columns[i];

			if (undefined != c.columns) {
				var cfg = {};

				Ext.merge (cfg, {
						title			:c.header
					,	layout			:"anchor"
					,	defaultType		:"textfield"
					,	flex			:1
					,	fieldDefaults	:
						{
							anchor			:"100%"
						,	msgTarget		:"side"
						,	labelAlign		:"right"
						}
					});
				Ext.merge (cfg, c.fsConfig);

				var fs	= Ext.create ("Ext.form.FieldSet", cfg);

				for (var k = 0, cc = null; k < c.columns.length; k++) {
					cc = c.columns[k];

					if (undefined != cc.editor) {
						if (undefined == cc.editor.fieldLabel) {
							cc.editor.fieldLabel = cc.header || cc.text;
						}
						if (undefined === cc.name) {
							cc.editor.name = cc.dataIndex;
						} else {
							cc.editor.name = cc.name;
						}

						fs.add (cc.editor);
					}
				}

				this.add (fs);
			} else if (undefined != c.editor) {
				if (undefined == c.editor.fieldLabel) {
					c.editor.fieldLabel	= c.header || c.text;
				}
				if (undefined === c.name) {
					c.editor.name = c.dataIndex;
				} else {
					c.editor.name = c.name;
				}

				this.add (c.editor);
			}
		}
	}

,	doSave		:function ()
	{
		if (this.beforeFormSave
		&& typeof (this.beforeFormSave) === "function") {
			if (this.beforeFormSave () === false) {
				return;
			}
		}

		var f = this.getForm ();

		f.setValues (this.store.proxy.extraParams);

		if (!f.isValid ()) {
			Jx.msg.error ("Invalid form values!<br/>Please correct or fill form's field with red mark.");
			return;
		}

		/* If syncUseStore is true, use store.api to sync data */
		if (true === this.syncUseStore) {
			switch (this.store.action) {
			case "create":
				this.store.add (f.getValues ());
				break;
			case "update":
				f.updateRecord ();
				break;
			case "destroy":
				this.store.remove (f.getRecord ());
				break;
			default:
				Jx.msg.error (Jx.msg.ACTION_UNKNOWN +"'"+ this.store.action +"'");
				return;
			}

			this.store.proxy.extraParams.action = this.store.action;

			this.store.sync ({
				scope	:this
			,	success	:function (batch, action)
				{
					var data = this.store.proxy.reader.rawData.data;

					Jx.msg.info (data || Jx.msg.AJAX_SUCCESS);
					this.afterSaveSuccess ();
				}
			,	failure	:function (batch, action)
				{
					this.store.rejectChanges ();
					this.afterSaveFailure (action);
				}
			});

		} else { /* Otherwise use basic form submit */
			var url;
			var method = "GET";

			/* Generate url based on user action */
			switch (this.store.action) {
			case "read":
				url		= this.store.proxy.api.read;
				method	= "GET";
				break;
			case "create":
				url		= this.store.proxy.api.create;
				method	= "POST";
				break;
			case "update":
				url = this.store.proxy.api.update;

				if (this.store.singleApi) {
					method	= "PUT";
				} else {
					method	= "POST";
				}
				break;
			case "destroy":
				url = this.store.proxy.api.destroy;

				if (this.store.singleApi) {
					method	= "DELETE";
				} else {
					method	= "POST";
				}

				break;
			default:
				Jx.msg.error (Jx.msg.ACTION_UNKNOWN +"'"+ this.store.action +"'");
				return;
			}

			f.submit ({
				url		:url
			,	method	:method
			,	params	:
				{
					action		:this.store.action
				,	subaction	:this.store.proxy.extraParams.subaction
				}
			,	scope	:this
			,	success	:function (form, action)
				{
					Jx.msg.info (action.result.data);
					this.afterSaveSuccess ();
				}
			,	failure	:function (form, action)
				{
					this.store.rejectChanges ();
					this.afterSaveFailure (action);
				}
			,	clientValidation	:false
			});
		}
	}

,	afterSaveSuccess	:function ()
	{
		this.store.proxy.extraParams.action = this.store.action = "read";
		this.store.reload ({
				scope		:this
			,	callback	:function (r, op, success)
				{
					this.fireEvent ("savesuccess");

					if (this.afterFormSave
					&& typeof (this.afterFormSave) === "function") {
						if (this.afterFormSave (success) === false) {
							return;
						}
					}
				}
			});
	}

,	afterSaveFailure	:function (action)
	{
		this.fireEvent ("savefail");

		if (undefined !== action.failureType) {
			switch (action.failureType) {
			case Ext.form.action.Action.CLIENT_INVALID:
				Jx.msg.error (Jx.msg.CLIENT_INVALID);
				break;
			case Ext.form.action.Action.CONNECT_FAILURE:
				Jx.msg.error (Jx.msg.AJAX_FAILURE);
				break;
			case Ext.form.action.Action.SERVER_INVALID:
				if (action.result) {
					Jx.msg.error (action.result.data);
				} else {
					Jx.msg.error (this.store.proxy.reader.rawData.data);
				}
				break;
			default:
				Jx.msg.error (Jx.msg.SERVER_ERROR);
				break;
			}
		} else {
			if (action.result) {
				Jx.msg.error (action.result.data);
			} else {
				Jx.msg.error (this.store.proxy.reader.rawData.data);
			}
		}

		if (this.afterFormSave
		&& typeof (this.afterFormSave) === "function") {
			if (this.afterFormSave (false) === false) {
				return;
			}
		}
	}

,	doCancel	:function ()
	{
		this.fireEvent ("canceled");

		if (this.beforeFormCancel
		&& typeof (this.beforeFormCancel) === "function") {
			if (this.beforeFormCancel () === false) {
				return;
			}
		}

		if (this.afterFormCancel
		&& typeof (this.afterFormCancel) === "function") {
			this.afterFormCancel ();
		}
	}
});
