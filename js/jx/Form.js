/*
	Copyright 2013 - x10c-lab.com
	Authors:
		- mhd.sulhan (sulhan@x10c-lab.com)
		- agus sugianto (agus@x10c-lab.com)

	Custom form panel with capabilities to use store to sync data.

	Additional configuration:
	- owner			:parent component.

	- createButtonBar
		+ true		:create buttom bar with addition button, save and cancel (default).
		+ false		:no buttom bar created.

	- ui			:ui style for form, values are "default" and "light"
	
	- syncUseStore
		+ true		:sync data using store from owner.
		+ false		:sync data using form submit.
*/
Ext.define ("Jx.Form", {
	extend			:"Ext.form.Panel"
,	alias			:"jx.form"
,	autoScroll		:true
,	bodyPadding		:10
,	border			:false
,	layout			:"anchor"
,	titleAlign		:"center"
,	defaultType		:"textfield"
,	config			:
	{
		owner			:undefined	// owner of this component
	,	createButtonBar	:true
	,	ui				:"default"
	,	syncUseStore	:true
	,	defaults		:
		{
			anchor			:"100%"
		,	labelAlign		:"right"
		}
	}

,	initComponent	:function ()
	{
		this.callParent (arguments);
		this.doCreateButtonBar ();
	}

,	doCreateButtonBar :function ()
	{
		if (false == this.createButtonBar) {
			return;
		}

		this.buttonSave			= Ext.create ("Ext.button.Button", {
					text		:"Save"
			,       itemId		:"save"
			,       iconCls		:"form-save"
			,       formBind	:true
			,       tooltip		:"Save record"
			});

		this.buttonCancel		= Ext.create ("Ext.button.Button", {
						text	:"Cancel"
				,       itemId	:"cancel"
				,       iconCls	:"form-cancel"
				,       tooltip	:"Cancel record operation"
				});

		this.buttonSave.setHandler (this.doSave, this);
		this.buttonCancel.setHandler (this.doCancel, this);

		var barName		= "ButtonBar";
		var id			= (
							this.id
							? this.id + barName
							: (
								this.itemId
								? this.itemId + barName
								: "JxForm"+ barName
							)
						);

		this.buttonBar	= Ext.create ("Ext.toolbar.Toolbar", {
				id			:id
			,	dock		:"bottom"
			,	border		:true
			,	shadow		:true
			,	ui			:"footer"
			,	items		:
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

,	doSave		:function ()
	{
		if (this.owner.beforeFormSave
		&& typeof (this.owner.beforeFormSave) === "function") {
			if (this.owner.beforeFormSave () == false) {
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
		if (true == this.syncUseStore) {
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
					Jx.msg.info (Jx.msg.AJAX_SUCCESS);
					this.hide ();
					this.afterSaveSuccess ();
				}
			,	failure	:function (batch, action)
				{
					this.afterSaveFailure ();
				}
			});

		} else { /* Otherwise use basic form submit */
			var url;

			/* Generate url based on user action */
			switch (this.store.action) {
			case "read":
				url = this.store.proxy.api.read;
				break;
			case "create":
				url = this.store.proxy.api.create;
				break;
			case "update":
				url = this.store.proxy.api.update;
				break;
			case "destroy":
				url = this.store.proxy.api.destroy;
				break;
			default:
				Jx.msg.error (Jx.msg.ACTION_UNKNOWN +"'"+ this.store.action +"'");
				return;
			}

			f.submit ({
				url		:url
			,	params	:
				{
					action	:this.store.action
				}
			,	scope	:this
			,	success	:function (form, action)
				{
					Jx.msg.info (action.result.data);
					this.hide ();
					this.afterSaveSuccess ();
				}
			,	failure	:function (form, action)
				{
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
					if (this.owner.afterFormSave
					&& typeof (this.owner.afterFormSave) === "function") {
						if (this.owner.afterFormSave (success) == false) {
							return;
						}
					}
				}
			});
	}

,	afterSaveFailure	:function (action)
	{
		switch (action.failureType) {
		case Ext.form.action.Action.CLIENT_INVALID:
			Jx.msg.error ("Form fields may not be submitted with invalid values");
			break;
		case Ext.form.action.Action.CONNECT_FAILURE:
			Jx.msg.error (Jx.msg.AJAX_FAILURE);
			break;
		case Ext.form.action.Action.SERVER_INVALID:
			Jx.msg.error (this.store.proxy.reader.rawData.data);
			break;
		}

		if (this.owner.afterFormSave
		&& typeof (this.owner.afterFormSave) === "function") {
			if (this.owner.afterFormSave (false) == false) {
				return;
			}
		}
	}

,	doCancel	:function ()
	{
		if (this.owner.beforeFormCancel
		&& typeof (this.owner.beforeFormCancel) === "function") {
			if (this.owner.beforeFormCancel () == false) {
				return;
			}
		}

		this.hide ();

		if (this.owner.afterFormCancel
		&& typeof (this.owner.afterFormCancel) === "function") {
			this.owner.afterFormCancel ();
		}
	}
});
