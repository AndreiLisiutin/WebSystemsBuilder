Ext.define('WebSystemsBuilder.utils.controlTypes.TabPanelFactory', {
    extend: 'WebSystemsBuilder.utils.controlTypes.BaseComponentFactory',
    alternateClassName: ['TabPanelFactory'],

    createComponent: function () {
        return Ext.create('Ext.tab.Panel', {
            xtype: 'tabpanel',
            activeTab: 0,
            width: 300,
            height: 200,
            minWidth: 200,
            minHeight: 200,
            resizable: true,
            closable: false,
            collapsible: true,
            title: 'Моя панель с закладками'
        });
    },

    //----------------------------------FORM GENERATOR------------------------------------------------------------------

    //----------------------------------EVENTS--------------------------------------------------------------------------
    bindLoad: function (handler) {
        this._visualComponent.on('afterrender', handler);
    },
    bindClick: function (handler) {
        this._visualComponent.on('click', handler);
    },
    bindChangeSelection: function (handler) {
        this._visualComponent.on('selectionchange', handler);
    },
    //----------------------------------CLIENT ACTIONS------------------------------------------------------------------
    executeEnable: function (handler) {
        this._visualComponent.enable();
    },
    executeDisable: function (handler) {
        this._visualComponent.disable();
    },
});