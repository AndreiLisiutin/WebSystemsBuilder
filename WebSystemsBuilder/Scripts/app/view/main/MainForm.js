Ext.define('WebSystemsBuilder.view.main.MainForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.MainForm',

    requires: [
        'Ext.plugin.Viewport'
    ],

    items: [
        {
            xtype: 'container',
            margin: '20 0 0 40',
            layout: {
                align: 'stretch',
                type: 'hbox'
            },
            items: [
                {
                    xtype: 'button',
                    width: 100,
                    text: 'IDE',
                    iconAlign: 'top',
                    action: 'onOpenIDE',
                    icon: 'Scripts/resources/icons/process.png'
                },
                {
                    xtype: 'button',
                    width: 100,
                    text: 'Test',
                    iconAlign: 'top',
                    name:'test',
                    icon: 'Scripts/resources/icons/process.png'
                }
            ]
        }
    ]
});
