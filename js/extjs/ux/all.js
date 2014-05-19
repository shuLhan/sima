/**
 * Basic status bar component that can be used as the bottom toolbar of any {@link Ext.Panel}.  In addition to
 * supporting the standard {@link Ext.toolbar.Toolbar} interface for adding buttons, menus and other items, the StatusBar
 * provides a greedy status element that can be aligned to either side and has convenient methods for setting the
 * status text and icon.  You can also indicate that something is processing using the {@link #showBusy} method.
 *
 *     Ext.create('Ext.Panel', {
 *         title: 'StatusBar',
 *         // etc.
 *         bbar: Ext.create('Ext.ux.StatusBar', {
 *             id: 'my-status',
 *      
 *             // defaults to use when the status is cleared:
 *             defaultText: 'Default status text',
 *             defaultIconCls: 'default-icon',
 *      
 *             // values to set initially:
 *             text: 'Ready',
 *             iconCls: 'ready-icon',
 *      
 *             // any standard Toolbar items:
 *             items: [{
 *                 text: 'A Button'
 *             }, '-', 'Plain Text']
 *         })
 *     });
 *
 *     // Update the status bar later in code:
 *     var sb = Ext.getCmp('my-status');
 *     sb.setStatus({
 *         text: 'OK',
 *         iconCls: 'ok-icon',
 *         clear: true // auto-clear after a set interval
 *     });
 *
 *     // Set the status bar to show that something is processing:
 *     sb.showBusy();
 *
 *     // processing....
 *
 *     sb.clearStatus(); // once completeed
 *
 */
Ext.define('Ext.ux.statusbar.StatusBar', {
    extend: 'Ext.toolbar.Toolbar',
    alternateClassName: 'Ext.ux.StatusBar',
    alias: 'widget.statusbar',
    requires: ['Ext.toolbar.TextItem'],
    /**
     * @cfg {String} statusAlign
     * The alignment of the status element within the overall StatusBar layout.  When the StatusBar is rendered,
     * it creates an internal div containing the status text and icon.  Any additional Toolbar items added in the
     * StatusBar's {@link #cfg-items} config, or added via {@link #method-add} or any of the supported add* methods, will be
     * rendered, in added order, to the opposite side.  The status element is greedy, so it will automatically
     * expand to take up all sapce left over by any other items.  Example usage:
     *
     *     // Create a left-aligned status bar containing a button,
     *     // separator and text item that will be right-aligned (default):
     *     Ext.create('Ext.Panel', {
     *         title: 'StatusBar',
     *         // etc.
     *         bbar: Ext.create('Ext.ux.statusbar.StatusBar', {
     *             defaultText: 'Default status text',
     *             id: 'status-id',
     *             items: [{
     *                 text: 'A Button'
     *             }, '-', 'Plain Text']
     *         })
     *     });
     *
     *     // By adding the statusAlign config, this will create the
     *     // exact same toolbar, except the status and toolbar item
     *     // layout will be reversed from the previous example:
     *     Ext.create('Ext.Panel', {
     *         title: 'StatusBar',
     *         // etc.
     *         bbar: Ext.create('Ext.ux.statusbar.StatusBar', {
     *             defaultText: 'Default status text',
     *             id: 'status-id',
     *             statusAlign: 'right',
     *             items: [{
     *                 text: 'A Button'
     *             }, '-', 'Plain Text']
     *         })
     *     });
     */
    /**
     * @cfg {String} [defaultText='']
     * The default {@link #text} value.  This will be used anytime the status bar is cleared with the
     * `useDefaults:true` option.
     */
    /**
     * @cfg {String} [defaultIconCls='']
     * The default {@link #iconCls} value (see the iconCls docs for additional details about customizing the icon).
     * This will be used anytime the status bar is cleared with the `useDefaults:true` option.
     */
    /**
     * @cfg {String} text
     * A string that will be <b>initially</b> set as the status message.  This string
     * will be set as innerHTML (html tags are accepted) for the toolbar item.
     * If not specified, the value set for {@link #defaultText} will be used.
     */
    /**
     * @cfg {String} [iconCls='']
     * A CSS class that will be **initially** set as the status bar icon and is
     * expected to provide a background image.
     *
     * Example usage:
     *
     *     // Example CSS rule:
     *     .x-statusbar .x-status-custom {
     *         padding-left: 25px;
     *         background: transparent url(images/custom-icon.gif) no-repeat 3px 2px;
     *     }
     *
     *     // Setting a default icon:
     *     var sb = Ext.create('Ext.ux.statusbar.StatusBar', {
     *         defaultIconCls: 'x-status-custom'
     *     });
     *
     *     // Changing the icon:
     *     sb.setStatus({
     *         text: 'New status',
     *         iconCls: 'x-status-custom'
     *     });
     */

    /**
     * @cfg {String} cls
     * The base class applied to the containing element for this component on render.
     */
    cls : 'x-statusbar',
    /**
     * @cfg {String} busyIconCls
     * The default {@link #iconCls} applied when calling {@link #showBusy}.
     * It can be overridden at any time by passing the `iconCls` argument into {@link #showBusy}.
     */
    busyIconCls : 'x-status-busy',
    /**
     * @cfg {String} busyText
     * The default {@link #text} applied when calling {@link #showBusy}.
     * It can be overridden at any time by passing the `text` argument into {@link #showBusy}.
     */
    busyText : 'Loading...',
    /**
     * @cfg {Number} autoClear
     * The number of milliseconds to wait after setting the status via
     * {@link #setStatus} before automatically clearing the status text and icon.
     * Note that this only applies when passing the `clear` argument to {@link #setStatus}
     * since that is the only way to defer clearing the status.  This can
     * be overridden by specifying a different `wait` value in {@link #setStatus}.
     * Calls to {@link #clearStatus} always clear the status bar immediately and ignore this value.
     */
    autoClear : 5000,

    /**
     * @cfg {String} emptyText
     * The text string to use if no text has been set. If there are no other items in
     * the toolbar using an empty string (`''`) for this value would end up in the toolbar
     * height collapsing since the empty string will not maintain the toolbar height.
     * Use `''` if the toolbar should collapse in height vertically when no text is
     * specified and there are no other items in the toolbar.
     */
    emptyText : '&#160;',

    // private
    activeThreadId : 0,

    // private
    initComponent : function(){
        var right = this.statusAlign === 'right';

        this.callParent(arguments);
        this.currIconCls = this.iconCls || this.defaultIconCls;
        this.statusEl = Ext.create('Ext.toolbar.TextItem', {
            cls: 'x-status-text ' + (this.currIconCls || ''),
            text: this.text || this.defaultText || ''
        });

        if (right) {
            this.cls += ' x-status-right';
            this.add('->');
            this.add(this.statusEl);
        } else {
            this.insert(0, this.statusEl);
            this.insert(1, '->');
        }
    },

    /**
     * Sets the status {@link #text} and/or {@link #iconCls}. Also supports automatically clearing the
     * status that was set after a specified interval.
     *
     * Example usage:
     *
     *     // Simple call to update the text
     *     statusBar.setStatus('New status');
     *
     *     // Set the status and icon, auto-clearing with default options:
     *     statusBar.setStatus({
     *         text: 'New status',
     *         iconCls: 'x-status-custom',
     *         clear: true
     *     });
     *
     *     // Auto-clear with custom options:
     *     statusBar.setStatus({
     *         text: 'New status',
     *         iconCls: 'x-status-custom',
     *         clear: {
     *             wait: 8000,
     *             anim: false,
     *             useDefaults: false
     *         }
     *     });
     *
     * @param {Object/String} config A config object specifying what status to set, or a string assumed
     * to be the status text (and all other options are defaulted as explained below). A config
     * object containing any or all of the following properties can be passed:
     *
     * @param {String} config.text The status text to display.  If not specified, any current
     * status text will remain unchanged.
     *
     * @param {String} config.iconCls The CSS class used to customize the status icon (see
     * {@link #iconCls} for details). If not specified, any current iconCls will remain unchanged.
     *
     * @param {Boolean/Number/Object} config.clear Allows you to set an internal callback that will
     * automatically clear the status text and iconCls after a specified amount of time has passed. If clear is not
     * specified, the new status will not be auto-cleared and will stay until updated again or cleared using
     * {@link #clearStatus}. If `true` is passed, the status will be cleared using {@link #autoClear},
     * {@link #defaultText} and {@link #defaultIconCls} via a fade out animation. If a numeric value is passed,
     * it will be used as the callback interval (in milliseconds), overriding the {@link #autoClear} value.
     * All other options will be defaulted as with the boolean option.  To customize any other options,
     * you can pass an object in the format:
     * 
     * @param {Number} config.clear.wait The number of milliseconds to wait before clearing
     * (defaults to {@link #autoClear}).
     * @param {Boolean} config.clear.anim False to clear the status immediately once the callback
     * executes (defaults to true which fades the status out).
     * @param {Boolean} config.clear.useDefaults False to completely clear the status text and iconCls
     * (defaults to true which uses {@link #defaultText} and {@link #defaultIconCls}).
     *
     * @return {Ext.ux.statusbar.StatusBar} this
     */
    setStatus : function(o) {
        var me = this;

        o = o || {};
        Ext.suspendLayouts();
        if (Ext.isString(o)) {
            o = {text:o};
        }
        if (o.text !== undefined) {
            me.setText(o.text);
        }
        if (o.iconCls !== undefined) {
            me.setIcon(o.iconCls);
        }

        if (o.clear) {
            var c = o.clear,
                wait = me.autoClear,
                defaults = {useDefaults: true, anim: true};

            if (Ext.isObject(c)) {
                c = Ext.applyIf(c, defaults);
                if (c.wait) {
                    wait = c.wait;
                }
            } else if (Ext.isNumber(c)) {
                wait = c;
                c = defaults;
            } else if (Ext.isBoolean(c)) {
                c = defaults;
            }

            c.threadId = this.activeThreadId;
            Ext.defer(me.clearStatus, wait, me, [c]);
        }
        Ext.resumeLayouts(true);
        return me;
    },

    /**
     * Clears the status {@link #text} and {@link #iconCls}. Also supports clearing via an optional fade out animation.
     *
     * @param {Object} [config] A config object containing any or all of the following properties.  If this
     * object is not specified the status will be cleared using the defaults below:
     * @param {Boolean} config.anim True to clear the status by fading out the status element (defaults
     * to false which clears immediately).
     * @param {Boolean} config.useDefaults True to reset the text and icon using {@link #defaultText} and
     * {@link #defaultIconCls} (defaults to false which sets the text to '' and removes any existing icon class).
     *
     * @return {Ext.ux.statusbar.StatusBar} this
     */
    clearStatus : function(o) {
        o = o || {};

        var me = this,
            statusEl = me.statusEl;

        if (o.threadId && o.threadId !== me.activeThreadId) {
            // this means the current call was made internally, but a newer
            // thread has set a message since this call was deferred.  Since
            // we don't want to overwrite a newer message just ignore.
            return me;
        }

        var text = o.useDefaults ? me.defaultText : me.emptyText,
            iconCls = o.useDefaults ? (me.defaultIconCls ? me.defaultIconCls : '') : '';

        if (o.anim) {
            // animate the statusEl Ext.Element
            statusEl.el.puff({
                remove: false,
                useDisplay: true,
                callback: function() {
                    statusEl.el.show();
                    me.setStatus({
                        text: text,
                        iconCls: iconCls
                    });
                }
            });
        } else {
             me.setStatus({
                 text: text,
                 iconCls: iconCls
             });
        }
        return me;
    },

    /**
     * Convenience method for setting the status text directly.  For more flexible options see {@link #setStatus}.
     * @param {String} text (optional) The text to set (defaults to '')
     * @return {Ext.ux.statusbar.StatusBar} this
     */
    setText : function(text) {
        var me = this;
        me.activeThreadId++;
        me.text = text || '';
        if (me.rendered) {
            me.statusEl.setText(me.text);
        }
        return me;
    },

    /**
     * Returns the current status text.
     * @return {String} The status text
     */
    getText : function(){
        return this.text;
    },

    /**
     * Convenience method for setting the status icon directly.  For more flexible options see {@link #setStatus}.
     * See {@link #iconCls} for complete details about customizing the icon.
     * @param {String} iconCls (optional) The icon class to set (defaults to '', and any current icon class is removed)
     * @return {Ext.ux.statusbar.StatusBar} this
     */
    setIcon : function(cls) {
        var me = this;

        me.activeThreadId++;
        cls = cls || '';

        if (me.rendered) {
            if (me.currIconCls) {
                me.statusEl.removeCls(me.currIconCls);
                me.currIconCls = null;
            }
            if (cls.length > 0) {
                me.statusEl.addCls(cls);
                me.currIconCls = cls;
            }
        } else {
            me.currIconCls = cls;
        }
        return me;
    },

    /**
     * Convenience method for setting the status text and icon to special values that are pre-configured to indicate
     * a "busy" state, usually for loading or processing activities.
     *
     * @param {Object/String} config (optional) A config object in the same format supported by {@link #setStatus}, or a
     * string to use as the status text (in which case all other options for setStatus will be defaulted).  Use the
     * `text` and/or `iconCls` properties on the config to override the default {@link #busyText}
     * and {@link #busyIconCls} settings. If the config argument is not specified, {@link #busyText} and
     * {@link #busyIconCls} will be used in conjunction with all of the default options for {@link #setStatus}.
     * @return {Ext.ux.statusbar.StatusBar} this
     */
    showBusy : function(o){
        if (Ext.isString(o)) {
            o = { text: o };
        }
        o = Ext.applyIf(o || {}, {
            text: this.busyText,
            iconCls: this.busyIconCls
        });
        return this.setStatus(o);
    }
});
/**
 * Base class from Ext.ux.TabReorderer.
 */
Ext.define('Ext.ux.BoxReorderer', {
    mixins: {
        observable: 'Ext.util.Observable'
    },

    /**
     * @cfg {String} itemSelector
     * A {@link Ext.DomQuery DomQuery} selector which identifies the encapsulating elements of child
     * Components which participate in reordering.
     */
    itemSelector: '.x-box-item',

    /**
     * @cfg {Mixed} animate
     * If truthy, child reordering is animated so that moved boxes slide smoothly into position.
     * If this option is numeric, it is used as the animation duration in milliseconds.
     */
    animate: 100,

    constructor: function() {
        this.addEvents(
            /**
             * @event StartDrag
             * Fires when dragging of a child Component begins.
             * @param {Ext.ux.BoxReorderer} this
             * @param {Ext.container.Container} container The owning Container
             * @param {Ext.Component} dragCmp The Component being dragged
             * @param {Number} idx The start index of the Component being dragged.
             */
             'StartDrag',
            /**
             * @event Drag
             * Fires during dragging of a child Component.
             * @param {Ext.ux.BoxReorderer} this
             * @param {Ext.container.Container} container The owning Container
             * @param {Ext.Component} dragCmp The Component being dragged
             * @param {Number} startIdx The index position from which the Component was initially dragged.
             * @param {Number} idx The current closest index to which the Component would drop.
             */
             'Drag',
            /**
             * @event ChangeIndex
             * Fires when dragging of a child Component causes its drop index to change.
             * @param {Ext.ux.BoxReorderer} this
             * @param {Ext.container.Container} container The owning Container
             * @param {Ext.Component} dragCmp The Component being dragged
             * @param {Number} startIdx The index position from which the Component was initially dragged.
             * @param {Number} idx The current closest index to which the Component would drop.
             */
             'ChangeIndex',
            /**
             * @event Drop
             * Fires when a child Component is dropped at a new index position.
             * @param {Ext.ux.BoxReorderer} this
             * @param {Ext.container.Container} container The owning Container
             * @param {Ext.Component} dragCmp The Component being dropped
             * @param {Number} startIdx The index position from which the Component was initially dragged.
             * @param {Number} idx The index at which the Component is being dropped.
             */
             'Drop'
        );
        this.mixins.observable.constructor.apply(this, arguments);
    },

    init: function(container) {
        var me = this;
 
        me.container = container;
 
        // Set our animatePolicy to animate the start position (ie x for HBox, y for VBox)
        me.animatePolicy = {};
        me.animatePolicy[container.getLayout().names.x] = true;
        
        

        // Initialize the DD on first layout, when the innerCt has been created.
        me.container.on({
            scope: me,
            boxready: me.afterFirstLayout,
            beforedestroy: me.onContainerDestroy
        });
    },

    /**
     * @private Clear up on Container destroy
     */
    onContainerDestroy: function() {
        var dd = this.dd;
        if (dd) {
            dd.unreg();
            this.dd = null;
        }
    },

    afterFirstLayout: function() {
        var me = this,
            layout = me.container.getLayout(),
            names = layout.names,
            dd;
            
        // Create a DD instance. Poke the handlers in.
        // TODO: Ext5's DD classes should apply config to themselves.
        // TODO: Ext5's DD classes should not use init internally because it collides with use as a plugin
        // TODO: Ext5's DD classes should be Observable.
        // TODO: When all the above are trus, this plugin should extend the DD class.
        dd = me.dd = Ext.create('Ext.dd.DD', layout.innerCt, me.container.id + '-reorderer');
        Ext.apply(dd, {
            animate: me.animate,
            reorderer: me,
            container: me.container,
            getDragCmp: this.getDragCmp,
            clickValidator: Ext.Function.createInterceptor(dd.clickValidator, me.clickValidator, me, false),
            onMouseDown: me.onMouseDown,
            startDrag: me.startDrag,
            onDrag: me.onDrag,
            endDrag: me.endDrag,
            getNewIndex: me.getNewIndex,
            doSwap: me.doSwap,
            findReorderable: me.findReorderable
        });

        // Decide which dimension we are measuring, and which measurement metric defines
        // the *start* of the box depending upon orientation.
        dd.dim = names.width;
        dd.startAttr = names.beforeX;
        dd.endAttr = names.afterX;
    },

    getDragCmp: function(e) {
        return this.container.getChildByElement(e.getTarget(this.itemSelector, 10));
    },

    // check if the clicked component is reorderable
    clickValidator: function(e) {
        var cmp = this.getDragCmp(e);

        // If cmp is null, this expression MUST be coerced to boolean so that createInterceptor is able to test it against false
        return !!(cmp && cmp.reorderable !== false);
    },

    onMouseDown: function(e) {
        var me = this,
            container = me.container,
            containerBox,
            cmpEl,
            cmpBox;

        // Ascertain which child Component is being mousedowned
        me.dragCmp = me.getDragCmp(e);
        if (me.dragCmp) {
            cmpEl = me.dragCmp.getEl();
            me.startIndex = me.curIndex = container.items.indexOf(me.dragCmp);

            // Start position of dragged Component
            cmpBox = cmpEl.getBox();

            // Last tracked start position
            me.lastPos = cmpBox[this.startAttr];

            // Calculate constraints depending upon orientation
            // Calculate offset from mouse to dragEl position
            containerBox = container.el.getBox();
            if (me.dim === 'width') {
                me.minX = containerBox.left;
                me.maxX = containerBox.right - cmpBox.width;
                me.minY = me.maxY = cmpBox.top;
                me.deltaX = e.getPageX() - cmpBox.left;
            } else {
                me.minY = containerBox.top;
                me.maxY = containerBox.bottom - cmpBox.height;
                me.minX = me.maxX = cmpBox.left;
                me.deltaY = e.getPageY() - cmpBox.top;
            }
            me.constrainY = me.constrainX = true;
        }
    },

    startDrag: function() {
        var me = this,
            dragCmp = me.dragCmp;
            
        if (dragCmp) {
            // For the entire duration of dragging the *Element*, defeat any positioning and animation of the dragged *Component*
            dragCmp.setPosition = Ext.emptyFn;
            dragCmp.animate = false;

            // Animate the BoxLayout just for the duration of the drag operation.
            if (me.animate) {
                me.container.getLayout().animatePolicy = me.reorderer.animatePolicy;
            }
            // We drag the Component element
            me.dragElId = dragCmp.getEl().id;
            me.reorderer.fireEvent('StartDrag', me, me.container, dragCmp, me.curIndex);
            // Suspend events, and set the disabled flag so that the mousedown and mouseup events
            // that are going to take place do not cause any other UI interaction.
            dragCmp.suspendEvents();
            dragCmp.disabled = true;
            dragCmp.el.setStyle('zIndex', 100);
        } else {
            me.dragElId = null;
        }
    },

    /**
     * @private
     * Find next or previous reorderable component index.
     * @param {Number} newIndex The initial drop index.
     * @return {Number} The index of the reorderable component.
     */
    findReorderable: function(newIndex) {
        var me = this,
            items = me.container.items,
            newItem;

        if (items.getAt(newIndex).reorderable === false) {
            newItem = items.getAt(newIndex);
            if (newIndex > me.startIndex) {
                 while(newItem && newItem.reorderable === false) {
                    newIndex++;
                    newItem = items.getAt(newIndex);
                }
            } else {
                while(newItem && newItem.reorderable === false) {
                    newIndex--;
                    newItem = items.getAt(newIndex);
                }
            }
        }

        newIndex = Math.min(Math.max(newIndex, 0), items.getCount() - 1);

        if (items.getAt(newIndex).reorderable === false) {
            return -1;
        }
        return newIndex;
    },

    /**
     * @private
     * Swap 2 components.
     * @param {Number} newIndex The initial drop index.
     */
    doSwap: function(newIndex) {
        var me = this,
            items = me.container.items,
            container = me.container,
            wasRoot = me.container._isLayoutRoot,
            orig, dest, tmpIndex, temp;

        newIndex = me.findReorderable(newIndex);

        if (newIndex === -1) {
            return;
        }

        me.reorderer.fireEvent('ChangeIndex', me, container, me.dragCmp, me.startIndex, newIndex);
        orig = items.getAt(me.curIndex);
        dest = items.getAt(newIndex);
        items.remove(orig);
        tmpIndex = Math.min(Math.max(newIndex, 0), items.getCount() - 1);
        items.insert(tmpIndex, orig);
        items.remove(dest);
        items.insert(me.curIndex, dest);

        // Make the Box Container the topmost layout participant during the layout.
        container._isLayoutRoot = true;
        container.updateLayout();
        container._isLayoutRoot = wasRoot;
        me.curIndex = newIndex;
    },

    onDrag: function(e) {
        var me = this,
            newIndex;

        newIndex = me.getNewIndex(e.getPoint());
        if ((newIndex !== undefined)) {
            me.reorderer.fireEvent('Drag', me, me.container, me.dragCmp, me.startIndex, me.curIndex);
            me.doSwap(newIndex);
        }

    },

    endDrag: function(e) {
        if (e) {
            e.stopEvent();
        }
        var me = this,
            layout = me.container.getLayout(),
            temp;

        if (me.dragCmp) {
            delete me.dragElId;

            // Reinstate the Component's positioning method after mouseup, and allow the layout system to animate it.
            delete me.dragCmp.setPosition;
            me.dragCmp.animate = true;
            
            // Ensure the lastBox is correct for the animation system to restore to when it creates the "from" animation frame
            me.dragCmp.lastBox[layout.names.x] = me.dragCmp.getPosition(true)[layout.names.widthIndex];

            // Make the Box Container the topmost layout participant during the layout.
            me.container._isLayoutRoot = true;
            me.container.updateLayout();
            me.container._isLayoutRoot = undefined;
            
            // Attempt to hook into the afteranimate event of the drag Component to call the cleanup
            temp = Ext.fx.Manager.getFxQueue(me.dragCmp.el.id)[0];
            if (temp) {
                temp.on({
                    afteranimate: me.reorderer.afterBoxReflow,
                    scope: me
                });
            } 
            // If not animated, clean up after the mouseup has happened so that we don't click the thing being dragged
            else {
                Ext.Function.defer(me.reorderer.afterBoxReflow, 1, me);
            }

            if (me.animate) {
                delete layout.animatePolicy;
            }
            me.reorderer.fireEvent('drop', me, me.container, me.dragCmp, me.startIndex, me.curIndex);
        }
    },

    /**
     * @private
     * Called after the boxes have been reflowed after the drop.
     * Re-enabled the dragged Component.
     */
    afterBoxReflow: function() {
        var me = this;
        me.dragCmp.el.setStyle('zIndex', '');
        me.dragCmp.disabled = false;
        me.dragCmp.resumeEvents();
    },

    /**
     * @private
     * Calculate drop index based upon the dragEl's position.
     */
    getNewIndex: function(pointerPos) {
        var me = this,
            dragEl = me.getDragEl(),
            dragBox = Ext.fly(dragEl).getBox(),
            targetEl,
            targetBox,
            targetMidpoint,
            i = 0,
            it = me.container.items.items,
            ln = it.length,
            lastPos = me.lastPos;

        me.lastPos = dragBox[me.startAttr];

        for (; i < ln; i++) {
            targetEl = it[i].getEl();

            // Only look for a drop point if this found item is an item according to our selector
            if (targetEl.is(me.reorderer.itemSelector)) {
                targetBox = targetEl.getBox();
                targetMidpoint = targetBox[me.startAttr] + (targetBox[me.dim] >> 1);
                if (i < me.curIndex) {
                    if ((dragBox[me.startAttr] < lastPos) && (dragBox[me.startAttr] < (targetMidpoint - 5))) {
                        return i;
                    }
                } else if (i > me.curIndex) {
                    if ((dragBox[me.startAttr] > lastPos) && (dragBox[me.endAttr] > (targetMidpoint + 5))) {
                        return i;
                    }
                }
            }
        }
    }
});
Ext.define('Ext.ux.CheckCombo',
{
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.combocheckbox',
    multiSelect: true,
    allSelector: false,
    noData: false,
    noDataText: 'No combo data',
    addAllSelector: true,
    allSelectorHidden: false,
    enableKeyEvents: true,
    afterExpandCheck: false,
    allText: 'All',
    oldValue: '',
    listeners:
    {
/* uncomment if you want to reload store on every combo expand
        beforequery: function(qe)
        {
            this.store.removeAll();
            delete qe.combo.lastQuery;
        },
*/
        focus: function(cpt)
        {
            cpt.oldValue = cpt.getValue();
        },
        keydown: function(cpt, e, eOpts)
        {
            var    value = cpt.getRawValue(),
                oldValue = cpt.oldValue;
            
            if(value != oldValue) cpt.setValue('');
        }
    },
    createPicker: function() 
    {
        var    me = this,
            picker,
            menuCls = Ext.baseCSSPrefix + 'menu',
            opts = Ext.apply(
            {
                pickerField: me,
                selModel:
                {
                    mode: me.multiSelect ? 'SIMPLE' : 'SINGLE'
                },
                floating: true,
                hidden: true,
                ownerCt: me.ownerCt,
                cls: me.el.up('.' + menuCls) ? menuCls : '',
                store: me.store,
                displayField: me.displayField,
                focusOnToFront: false,
                pageSize: me.pageSize,
                // tpl: 
                // [
                    // '<ul><tpl for=".">',
                        // '<li role="option" class="' + Ext.baseCSSPrefix + 'boundlist-item"><span class="x-combo-checker">&nbsp;</span> {' + me.displayField + '}</li>',
                    // '</tpl></ul>'
                // ]
				tpl: [
				 '<tpl for=".">',
					'<div class="x-boundlist-item" ><span class="x-combo-checker">&nbsp;</span> {' + me.displayField + '}</div>',
				  '</tpl>'
				]  
            }, me.listConfig, me.defaultListConfig);


        picker = me.picker = Ext.create('Ext.view.BoundList', opts);
        if(me.pageSize) 
        {
            picker.pagingToolbar.on('beforechange', me.onPageChange, me);
        }        


        me.mon(picker,
        {
            itemclick: me.onItemClick,
            refresh: me.onListRefresh,
            scope: me
        });


        me.mon(picker.getSelectionModel(),
        {
            'beforeselect': me.onBeforeSelect,
            'beforedeselect': me.onBeforeDeselect,
            'selectionchange': me.onListSelectionChange,
            scope: me
        });


        me.store.on('load', function(store)
        {
            if(store.getTotalCount() == 0)
            {
                me.allSelectorHidden = true;
                if(me.allSelector != false) me.allSelector.setStyle('display', 'none');
                if(me.noData != false) me.noData.setStyle('display', 'block');
            }
            else
            {
                me.allSelectorHidden = false;
                if(me.allSelector != false) me.allSelector.setStyle('display', 'block');
                if(me.noData != false) me.noData.setStyle('display', 'none');
            }
        });


        return picker;
    },
    reset: function()
    {
        var    me = this;


        me.setValue('');
    },
    setValue: function(value)
    {
        this.value = value;
        if(!value)
        {
            if(this.allSelector != false) this.allSelector.removeCls('x-boundlist-selected');
            return this.callParent(arguments);
        }


        if(typeof value == 'string') 
        {
            var    me = this,
                records = [],
                vals = value.split(',');


            if(value == '')
            {
                if(me.allSelector != false) me.allSelector.removeCls('x-boundlist-selected');
            }
            else
            {
                if(vals.length == me.store.getCount() && vals.length != 0)
                {
                    if(me.allSelector != false) me.allSelector.addCls('x-boundlist-selected');
                    else me.afterExpandCheck = true;
                }
            }


            Ext.each(vals, function(val)
            {
                var record = me.store.getById(parseInt(val));
                if(record) records.push(record);
            });


            return me.setValue(records);
        }
        else return this.callParent(arguments);
    },
    getValue: function()
    {
        if(typeof this.value == 'object') return this.value.join(',');
        else return this.value;
    },
    getSubmitValue: function()
    {
        return this.getValue();
    },
    expand: function()
    {
        var    me = this,
            bodyEl, picker, collapseIf;


            if(me.rendered && !me.isExpanded && !me.isDestroyed)
            {
            bodyEl = me.bodyEl;
            picker = me.getPicker();
            collapseIf = me.collapseIf;


            // show the picker and set isExpanded flag
            picker.show();
            me.isExpanded = true;
            me.alignPicker();
            bodyEl.addCls(me.openCls);


            if(me.noData == false) me.noData = picker.getEl().down('.x-boundlist-list-ct').insertHtml('beforeBegin', '<div class="x-boundlist-item" role="option">'+me.noDataText+'</div>', true);


            if(me.addAllSelector == true && me.allSelector == false)
            {
                me.allSelector = picker.getEl().down('.x-boundlist-list-ct').insertHtml('beforeBegin', '<div class="x-boundlist-item" role="option"><span class="x-combo-checker">&nbsp;</span> '+me.allText+'</div>', true);
                me.allSelector.on('click', function(e)
                {
                    if(me.allSelector.hasCls('x-boundlist-selected'))
                    {
                        me.allSelector.removeCls('x-boundlist-selected');
                        me.setValue('');
                        me.fireEvent('select', me, []);
                    }
                    else
                    {
                        var records = [];
                        me.store.each(function(record)
                        {
                            records.push(record);
                        });
                        me.allSelector.addCls('x-boundlist-selected');
                        me.select(records);
                        me.fireEvent('select', me, records); 
                    }
                });


                if(me.allSelectorHidden == true) me.allSelector.hide();
                else me.allSelector.show();
                
                if(me.afterExpandCheck == true)
                {
                    me.allSelector.addCls('x-boundlist-selected');
                    me.afterExpandCheck = false;
                }
            }


            // monitor clicking and mousewheel
            me.mon(Ext.getDoc(),
            {
                mousewheel: collapseIf,
                mousedown: collapseIf,
                scope: me
            });
            Ext.EventManager.onWindowResize(me.alignPicker, me);
            me.fireEvent('expand', me);
            me.onExpand();
        }
        else
        {
            me.fireEvent('expand', me);
            me.onExpand();
        }
    },
    alignPicker: function()
    {    
        var me = this,
            picker = me.getPicker();


        me.callParent();
    
        if(me.addAllSelector == true)
        {
            var height = picker.getHeight();
            height = parseInt(height)+20;
            picker.setHeight(height);
            picker.getEl().setStyle('height', height+'px');
        }
    },
    onListSelectionChange: function(list, selectedRecords)
    {
        var    me = this,
            isMulti = me.multiSelect,
            hasRecords = selectedRecords.length > 0;
        // Only react to selection if it is not called from setValue, and if our list is
        // expanded (ignores changes to the selection model triggered elsewhere)
        if(!me.ignoreSelection && me.isExpanded)
        {
            if(!isMulti)
            {
                Ext.defer(me.collapse, 1, me);
            }
            /*
            * Only set the value here if we're in multi selection mode or we have
            * a selection. Otherwise setValue will be called with an empty value
            * which will cause the change event to fire twice.
            */
            if(isMulti || hasRecords)
            {
                me.setValue(selectedRecords, false);
            }
            if(hasRecords)
            {
                me.fireEvent('select', me, selectedRecords);
            }
            me.inputEl.focus();


            if(me.addAllSelector == true && me.allSelector != false)
            {
                if(selectedRecords.length == me.store.getTotalCount()) me.allSelector.addCls('x-boundlist-selected');
                else me.allSelector.removeCls('x-boundlist-selected'); 
            } 
        }
    }
});/**
 * @class Ext.ux.DataTip
 * @extends Ext.ToolTip.
 * This plugin implements automatic tooltip generation for an arbitrary number of child nodes *within* a Component.
 *
 * This plugin is applied to a high level Component, which contains repeating elements, and depending on the host Component type,
 * it automatically selects a {@link Ext.ToolTip#delegate delegate} so that it appears when the mouse enters a sub-element.
 *
 * When applied to a GridPanel, this ToolTip appears when over a row, and the Record's data is applied
 * using this object's {@link #tpl} template.
 *
 * When applied to a DataView, this ToolTip appears when over a view node, and the Record's data is applied
 * using this object's {@link #tpl} template.
 *
 * When applied to a TreePanel, this ToolTip appears when over a tree node, and the Node's {@link Ext.data.Model} record data is applied
 * using this object's {@link #tpl} template.
 *
 * When applied to a FormPanel, this ToolTip appears when over a Field, and the Field's `tooltip` property is used is applied
 * using this object's {@link #tpl} template, or if it is a string, used as HTML content. If there is no `tooltip` property,
 * the field itself is used as the template's data object.
 *
 * If more complex logic is needed to determine content, then the {@link #beforeshow} event may be used.
 * This class also publishes a **`beforeshowtip`** event through its host Component. The *host Component* fires the
 * **`beforeshowtip`** event.
 */
Ext.define('Ext.ux.DataTip', function(DataTip) {

//  Target the body (if the host is a Panel), or, if there is no body, the main Element.
    function onHostRender() {
        var e = this.isXType('panel') ? this.body : this.el;
        if (this.dataTip.renderToTarget) {
            this.dataTip.render(e);
        }
        this.dataTip.setTarget(e);
    }

    function updateTip(tip, data) {
        if (tip.rendered) {
            if (tip.host.fireEvent('beforeshowtip', tip.eventHost, tip, data) === false) {
                return false;
            }
            tip.update(data);
        } else {
            if (Ext.isString(data)) {
                tip.html = data;
            } else {
                tip.data = data;
            }
        }
    }

    function beforeViewTipShow(tip) {
        var rec = this.view.getRecord(tip.triggerElement),
            data;

        if (rec) {
            data = tip.initialConfig.data ? Ext.apply(tip.initialConfig.data, rec.data) : rec.data;
            return updateTip(tip, data);
        } else {
            return false;
        }
    }

    function beforeFormTipShow(tip) {
        var field = Ext.getCmp(tip.triggerElement.id);
        if (field && (field.tooltip || tip.tpl)) {
            return updateTip(tip, field.tooltip || field);
        } else {
            return false;
        }
    }

    return {
        extend: 'Ext.tip.ToolTip',

        mixins: {
            plugin: 'Ext.AbstractPlugin'
        },

        alias: 'plugin.datatip',

        lockableScope: 'both',

        constructor: function(config) {
            var me = this;
            me.callParent([config]);
            me.mixins.plugin.constructor.call(me, config);
        },

        init: function(host) {
            var me = this;

            me.mixins.plugin.init.call(me, host);
            host.dataTip = me;
            me.host = host;

            if (host.isXType('tablepanel')) {
                me.view = host.getView();
                if (host.ownerLockable) {
                    me.host = host.ownerLockable;
                }
                me.delegate = me.delegate || me.view.getDataRowSelector();
                me.on('beforeshow', beforeViewTipShow);
            } else if (host.isXType('dataview')) {
                me.view = me.host;
                me.delegate = me.delegate || host.itemSelector;
                me.on('beforeshow', beforeViewTipShow);
            } else if (host.isXType('form')) {
                me.delegate = '.' + Ext.form.Labelable.prototype.formItemCls;
                me.on('beforeshow', beforeFormTipShow);
            } else if (host.isXType('combobox')) {
                me.view = host.getPicker();
                me.delegate = me.delegate || me.view.getItemSelector();
                me.on('beforeshow', beforeViewTipShow);
            }
            if (host.rendered) {
                onHostRender.call(host);
            } else {
                host.onRender = Ext.Function.createSequence(host.onRender, onHostRender);
            }
        }
    };
});/**
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
});/**
 * A GridPanel class with live search support.
 * @author Nicolas Ferrero
 * @editor Agus Sugianto
 */
Ext.define('Ext.ux.LiveSearchGridPanel', {
    extend: 'Ext.grid.Panel',
    requires: [
        'Ext.toolbar.TextItem',
        'Ext.form.field.Checkbox',
        'Ext.form.field.Text',
        'Ext.ux.statusbar.StatusBar'
    ],
    
    /**
     * @private
     * search value initialization
     */
    searchValue: null,
    
    /**
     * @private
     * The row indexes where matching strings are found. (used by previous and next buttons)
     */
    indexes: [],
    
    /**
     * @private
     * The row index of the first search, it could change if next or previous buttons are used.
     */
    currentIndex: null,
    
    /**
     * @private
     * The generated regular expression used for searching.
     */
    searchRegExp: null,
    
    /**
     * @private
     * Case sensitive mode.
     */
    caseSensitive: false,
    
    /**
     * @private
     * Regular expression mode.
     */
    regExpMode: false,
    
    /**
     * @cfg {String} matchCls
     * The matched string css classe.
     */
    matchCls: 'x-livesearch-match',
    
    defaultStatusText: 'Nothing Found',
    
    // Component initialization override: adds the top and bottom toolbars and setup headers renderer.
    initComponent: function() {
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

        me.bbar = Ext.create('Ext.ux.StatusBar', {
            defaultText: me.defaultStatusText,
            name: 'searchStatusBar'
        });
        
        me.callParent(arguments);
    },
    
    // afterRender override: it adds textfield and statusbar reference and start monitoring keydown events in textfield input 
    afterRender: function() {
        var me = this;
        me.callParent(arguments);
        me.textField = me.down('textfield[name=searchField]');
        me.statusBar = me.down('statusbar[name=searchStatusBar]');
    },
    // detects html tag
    tagsRe: /<[^>]*>/gm,
    
    // DEL ASCII code
    tagsProtect: '\x0f',
    
    // detects regexp reserved word
    regExpProtect: /\\|\/|\+|\\|\.|\[|\]|\{|\}|\?|\$|\*|\^|\|/gm,
    
    /**
     * In normal mode it returns the value with protected regexp characters.
     * In regular expression mode it returns the raw value except if the regexp is invalid.
     * @return {String} The value to process or null if the textfield value is blank or invalid.
     * @private
     */
    getSearchValue: function() {
        var me = this,
            value = me.textField.getValue();
            
        if (value === '') {
            return null;
        }
        if (!me.regExpMode) {
            value = value.replace(me.regExpProtect, function(m) {
                return '\\' + m;
            });
        } else {
            try {
                new RegExp(value);
            } catch (error) {
                me.statusBar.setStatus({
                    text: error.message,
                    iconCls: 'x-status-error'
                });
                return null;
            }
            // this is stupid
            if (value === '^' || value === '$') {
                return null;
            }
        }

        return value;
    },
    
    /**
     * Finds all strings that matches the searched value in each grid cells.
     * @private
     */
     onTextFieldChange: function() {
         var me = this,
             count = 0;

         me.view.refresh();
         // reset the statusbar
         me.statusBar.setStatus({
             text: me.defaultStatusText,
             iconCls: ''
         });

         me.searchValue = me.getSearchValue();
         me.indexes = [];
         me.currentIndex = null;

         if (me.searchValue !== null) {
             me.searchRegExp = new RegExp(me.searchValue, 'g' + (me.caseSensitive ? '' : 'i'));
             
             
             me.store.each(function(record, idx) {
                 var td = Ext.fly(me.view.getNode(idx)).down('td'),
                     cell, matches, cellHTML;
                 while(td) {
                     cell = td.down('.x-grid-cell-inner');
                     matches = cell.dom.innerHTML.match(me.tagsRe);
                     cellHTML = cell.dom.innerHTML.replace(me.tagsRe, me.tagsProtect);
                     
                     // populate indexes array, set currentIndex, and replace wrap matched string in a span
                     cellHTML = cellHTML.replace(me.searchRegExp, function(m) {
                        count += 1;
                        if (Ext.Array.indexOf(me.indexes, idx) === -1) {
                            me.indexes.push(idx);
                        }
                        if (me.currentIndex === null) {
                            me.currentIndex = idx;
                        }
                        return '<span class="' + me.matchCls + '">' + m + '</span>';
                     });
                     // restore protected tags
                     Ext.each(matches, function(match) {
                        cellHTML = cellHTML.replace(me.tagsProtect, match); 
                     });
                     // update cell html
                     cell.dom.innerHTML = cellHTML;
                     td = td.next();
                 }
             }, me);

             // results found
             if (me.currentIndex !== null) {
                 me.getSelectionModel().select(me.currentIndex);
                 me.statusBar.setStatus({
                     text: count + ' matche(s) found.',
                     iconCls: 'x-status-valid'
                 });
             }
         }

         // no results found
         if (me.currentIndex === null) {
             me.getSelectionModel().deselectAll();
         }

         // force textfield focus
         me.textField.focus();
     },
    
    /**
     * Selects the previous row containing a match.
     * @private
     */   
    onPreviousClick: function() {
        var me = this,
            idx;
            
        if ((idx = Ext.Array.indexOf(me.indexes, me.currentIndex)) !== -1) {
            me.currentIndex = me.indexes[idx - 1] || me.indexes[me.indexes.length - 1];
            me.getSelectionModel().select(me.currentIndex);
         }
    },
    
    /**
     * Selects the next row containing a match.
     * @private
     */    
    onNextClick: function() {
         var me = this,
             idx;
             
         if ((idx = Ext.Array.indexOf(me.indexes, me.currentIndex)) !== -1) {
            me.currentIndex = me.indexes[idx + 1] || me.indexes[0];
            me.getSelectionModel().select(me.currentIndex);
         }
    },
    
    /**
     * Switch to case sensitive mode.
     * @private
     */    
    caseSensitiveToggle: function(checkbox, checked) {
        this.caseSensitive = checked;
        this.onTextFieldChange();
    },
    
    /**
     * Switch to regular expression mode
     * @private
     */
    regExpToggle: function(checkbox, checked) {
        this.regExpMode = checked;
        this.onTextFieldChange();
    }
});/**
 * @class Ext.ux.grid.HeaderToolTip
 * @namespace Ext.ux.grid
 *
 *  Text tooltips should be stored in the grid column definition
 *  
 *  Sencha forum url: 
 *  http://www.sencha.com/forum/showthread.php?132637-Ext.ux.grid.HeaderToolTip
 */
Ext.define('Ext.ux.grid.HeaderToolTip', {
    alias: 'plugin.headertooltip',
    init : function(grid) {
        var headerCt = grid.headerCt;
        grid.headerCt.on("afterrender", function(g) {
            grid.tip = Ext.create('Ext.tip.ToolTip', {
                target: headerCt.el,
                delegate: ".x-column-header",
                trackMouse: true,
                renderTo: Ext.getBody(),
                listeners: {
                    beforeshow: function(tip) {
                        var c = headerCt.down('gridcolumn[id=' + tip.triggerElement.id  +']');
                        if (c  && c.tooltip)
                            tip.update(c.tooltip);
                        else
                            return false;
                    }
                }
            });
        });
    }
});/**
 * Plugin for displaying a progressbar inside of a paging toolbar
 * instead of plain text.
 */
Ext.define('Ext.ux.ProgressBarPager', {

    requires: ['Ext.ProgressBar'],
    /**
     * @cfg {Number} width
     * <p>The default progress bar width.  Default is 225.</p>
    */
    width   : 225,
    /**
     * @cfg {String} defaultText
    * <p>The text to display while the store is loading.  Default is 'Loading...'</p>
     */
    defaultText    : 'Loading...',
    /**
     * @cfg {Object} defaultAnimCfg
     * <p>A {@link Ext.fx.Anim Ext.fx.Anim} configuration object.</p>
     */
    defaultAnimCfg : {
		duration: 1000,
		easing: 'bounceOut'	
	},	

    /**
     * Creates new ProgressBarPager.
     * @param {Object} config Configuration options
     */
    constructor : function(config) {
        if (config) {
            Ext.apply(this, config);
        }
    },
    //public
    init : function (parent) {
        var displayItem;
        if (parent.displayInfo) {
            this.parent = parent;

            displayItem = parent.child("#displayItem");
            if (displayItem) {
                parent.remove(displayItem, true);
            }

            this.progressBar = Ext.create('Ext.ProgressBar', {
                text    : this.defaultText,
                width   : this.width,
                animate : this.defaultAnimCfg,
                style: {
                    cursor: 'pointer'
                },
                listeners: {
                    el: {
                        scope: this,
                        click: this.handleProgressBarClick
                    }
                }
            });

            parent.displayItem = this.progressBar;

            parent.add(parent.displayItem);
            Ext.apply(parent, this.parentOverrides);
        }
    },
    // private
    // This method handles the click for the progress bar
    handleProgressBarClick : function(e){
        var parent = this.parent,
            displayItem = parent.displayItem,
            box = this.progressBar.getBox(),
            xy = e.getXY(),
            position = xy[0]- box.x,
            pages = Math.ceil(parent.store.getTotalCount() / parent.pageSize),
            newPage = Math.max(Math.ceil(position / (displayItem.width / pages)), 1);

        parent.store.loadPage(newPage);
    },

    // private, overriddes
    parentOverrides  : {
        // private
        // This method updates the information via the progress bar.
        updateInfo : function(){
            if(this.displayItem){
                var count = this.store.getCount(),
                    pageData = this.getPageData(),
                    message = count === 0 ?
                    this.emptyMsg :
                    Ext.String.format(
                        this.displayMsg,
                        pageData.fromRecord, pageData.toRecord, this.store.getTotalCount()
                    ),
                    percentage = pageData.pageCount > 0 ? (pageData.currentPage / pageData.pageCount) : 0;

                this.displayItem.updateProgress(percentage, message, this.animate || this.defaultAnimConfig);
            }
        }
    }
});

/*
Tree combo
Use with 'Ext.data.TreeStore'


If store root note has 'checked' property tree combo becomes multiselect combo (tree store must have records with 'checked' property)


Has event 'itemclick' that can be used to capture click


Options:
selectChildren - if set true and if store isn't multiselect, clicking on an non-leaf node selects all it's children
canSelectFolders - if set true and store isn't multiselect clicking on a folder selects that folder also as a value


Use:


single leaf node selector:
selectChildren: false
canSelectFolders: false
- this will select only leaf nodes and will not allow selecting non-leaf nodes


single node selector (can select leaf and non-leaf nodes)
selectChildren: false
canSelectFolders: true
- this will select single value either leaf or non-leaf


children selector:
selectChildren: true
canSelectFolders: true
- clicking on a node will select it's children and node, clicking on a leaf node will select only that node


This config:
selectChildren: true
canSelectFolders: false
- is invalid, you cannot select children without node


*/
Ext.define('Ext.ux.TreeCombo',
{
	extend: 'Ext.form.field.Picker',
	alias: 'widget.treecombo',
	tree: false,
	constructor: function(config)
	{
		this.addEvents(
		{
			"itemclick" : true
		});


		this.listeners = config.listeners;
		this.callParent(arguments);
	},
	records: [],
	recursiveRecords: [],
	ids: [],
	selectChildren: true,
	canSelectFolders: true,
	multiselect: false,
	displayField: 'text',
	valueField: 'id',
	treeWidth: 300,
	matchFieldWidth: false,
	treeHeight: 400,
	masN: 0,
	recursivePush: function(node, setIds)
	{
		var	me = this;

		me.addRecRecord(node);
		if(setIds) me.addIds(node);

		node.eachChild(function(nodesingle)
		{
			if(nodesingle.hasChildNodes() == true)
			{
				me.recursivePush(nodesingle, setIds);
			}
			else
			{
				me.addRecRecord(nodesingle);
				if(setIds) me.addIds(nodesingle);
			}
		});
	},
	recursiveUnPush: function(node)
	{
		var	me = this;
		me.removeIds(node);

		node.eachChild(function(nodesingle)
		{
			if(nodesingle.hasChildNodes() == true)
			{
				me.recursiveUnPush(nodesingle);
			}
			else me.removeIds(nodesingle);
		});
	},
	addRecRecord: function(record)
	{
		var	me = this;

		for(var i=0,j=me.recursiveRecords.length;i<j;i++)
		{
			var item = me.recursiveRecords[i];
			if(item)
			{
				if(item.getId() == record.getId()) return;
			}
		}
		me.recursiveRecords.push(record);
	},
	afterLoadSetValue: false,
	setValue: function(valueInit)
	{
		if(typeof valueInit == 'undefined') return;

		var	me = this,
			tree = this.tree,
			values = [],
			valueFin = [];

		if (me.multiselect == true) {
			values = (valueInit == '') ? [] : valueInit.split(',');
		} else {
			values.push ('' +valueInit);
		}

		inputEl = me.inputEl;

		if(tree.store.isLoading())
		{
			me.afterLoadSetValue = valueInit;
		}

		if(inputEl && me.emptyText && !Ext.isEmpty(values))
		{
			inputEl.removeCls(me.emptyCls);
		}

		if(tree == false) return false;

		var node = tree.getRootNode();
		if(node == null) return false;

		me.recursiveRecords = [];
		me.recursivePush(node, false);

		me.records = [];
		Ext.each(me.recursiveRecords, function(record)
		{
			var	id = record.get(me.valueField),
				index = values.indexOf(''+id);

			if(me.multiselect == true) record.set('checked', false);

			if(index != -1)
			{
				valueFin.push(record.get(me.displayField));
				if(me.multiselect == true) record.set('checked', true);
				me.addRecord(record);
			}
		});


		me.value = valueInit;
		me.setRawValue(valueFin.join(', '));

		me.checkChange();
		me.applyEmptyText();
		return me;
	},
	getValue: function()
	{
		return this.value;
	},
	getSubmitValue: function()
	{
		return this.value;
	},
	checkParentNodes: function(node)
	{
		if(node == null) return;

		var	me = this,
			checkedAll = true;


		node.eachChild(function(nodesingle)
		{
			var	id = nodesingle.getId(),
				index = me.ids.indexOf(''+id);

			if(index == -1) checkedAll = false;
		});

		if(checkedAll == true)
		{
			me.addIds(node);
			me.checkParentNodes(node.parentNode);
		}
		else
		{
			me.removeIds(node);
			me.checkParentNodes(node.parentNode);
		}
	},
	initComponent: function()
	{
		var	me = this;

		me.tree = Ext.create('Ext.tree.Panel',
		{
			alias: 'widget.assetstree',
			hidden: true,
			minHeight: 300,
			rootVisible: (typeof me.rootVisible != 'undefined') ? me.rootVisible : true,
			floating: true,
			useArrows: true,
			width: me.treeWidth,
			autoScroll: true,
			height: me.treeHeight,
			store: me.store,
			listeners:
			{
				load: function(store, records)
				{
					if(me.afterLoadSetValue != false)
					{
						me.setValue(me.afterLoadSetValue);
					}
				},
				itemclick:  function(view, record, item, index, e, eOpts)
				{
					me.itemTreeClick(view, record, item, index, e, eOpts, me)
				}
			}
		});

		if(me.tree.getRootNode().get('checked') != null) me.multiselect = true;

		this.createPicker = function()
		{
			var	me = this;
			return me.tree;
		};

		this.callParent(arguments);
	},
	addIds: function(record)
	{
		var	me = this;

		if(me.ids.indexOf(''+record.getId()) == -1) me.ids.push(''+record.get(me.valueField));
	},
	removeIds: function(record)
	{
		var	me = this,
			index = me.ids.indexOf(''+record.getId());

		if(index != -1)
		{
			me.ids.splice(index, 1);
		}
	},
	addRecord: function(record)
	{
		var	me = this;

		for(var i=0,j=me.records.length;i<j;i++)
		{
			var item = me.records[i];
			if(item)
			{
				if(item.getId() == record.getId()) return;
			}
		}
		me.records.push(record);
	},
	removeRecord: function(record)
	{
		var	me = this;

		for(var i=0,j=me.records.length;i<j;i++)
		{
			var item = me.records[i];
			if(item && item.getId() == record.getId()) delete(me.records[i]);
		}
	},
	itemTreeClick: function(view, record, item, index, e, eOpts, treeCombo)
	{
		var	me = treeCombo,
			checked = !record.get('checked');//it is still not checked if will be checked in this event

		if(me.multiselect == true) record.set('checked', checked);//check record

		var node = me.tree.getRootNode().findChild(me.valueField, record.get(me.valueField), true);
		if(node == null)
		{
			if(me.tree.getRootNode().get(me.valueField) == record.get(me.valueField)) node = me.tree.getRootNode();
			else return false;
		}

		if(me.multiselect == false) me.ids = [];

		//if it can't select folders and it is a folder check existing values and return false
		if(me.canSelectFolders == false && record.get('leaf') == false)
		{
			me.setRecordsValue(view, record, item, index, e, eOpts, treeCombo);
			return false;
		}

		//if record is leaf
		if(record.get('leaf') == true)
		{
			if(checked == true)
			{
				me.addIds(record);
			}
			else
			{
				me.removeIds(record);
			}
		}
		else //it's a directory
		{
			me.recursiveRecords = [];
			if(checked == true)
			{
				if(me.multiselect == false)
				{
					if(me.canSelectFolders == true) me.addIds(record);
				}
				else
				{
					if(me.canSelectFolders == true)
					{
						me.recursivePush(node, true);
					}
				}
			}
			else
			{
				if(me.multiselect == false)
				{
					if(me.canSelectFolders == true) me.recursiveUnPush(node);
					else me.removeIds(record);
				}
				else me.recursiveUnPush(node);
			}
		}

		//this will check every parent node that has his all children selected
		if(me.canSelectFolders == true && me.multiselect == true) me.checkParentNodes(node.parentNode);

		me.setRecordsValue(view, record, item, index, e, eOpts, treeCombo);
	},
	fixIds: function()
	{
		var me = this;

		for(var i=0,j=me.ids.length;i<j;i++)
		{
			if(me.ids[i] == 'NaN') me.ids.splice(i, 1);
		}
	},
	setRecordsValue: function(view, record, item, index, e, eOpts, treeCombo)
	{
		var	me = treeCombo;

		me.fixIds();

		me.setValue(me.ids.join(','));

		me.fireEvent('itemclick', me, record, item, index, e, eOpts, me.records, me.ids);

		if(me.multiselect == false) me.onTriggerClick();
	}
});
