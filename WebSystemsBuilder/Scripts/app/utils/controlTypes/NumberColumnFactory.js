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
    }

});