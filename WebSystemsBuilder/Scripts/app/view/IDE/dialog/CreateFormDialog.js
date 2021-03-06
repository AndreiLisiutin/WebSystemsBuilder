﻿Ext.define('WebSystemsBuilder.view.IDE.dialog.CreateFormDialog', {
    extend: 'Ext.window.Window',
    alias: 'widget.CreateFormDialog',
    name: 'CreateFormDialog',

    modal: true,
    title: 'New form',

    height: 150,
    width: 450,
    minHeight: 150,
    minWidth: 450,
    maxHeight: 150,
    maxWidth: 450,

    layout: 'fit',

    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    layout: 'anchor',
                    items: [
                        {
                            xtype: 'textfield',
                            anchor: '0',
                            margin: '10 5 5 10',
                            labelSeparator: '',
                            fieldLabel: 'Name',
                            labelWidth: 60,
                            emptyText: 'Type form name...',
                            name: 'formName'
                        },
                        {
                            xtype: 'textareafield',
                            anchor: '0',
                            height: 70,
                            margin: '0 5 5 10',
                            labelSeparator: '',
                            fieldLabel: 'Description',
                            labelWidth: 60,
                            emptyText: 'Type form description...',
                            name: 'description'
                        }
                    ],
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
                                    text: 'Create',
                                    action: 'onCreate',
                                    border: true,
                                    icon: 'Scripts/resources/icons/check.png',
                                    iconAlign: 'top'
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