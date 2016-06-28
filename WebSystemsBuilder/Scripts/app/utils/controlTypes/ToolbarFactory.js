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
            dock: 'right'
        });
    }
});