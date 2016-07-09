Ext.define('WebSystemsBuilder.view.IDE.query.CreateQuery', {
    extend: 'Ext.window.Window',
    alias: 'widget.CreateQuery',
    name: 'CreateQuery',

    modal: true,
    title: 'Query Action',

    height: 600,
    width: 730,
    minHeight: 600,
    minWidth: 730,

    layout: 'fit',

    initComponent: function () {
        var me = this;

        var fromStore = Ext.create('WebSystemsBuilder.store.IDE.query.From');
        var selectStore = Ext.create('WebSystemsBuilder.store.IDE.query.Select');
        var whereStore = Ext.create('WebSystemsBuilder.store.IDE.query.Where');

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
                                    text: 'Refresh',
                                    action: 'onRefreshSQL',
                                    border: true,
                                    icon: 'Scripts/resources/icons/refresh_24.png',
                                    iconAlign: 'top'
                                },
                                {
                                    xtype: 'tbseparator'
                                },
                                {
                                    xtype: 'button',
                                    scale: 'medium',
                                    text: 'Save',
                                    action: 'onSave',
                                    border: true,
                                    icon: 'Scripts/resources/icons/save.png',
                                    iconAlign: 'top'
                                }
                            ]
                        }
                    ],
                    items: [
                        {
                            xtype: 'fieldset',
                            anchor: '0',
                            height: 97,
                            margin: 5,
                            padding: 2,
                            title: 'Запрос',
                            layout: 'fit',
                            name: 'fsQuery',
                            items: [
                                {
                                    xtype: 'textareafield',
                                    name: 'query'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            anchor: '0',
                            height: 135,
                            margin: 5,
                            padding: 2,
                            title: 'Data tables',
                            layout: 'fit',
                            name: 'fsFrom',
                            items: [
                                {
                                    xtype: 'gridpanel',
                                    name: 'fromGrid',
                                    store: fromStore,
                                    columns: [
                                        {
                                            xtype: 'gridcolumn',
                                            width: 150,
                                            text: 'Table',
                                            dataIndex: 'name'
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            flex: 1,
                                            text: 'Join condition',
                                            dataIndex: 'condition'
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
                                                    border: true,
                                                    icon: 'Scripts/resources/icons/add.png',
                                                    tooltip: 'Добавить источник данных',
                                                    action: 'onAddDataTable'
                                                },
                                                {
                                                    xtype: 'tbseparator'
                                                },
                                                {
                                                    xtype: 'button',
                                                    scale: 'medium',
                                                    border: true,
                                                    icon: 'Scripts/resources/icons/delete.png',
                                                    tooltip: 'Удалить источник данных',
                                                    action: 'onDeleteDictionary'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            anchor: '0',
                            height: 135,
                            margin: 5,
                            padding: 2,
                            title: 'Выбираемые данные',
                            layout: 'fit',
                            name: 'fsSelect',
                            items: [
                                {
                                    xtype: 'gridpanel',
                                    name: 'selectGrid',
                                    store: selectStore,
                                    columns: [
                                        {
                                            xtype: 'gridcolumn',
                                            width: 150,
                                            text: 'Источник данных',
                                            dataIndex: 'dictionary'
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            flex: 1,
                                            text: 'Поле',
                                            dataIndex: 'field'
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
                                                    border: true,
                                                    icon: 'Scripts/resources/icons/add.png',
                                                    tooltip: 'Добавить поле',
                                                    action: 'onAddField'
                                                },
                                                {
                                                    xtype: 'tbseparator'
                                                },
                                                {
                                                    xtype: 'button',
                                                    scale: 'medium',
                                                    border: true,
                                                    icon: 'Scripts/resources/icons/delete.png',
                                                    tooltip: 'Удалить поле',
                                                    action: 'onDeleteField'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            anchor: '0 -380',
                            margin: 5,
                            padding: 2,
                            title: 'Условие выборки',
                            layout: 'fit',
                            name: 'fsWhere',
                            items: [
                                {
                                    xtype: 'gridpanel',
                                    name: 'whereGrid',
                                    store: whereStore,
                                    columns: [
                                        {
                                            xtype: 'gridcolumn',
                                            width: 70,
                                            text: 'Операция',
                                            dataIndex: 'operation'
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            flex: 1,
                                            text: 'Условие',
                                            dataIndex: 'condition'
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
                                                    border: true,
                                                    icon: 'Scripts/resources/icons/add.png',
                                                    iconAlign: 'top',
                                                    tooltip: 'Добавить условие AND',
                                                    text: 'AND',
                                                    action: 'onAddConditionAnd'
                                                },
                                                {
                                                    xtype: 'tbseparator'
                                                },
                                                {
                                                    xtype: 'button',
                                                    scale: 'medium',
                                                    border: true,
                                                    icon: 'Scripts/resources/icons/add.png',
                                                    iconAlign: 'top',
                                                    tooltip: 'Добавить условие OR',
                                                    text: 'OR',
                                                    action: 'onAddConditionOr'
                                                },
//                                        {
//                                            xtype:'tbseparator'
//                                        },
//                                        {
//                                            xtype:'button',
//                                            scale:'medium',
//                                            border:true,
//                                            icon:'Scripts/resources/icons/edit.png',
//                                            tooltip:'Изменить условие',
//                                            action: 'onEditCondition'
//                                        },
                                                {
                                                    xtype: 'tbseparator'
                                                },
                                                {
                                                    xtype: 'button',
                                                    scale: 'medium',
                                                    border: true,
                                                    icon: 'Scripts/resources/icons/delete.png',
                                                    tooltip: 'Удалить условие',
                                                    action: 'onDeleteCondition'
                                                }
                                            ]
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