Ext.define('WebSystemsBuilder.view.IDE.event.EventHandler', {
    extend: 'Ext.window.Window',
    alias: 'widget.EventHandler',
    name: 'EventHandler',

    modal: true,
    constrain: true,
    title: 'Event handler',

    height: 300,
    width: 500,
    minHeight: 300,
    minWidth: 500,

    layout: 'fit',

    initComponent: function () {
        var me = this;

        var actionStore = Ext.create('WebSystemsBuilder.store.IDE.event.Action');

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    layout: 'anchor',
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'right',
                            items: [
                                {
                                    xtype: 'button',
                                    scale: 'medium',
                                    text: 'Close',
                                    action: 'onClose',
                                    border: true,
                                    icon: 'Scripts/resources/icons/close.png',
                                    iconAlign: 'top'
                                },
                                {
                                    xtype: 'tbseparator'
                                },
                                {
                                    xtype: 'button',
                                    scale: 'medium',
                                    border: true,
                                    text: 'Add action',
                                    icon: 'Scripts/resources/icons/add.png',
                                    iconAlign: 'top',
                                    action: 'onAddAction',
                                    menu:[
                                        {
                                            xtype:'menuitem',
                                            text: 'Add client action',
                                            icon: 'Scripts/resources/icons/add_16.png',
                                            action: 'onAddClientAction'
                                        },
                                        {
                                            xtype: 'menuitem',
                                            text: 'Add open form action',
                                            icon: 'Scripts/resources/icons/add_16.png',
                                            action: 'onAddOpenFormAction'
                                        },
                                        {
                                            xtype:'menuitem',
                                            text: 'Add query action',
                                            icon: 'Scripts/resources/icons/add_16.png',
                                            action: 'onAddQueryAction'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'tbseparator'
                                },
                                {
                                    xtype: 'button',
                                    scale: 'medium',
                                    text: 'Delete action',
                                    border: true,
                                    icon: 'Scripts/resources/icons/delete.png',
                                    iconAlign: 'top',
                                    action: 'onDeleteAction'
                                }
                            ]
                        }
                    ],
                    items: [
                        {
                            xtype: 'fieldset',
                            anchor: '0 0',
                            margin: 5,
                            padding: 2,
                            title: 'Event handler actions',
                            layout: 'fit',
                            name: 'fsActions',
                            items: [
                                {
                                    xtype: 'gridpanel',
                                    name: 'actionGrid',
                                    store: actionStore,
                                    columns: [
                                        {
                                            xtype: 'rownumberer',
                                            width:50,
                                            text: '№'
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            flex: 1,
                                            text: 'Action',
                                            dataIndex: 'ClientActionType'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }
});