Ext.define('WebSystemsBuilder.utils.controlTypes.DateColumnFactory', {
    extend: 'WebSystemsBuilder.utils.controlTypes.BaseComponentFactory',
    alternateClassName: ['DateColumnFactory'],

    focusEvent: 'headerclick',
    isColumn: true,

    onRender: function (component) { },

    onRemoveComponent: function(parentComponent, component) {
        parentComponent.headerCt.remove(component, true);
        parentComponent.getView().refresh();
    },

    createComponent: function () {
        return Ext.create('Ext.grid.column.Date', {
            xtype: 'datecolumn',
            header: 'Моя колонка',
            format: 'd.m.Y',
            width: 90,
            sortable: true,
            resizable: false,
            align: 'center',
            minWidth: 50
        });
    },

    //----------------------------------FORM GENERATOR------------------------------------------------------------------
    getSelfArrayName:function(properties) {
        return 'columns';
    },
    //----------------------------------OPERAND-------------------------------------------------------------------------
    getValue: function () {
        var gridpanel = this._visualComponent.up('gridpanel');
        if (!gridpanel) {
            throw 'Gridpanel for datecolumn not found';
        }
        var selection = gridpanel.getSelectionModel().getSelection()[0];
        if (!selection) {
            return null;
        }
        return selection.get(this._visualComponent.dataIndex);
    },
    setValue: function (value) {
        throw 'Can not set value to datecolumn';
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
    },
});