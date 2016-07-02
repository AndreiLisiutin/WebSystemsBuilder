Ext.define('WebSystemsBuilder.utils.controlTypes.NumberColumnFactory', {
    extend: 'WebSystemsBuilder.utils.controlTypes.BaseComponentFactory',
    alternateClassName: ['NumberColumnFactory'],

    focusEvent: 'headerclick',
    isColumn: true,

    onRender: function (component) { },

    onRemoveComponent: function(parentComponent, component) {
        parentComponent.headerCt.remove(component, true);
        parentComponent.getView().refresh();
    },

    createComponent: function () {
        return Ext.create('Ext.grid.column.Number', {
            xtype: 'numbercolumn',
            header: 'Моя колонка',
            format: '0.00',
            width: 100,
            sortable: true,
            align: 'right',
            minWidth: 50
        });
    },

    //----------------------------------FORM GENERATOR------------------------------------------------------------------

    getSelfArrayName:function(properties) {
        return 'columns';
    },
    //----------------------------------EVENTS--------------------------------------------------------------------------
    bindLoad: function (handler) {
        this._visualComponent.on('afterrender', handler);
    },
    bindClick: function (handler) {
        this._visualComponent.on('click', handler);
    },
    bindChangeValue: function (handler) {
        this._visualComponent.on('change', handler);
    },
    //----------------------------------CLIENT ACTIONS------------------------------------------------------------------
    executeEnable: function (handler) {
        this._visualComponent.enable();
    },
    executeDisable: function (handler) {
        this._visualComponent.disable();
    }

});