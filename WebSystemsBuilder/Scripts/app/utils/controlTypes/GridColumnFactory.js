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
    }
});