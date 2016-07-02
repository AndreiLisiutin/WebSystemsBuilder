Ext.define('WebSystemsBuilder.utils.controlTypes.ToolbarFactory', {
    extend: 'WebSystemsBuilder.utils.controlTypes.BaseComponentFactory',
    alternateClassName: ['ToolbarFactory'],

    isDocked: true,

    createComponent: function () {
        return Ext.create('Ext.toolbar.Toolbar', {
            xtype: 'toolbar',
            padding: 2,
            width: 50,
            minWidth: 20,
            minHeight: 20,
            resizable: true,
            isComponent: true,
            dock: 'right'
        });
    },

    //----------------------------------FORM GENERATOR------------------------------------------------------------------

    getSelfArrayName:function(properties) {
        return 'dockedItems';
    },
    //----------------------------------EVENTS--------------------------------------------------------------------------
    bindLoad: function (handler) {
        this._visualComponent.on('afterrender', handler);
    },
    bindClick: function (handler) {
        this._visualComponent.on('click', handler);
    },
    //----------------------------------CLIENT ACTIONS------------------------------------------------------------------
    executeEnable: function (handler) {
        this._visualComponent.enable();
    },
    executeDisable: function (handler) {
        this._visualComponent.disable();
    },
});