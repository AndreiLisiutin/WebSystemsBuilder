Ext.define('WebSystemsBuilder.view.main.MainForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.MainForm',
    name: 'MainForm',

    requires: [
        'Ext.plugin.Viewport'
    ],

    initComponent: function () {
        var me = this;

        Ext.util.CSS.createStyleSheet('.main_buttons ' +
            '{ width: 120px !important; background-color: inherit !important; background-image: none !important; }'
        );
        Ext.util.CSS.createStyleSheet('.reset_buttons_z_index ' +
            '{ z-index : 1; }'
        );Ext.util.CSS.createStyleSheet('.main_buttons_icons ' +
            '{ height: 73px !important; align: center; }'
        );

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
                            text: 'IDE For Cloud<br>Systems Builder',
                            iconAlign: 'top',
                            iconCls:'icon-image main_buttons_icons',
                            cls:['icons', 'main_buttons', 'reset_buttons_z_index'],
                            action: 'onOpenIDE',
                            margin: '20 10 10 10',
                            border: true,
                            icon: 'Scripts/resources/icons/development_64.png'
                        },
                        {
                            xtype: 'button',
                            text: 'SQL Query<br>Builder',
                            iconAlign: 'top',
                            iconCls:'icon-image main_buttons_icons',
                            cls:['icons', 'main_buttons', 'reset_buttons_z_index'],
                            border: true,
                            action: 'onOpenQueryBuilder',
                            margin: '20 10 10 10',
                            icon: 'Scripts/resources/icons/database_64.png'
                        },
                        {
                            xtype: 'button',
                            text: 'Test Sample',
                            iconAlign: 'top',
                            iconCls:'icon-image main_buttons_icons',
                            cls:['icons', 'main_buttons', 'reset_buttons_z_index'],
                            action: 'onTestSample',
                            border: true,
                            margin: '20 10 10 10',
                            icon: 'Scripts/resources/icons/test_48.png'
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }
});