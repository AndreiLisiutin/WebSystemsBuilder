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
        component.on('afterrender', function(c) {
            c.tools['collapse-top'].hide();
        });
        return component;
    }
});