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
    }
});