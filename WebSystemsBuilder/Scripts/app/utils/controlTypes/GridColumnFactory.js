Ext.define('WebSystemsBuilder.utils.controlTypes.GridColumnFactory', {
    extend: 'WebSystemsBuilder.utils.controlTypes.BaseComponentFactory',
    alternateClassName: ['GridColumnFactory'],

    focusEvent: 'headerclick',
    isColumn: true,

    onRender: function (component) { },

    onRemoveComponent: function(parentComponent, component) {
        parentComponent.headerCt.remove(component, true);
        parentComponent.getView().refresh();
    },

    createComponent: function () {
        return Ext.create('Ext.grid.column.Column', {
            xtype: 'gridcolumn',
            header: 'Моя колонка',
            width: 150,
            sortable: true,
            minWidth: 50
        });
    },

    //----------------------------------FORM GENERATOR------------------------------------------------------------------

    generateVisualComponent: function (properties) {
        properties.dataIndex = properties.dataIndex || ('_column_' + (Math.random() * 100000).toString());
        var visualComponent = Ext.create(properties);
        return visualComponent;
    },
    getSelfArrayName:function(properties) {
        return 'columns';
    },
    //----------------------------------OPERAND-------------------------------------------------------------------------
    isOperand: function() {
        return true;
    },
    getValue: function () {
        var gridpanel = this._visualComponent.up('gridpanel');
        if (!gridpanel) {
            throw 'Gridpanel for gridcolumn not found';
        }
        var selection = gridpanel.getSelectionModel().getSelection()[0];
        if (!selection) {
            return null;
        }
        return selection.get(this._visualComponent.dataIndex);
    },
    setValue: function (value) {
        throw 'Can not set value to gridcolumn';
    },
    setValueArray: function (arrayValue) {
        var gridpanel = this._visualComponent.up('gridpanel');
        if (!gridpanel) {
            throw 'Gridpanel for gridcolumn not found';
        }
        var storeRange = gridpanel.getStore().getRange();
        var dataIndex = this._visualComponent.dataIndex;
        $.each(arrayValue, function(index, item) {
            if (index < storeRange.length) {
                var oldRow = storeRange[index];
                oldRow.set(dataIndex, item);
                oldRow.commit();
            } else {
                var newRow = {};
                newRow[dataIndex] = item;
                storeRange.push(newRow);
            }
        });
        storeRange = storeRange.slice(0, arrayValue.length);
        gridpanel.getStore().loadData(storeRange, false);
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