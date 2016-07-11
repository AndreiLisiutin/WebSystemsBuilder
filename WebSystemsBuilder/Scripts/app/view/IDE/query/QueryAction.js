Ext.define('WebSystemsBuilder.view.IDE.query.QueryAction', {
    extend: 'Ext.window.Window',
    alias: 'widget.QueryAction',
    name: 'QueryAction',

    modal: true,
    title: 'Query Action',

    height: 700,
    width: 730,
    minHeight: 700,
    minWidth: 730,

    layout: 'fit',

    initComponent: function () {
        var me = this;

        var dataTableStore = Ext.create('WebSystemsBuilder.store.IDE.query.DataTable');
        var columnStore = Ext.create('WebSystemsBuilder.store.IDE.query.Column');
        var conditionStore = Ext.create('WebSystemsBuilder.store.IDE.query.Condition');
        var parametersStore = Ext.create('WebSystemsBuilder.store.IDE.query.QueryInParameters');

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
                            layout: 'fit',
                            height: 97,
                            margin: 5,
                            padding: 2,
                            title: 'Query',
                            items: [
                                {
                                    xtype: 'textareafield',
                                    name: 'queryString'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            anchor: '0',
                            height: 135,
                            margin: 5,
                            padding: 2,
                            title: 'Out columns (SELECT)',
                            layout: 'fit',
                            items: [
                                {
                                    xtype: 'gridpanel',
                                    name: 'columnsGrid',
                                    store: columnStore,
                                    columns: [
                                        {
                                            xtype: 'gridcolumn',
                                            width: 150,
                                            text: 'Data table',
                                            dataIndex: 'dictionary'
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            flex: 1,
                                            text: 'Column',
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
                                                    tooltip: 'Add column',
                                                    action: 'onAddColumn'
                                                },
                                                {
                                                    xtype: 'tbseparator'
                                                },
                                                {
                                                    xtype: 'button',
                                                    scale: 'medium',
                                                    border: true,
                                                    icon: 'Scripts/resources/icons/delete.png',
                                                    tooltip: 'Delete column',
                                                    action: 'onDeleteColumn'
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
                            title: 'Data tables (FROM)',
                            layout: 'fit',
                            items: [
                                {
                                    xtype: 'gridpanel',
                                    name: 'dataTablesGrid',
                                    store: dataTableStore,
                                    columns: [
                                        {
                                            xtype: 'gridcolumn',
                                            width: 150,
                                            text: 'Table',
                                            dataIndex: 'Name'
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            width: 60,
                                            text: 'Join kind',
                                            dataIndex: 'JoinKindName'
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            flex: 1,
                                            text: 'Join condition',
                                            dataIndex: 'Condition'
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
                                                    tooltip: 'Add data table',
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
                                                    tooltip: 'Delete data table',
                                                    action: 'onDeleteDataTable'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            width: 100,
                            margin: 5,
                            padding: 2,
                            title: 'Conditions (WHERE)',
                            layout: 'fit',
                            items: [
                                {
                                    xtype: 'gridpanel',
                                    name: 'conditionsGrid',
                                    store: conditionStore,
                                    columns: [
                                        {
                                            xtype: 'gridcolumn',
                                            width: 70,
                                            text: 'Operation',
                                            dataIndex: 'Operation'
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            flex: 1,
                                            text: 'Condition',
                                            dataIndex: 'Condition'
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
                                                    tooltip: 'Add AND condition',
                                                    text: 'AND',
                                                    operation: 'AND',
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
                                                    tooltip: 'Add OR condition',
                                                    text: 'OR',
                                                    operation: 'OR',
                                                    action: 'onAddConditionOr'
                                                },
                                                {
                                                    xtype: 'tbseparator'
                                                },
                                                {
                                                    xtype: 'button',
                                                    scale: 'medium',
                                                    border: true,
                                                    icon: 'Scripts/resources/icons/delete.png',
                                                    tooltip: 'Delete condition',
                                                    action: 'onDeleteCondition'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            anchor: '0 -480',
                            margin: 5,
                            padding: 2,
                            title: 'In parameters',
                            layout: 'fit',
                            items: [
                                {
                                    xtype: 'gridpanel',
                                    name: 'queryInParametersGrid',
                                    store: parametersStore,
                                    columns: [
                                        {
                                            xtype: 'gridcolumn',
                                            width: 70,
                                            text: 'Parameter',
                                            dataIndex: 'Name'
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            flex: 1,
                                            text: 'Type',
                                            dataIndex: 'ValueType'
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
                                                    tooltip: 'Add parameter',
                                                    action: 'onAddQueryInParameter'
                                                },
                                                {
                                                    xtype: 'tbseparator'
                                                },
                                                {
                                                    xtype: 'button',
                                                    scale: 'medium',
                                                    border: true,
                                                    icon: 'Scripts/resources/icons/delete.png',
                                                    tooltip: 'Delete parameter',
                                                    action: 'onDeleteQueryInParameter'
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