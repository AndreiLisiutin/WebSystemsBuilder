Ext.application({
    extend: 'Ext.app.Application',
    requires: [
        'WebSystemsBuilder.view.main.MainForm'
    ],
    
    name: 'WebSystemsBuilder',
    appFolder: 'Scripts/app',

    controllers: [
        'WebSystemsBuilder.controller.main.MainForm'
    ],
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
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: {
                xtype: 'MainForm'
            }
        }).show();
    }
});
