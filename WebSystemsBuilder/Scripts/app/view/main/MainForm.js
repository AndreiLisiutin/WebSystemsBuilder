Ext.define('WebSystemsBuilder.view.main.MainForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.MainForm',
    name: 'MainForm',

    requires: [
        'Ext.plugin.Viewport'
    ],

    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
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
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }
});