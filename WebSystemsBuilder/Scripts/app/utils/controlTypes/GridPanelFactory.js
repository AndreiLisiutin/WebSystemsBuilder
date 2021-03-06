Ext.define('WebSystemsBuilder.utils.controlTypes.GridPanelFactory', {
    extend: 'WebSystemsBuilder.utils.controlTypes.BaseComponentFactory',
    alternateClassName: ['GridPanelFactory'],

    createComponent: function () {
        var store = Ext.create('Ext.data.SimpleStore', {
            fields: [],
            data: []
        });
        var component = Ext.create('Ext.grid.Panel', {
            xtype: 'gridpanel',
            title: 'Моя таблица',
            height: 150,
            width: 200,
            minWidth: 50,
            minHeight: 50,
            margin: 5,
            resizable: true,
            columnLines: true,
            collapsible: true,
            columns: [],
            viewConfig: {
                loadingText: 'Загрузка...'
            },
            store: store
        });
        component.on('afterrender', function (c) {
            c.tools['collapse-top'].hide();
        });
        return component;
    },

    //----------------------------------FORM GENERATOR------------------------------------------------------------------
    _generateSimpleStore: function (columns) {
        var fields = [];
        $.each(columns, function (index, item) {
            fields.push(item.dataIndex);
        });
        var store = new Ext.data.Store({
            fields: fields,
            data: [],
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    root: 'users'
                }
            }
        });
        return store;
    },

    generateVisualComponent: function (properties) {
        var _this = this;
        var store = _this._generateSimpleStore(properties.columns);
        properties.store = store;
        var visualComponent = Ext.create(properties);
        return visualComponent;
    },
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
    }
});