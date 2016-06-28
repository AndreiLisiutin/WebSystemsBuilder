Ext.application({
    extend: 'Ext.app.Application',

    name: 'WebSystemsBuilder',
    appFolder: 'Scripts/app',

    requires: [
        'WebSystemsBuilder.utils.DefaultConfiguration',
        'WebSystemsBuilder.utils.Windows',
        'WebSystemsBuilder.utils.MessageBox',
        'WebSystemsBuilder.utils.ControllerLoader'
    ],

    init: function() {
        WebSystemsBuilder.utils.DefaultConfiguration.defineConfiguration();
    },

    launch: function () {
        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.main.MainForm');
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: {
                xtype: 'MainForm'
            }
        }).show();
    }
});
