/**
 * A GridPanel class with live search and add record support.
 * @author Nicolas Ferrero
 * @editor Agus Sugianto
 */
Ext.define("Jx.LiveSearchAddGridPanel", {
	extend			:"Ext.grid.Panel"
,	requires		:[
		"Ext.toolbar.TextItem"
	,	"Ext.form.field.Checkbox"
	,	"Ext.form.field.Text"
    ]
    
    /**
     * @private
     * search value initialization
     */
,	searchValue		:null
    
    /**
     * @private
     * The row indexes where matching strings are found. (used by previous and next buttons)
     */
,	indexes			:[]
    
    /**
     * @private
     * The row index of the first search, it could change if next or previous buttons are used.
     */
,	currentIndex	:null
    
    /**
     * @private
     * The generated regular expression used for searching.
     */
,	searchRegExp	:null
    
    /**
     * @private
     * Case sensitive mode.
     */
,	caseSensitive	:false
    
    /**
     * @private
     * Regular expression mode.
     */
,	regExpMode		:false
    
    /**
     * @cfg {String} matchCls
     * The matched string css classe.
     */
,	matchCls		:"x-livesearch-match"
    
    // Component initialization override: adds the top and bottom toolbars and setup headers renderer.
,	initComponent	:function () {
		var me = this;
		
		me.tbar = [{
			xtype	:"container"
		,	layout	:{
				type	:"hbox"
			,	pack	:"start"
			,	align	:"stretch"
			}
		,	items	:[{
				xtype			:"triggerfield"
			,	name			:"searchField"
			,	hideLabel		:true
			,	emptyText		:"Search"
			,	flex			:1
			,	triggerCls		:Ext.baseCSSPrefix + "form-clear-trigger"
			,	onTriggerClick	:function() {
					this.reset ();
				}
			,	listeners		:{
					change		:{
						fn		:me.onTextFieldChange
					,	scope	:this
					,	buffer	:100
					}
				}
			},{
				xtype		:"button"
			,	iconCls		:"panel-prev"
			,	tooltip		:"Find Previous Row"
			,	margin		:"0 0 0 5"
			,	handler		:me.onPreviousClick
			,	scope		:me
			},{
                xtype		:"button"
			,	iconCls		:"panel-next"
			,	tooltip		:"Find Next Row"
			,	margin		:"0 0 0 5"
			,	handler		:me.onNextClick
			,	scope		:me
			},{
				xtype		:"tbseparator"
			,	margin		:"0 0 0 5"
			},{
				xtype		:"checkbox"
			,	hideLabel	:true
			,	boxLabel	:"Regular expression"
			,	margin		:"0 0 0 5"
			,	handler		:me.regExpToggle
			,	scope		:me
			},{
				xtype		:"checkbox"
			,	hideLabel	:true
			,	boxLabel	:"Case sensitive"
			,	margin		:"0 0 0 5"
			,	handler		:me.caseSensitiveToggle
			,	scope		:me
			}]
		}];

		me.bbar	= [{
			xtype	:"container"
		,	layout	:{
				type	:"hbox"
			,	pack	:"start"
			,	align	:"stretch"
			}
		,	items	:[{
				xtype			:"triggerfield"
			,	name			:"addField"
			,	hideLabel		:true
			,	emptyText		:"Add New"
			,	triggerCls		:Ext.baseCSSPrefix + "form-clear-trigger"
			,	onTriggerClick	:function() {
					this.reset ();
				}
			,	listeners		:{
					scope		:me
				,	change		:function (t, n, o, e) {
						if (n != "") {
							me.down ("button[itemId=addButton]").setDisabled (false);
						} else {
							me.down ("button[itemId=addButton]").setDisabled (true);
						}
					}
				,	specialkey	:function (f, e) {
						if (e.ENTER == e.getKey ()) {
							me.onAddClick ();
						}
					}
				}
			},{
				xtype			:"button"
			,	itemId			:"addButton"
			,	text			:"Add"
			,	iconCls			:"panel-add"
			,	margin			:"0 0 0 5"
			,	disabled		:true
			,	handler			:me.onAddClick
			,	scope			:me
			}]
		}];
		
		me.callParent (arguments);
    }
    
    // afterRender override: it adds textfield and form add reference and start monitoring keydown events in textfield input 
,	afterRender		:function () {
        var me = this;
        me.callParent(arguments);
        me.textField = me.down ("textfield[name=searchField]");
    }
	
    // detects html tag
,	tagsRe			:/<[^>]*>/gm
    
    // DEL ASCII code
,	tagsProtect		:"\x0f"
    
    // detects regexp reserved word
,	regExpProtect	:/\\|\/|\+|\\|\.|\[|\]|\{|\}|\?|\$|\*|\^|\|/gm
    
    /**
     * In normal mode it returns the value with protected regexp characters.
     * In regular expression mode it returns the raw value except if the regexp is invalid.
     * @return {String} The value to process or null if the textfield value is blank or invalid.
     * @private
     */
,	getSearchValue	:function() {
		var me 		= this
		,	value	= me.textField.getValue();

		if (value === "") {
            return null;
        }
        if (!me.regExpMode) {
            value = value.replace (me.regExpProtect, function(m) {
                return "\\" + m;
            });
        } else {
            try {
                new RegExp (value);
            } catch (error) {
                return null;
            }
            // this is stupid
            if (value === "^" || value === "$") {
                return null;
            }
        }

		return value;
    }
    
    /**
     * Finds all strings that matches the searched value in each grid cells.
     * @private
     */
,	onTextFieldChange: function() {
		var	me 		= this
		,	count 	= 0;

		me.view.refresh  ();

		me.searchValue = me.getSearchValue ();
		me.indexes = [];
		me.currentIndex = null;

		if (me.searchValue !== null) {
			me.searchRegExp = new RegExp(me.searchValue, "g" + (me.caseSensitive ? "" : "i"));
             
			me.store.each (function (record, idx) {
				var	td = Ext.fly (me.view.getNode (idx)).down ("td")
				,	cell
				,	matches
				,	cellHTML;
				
				while (td) {
					cell = td.down (".x-grid-cell-inner");
					matches = cell.dom.innerHTML.match (me.tagsRe);
					cellHTML = cell.dom.innerHTML.replace (me.tagsRe, me.tagsProtect);
                     
					// populate indexes array, set currentIndex, and replace wrap matched string in a span
					cellHTML = cellHTML.replace (me.searchRegExp, function (m) {
						count += 1;
						if (Ext.Array.indexOf (me.indexes, idx) === -1) {
							me.indexes.push(idx);
						}
						if (me.currentIndex === null) {
							me.currentIndex = idx;
                        }
						return '<span class="' + me.matchCls + '">' + m + '</span>';
					});
					// restore protected tags
					Ext.each (matches, function(match) {
						cellHTML = cellHTML.replace (me.tagsProtect, match); 
					});
					// update cell html
					cell.dom.innerHTML = cellHTML;
					td = td.next();
				}
			}, me);

			// results found
			if (me.currentIndex !== null) {
				me.getView ().focusRow (me.currentIndex);
			}
		}

		// no results found
		if (me.currentIndex === null) {
			me.getView ().focusRow (0);
		}

		// force textfield focus
		me.textField.focus ();
	}
    
	/**
     * Selects the previous row containing a match.
     * @private
     */   
,	onPreviousClick	: function () {
		var	me = this
		,	idx;
            
		if ((idx = Ext.Array.indexOf (me.indexes, me.currentIndex)) !== -1) {
			me.currentIndex = me.indexes[idx - 1] || me.indexes[me.indexes.length - 1];
			me.getView ().focusRow (me.currentIndex);
		}
	}
    
    /**
     * Selects the next row containing a match.
     * @private
     */    
,	onNextClick		: function () {
		var	me = this
		,	idx;

		if ((idx = Ext.Array.indexOf (me.indexes, me.currentIndex)) !== -1) {
			me.currentIndex = me.indexes[idx + 1] || me.indexes[0];
			me.getView ().focusRow (me.currentIndex);
		}
	}
    
    /**
     * Switch to case sensitive mode.
     * @private
     */    
,	caseSensitiveToggle	: function (checkbox, checked) {
		this.caseSensitive = checked;
		this.onTextFieldChange ();
	}
    
    /**
     * Switch to regular expression mode
     * @private
     */
,	regExpToggle	: function (checkbox, checked) {
		this.regExpMode = checked;
		this.onTextFieldChange ();
	}

    /**
     * Add new row
     * @private
     */    
,	onAddClick		: function () {
		var	me	= this;
		var	v	= me.down ("textfield[name=addField]").getValue ();
		
		Ext.Ajax.request ({
			scope		:me
		,	url			:me.getStore ().proxy.url
		,	params		:{
				action	:"create"
			,	value	:v
			}
		,	success		:function (response, opts)
			{
				var obj = Ext.decode(response.responseText);
			
				if (obj.success == true) {
					me.getStore ().reload ();
				} else {
					Jx.msg.error (obj.data);
				}
			}
		,	failure		:function (response, opts)
			{
				Jx.msg.error ("server-side failure with status code " + response.status);
			}
		});
	}
});