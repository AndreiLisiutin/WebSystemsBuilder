Ext.define('WebSystemsBuilder.view.IDE.query.QueryAction', {
    extend: 'Ext.window.Window',
    alias: 'widget.QueryAction',
    name: 'QueryAction',

    modal: true,
    title: 'Query Action',

    height: 700,
    width: 800,
    minHeight: 700,
    minWidth: 800,

    layout: 'fit',

    initComponent: function () {
        var me = this;

        var dataTableStore = Ext.create('WebSystemsBuilder.store.IDE.query.DataTable');
        var columnStore = Ext.create('WebSystemsBuilder.store.IDE.query.Column');
        var conditionStore = Ext.create('WebSystemsBuilder.store.IDE.query.Condition');
        var parametersStore = Ext.create('WebSystemsBuilder.store.IDE.query.QueryInParameters');
        // INSERT
        var insertDataTableStore = Ext.create('WebSystemsBuilder.store.IDE.query.Dictionary');
        var insertColumnsStore = Ext.create('WebSystemsBuilder.store.IDE.query.DataTable');
        // DELETE
        var deleteTableStore = Ext.create('WebSystemsBuilder.store.IDE.query.Dictionary');
        var deleteColumnsStore = Ext.create('WebSystemsBuilder.store.IDE.query.DataTable');

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
                            layout: 'fit',
                            height: 100,
                            margin: '5 5 5 5',
                            padding: 2,
                            title: 'Query',
                            items: [
                                {
                                    xtype: 'textareafield',
                                    name: 'queryString'
                                }
                            ]
                        },
                        // Params
                        {
                            xtype: 'fieldset',
                            height: 100,
                            margin: '0 5 5 5',
                            padding: 2,
                            anchor: '0',
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
                        },

                        {
                            xtype: 'container',
                            width: 300,
                            layout: {
                                align: 'stretch',
                                type: 'hbox'
                            },
                            items: [
                                {
                                    xtype: 'radiogroup',
                                    name: 'rgSqlType',
                                    margin: '0 5 5 5',
                                    flex: 1,
                                    items: [
                                        {
                                            xtype: 'radiofield',
                                            action: 'rbSelect',
                                            boxLabel: 'SELECT',
                                            name: 'data',
                                            inputValue: 'SELECT'
                                        },
                                        {
                                            xtype: 'radiofield',
                                            action: 'rbInsert',
                                            boxLabel: 'INSERT',
                                            name: 'data',
                                            inputValue: 'INSERT'
                                        },
                                        {
                                            xtype: 'radiofield',
                                            action: 'rbUpdate',
                                            boxLabel: 'UPDATE',
                                            name: 'data',
                                            inputValue: 'UPDATE'
                                        },
                                        {
                                            xtype: 'radiofield',
                                            action: 'rbDelete',
                                            boxLabel: 'DELETE',
                                            name: 'data',
                                            inputValue: 'DELETE'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'tabpanel',
                            anchor: '0 -240',
                            name: 'sqlActionTabPanel',
                            items: [
                                {
                                    xtype: 'panel',
                                    layout: {
                                        type: 'vbox',
                                        align: 'stretch'
                                    },
                                    title: 'SELECT',
                                    disabled: true,
                                    name: 'selectSqlAction',
                                    items: [
                                        {
                                            xtype: 'container',
                                            flex: 1,
                                            layout: {
                                                type: 'hbox',
                                                align: 'stretch'
                                            },
                                            items: [
                                                // SELECT
                                                {
                                                    xtype: 'fieldset',
                                                    flex: 1,
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
                                                // FROM
                                                {
                                                    xtype: 'fieldset',
                                                    margin: 5,
                                                    padding: 2,
                                                    flex: 1,
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
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'container',
                                            flex: 1,
                                            layout: {
                                                type: 'hbox',
                                                align: 'stretch'
                                            },
                                            items: [
                                                // WHERE
                                                {
                                                    xtype: 'fieldset',
                                                    margin: 5,
                                                    flex: 1,
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
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'panel',
                                    title: 'INSERT/UPDATE',
                                    disabled: true,
                                    layout: {
                                        type: 'vbox',
                                        align: 'stretch'
                                    },
                                    name: 'insertSqlAction',
                                    items: [
                                        {
                                            xtype: 'combobox',
                                            name: 'insertDataTable',
                                            fieldLabel: 'Data table',
                                            margin: '5 5 5 5',
                                            valueField: 'TableID',
                                            displayField: 'Name',
                                            queryMode: 'local',
                                            editable: false,
                                            labelWidth: 55,
                                            store: insertDataTableStore
                                        },
                                        {
                                            xtype: 'fieldset',
                                            margin: 5,
                                            padding: 2,
                                            flex: 1,
                                            title: 'Columns',
                                            layout: 'fit',
                                            items: [
                                                {
                                                    xtype: 'gridpanel',
                                                    name: 'insertTableColumnsGrid',
                                                    store: insertColumnsStore,
                                                    columns: [
                                                        {
                                                            xtype: 'gridcolumn',
                                                            width: 150,
                                                            text: 'Column',
                                                            dataIndex: 'Name'
                                                        },
                                                        {
                                                            xtype: 'gridcolumn',
                                                            flex: 1,
                                                            text: 'Value',
                                                            dataIndex: 'Value'
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
                                                                    icon: 'Scripts/resources/icons/edit.png',
                                                                    tooltip: 'Edit column value',
                                                                    action: 'onInsert_EditColumnValue'
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
                                                                    action: 'onInsert_DeleteColumnValue'
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'container',
                                            name: 'updateConditionContainer',
                                            layout: {
                                                type: 'hbox',
                                                align: 'stretch'
                                            },
                                            items: [
                                                {
                                                    xtype: 'textfield',
                                                    name: 'updateCondition',
                                                    readOnly: true,
                                                    fieldLabel: 'WHERE',
                                                    margin: '0 5 5 5',
                                                    flex: 1,
                                                    labelWidth: 55
                                                },
                                                {
                                                    xtype: 'button',
                                                    margin: '0 5 5 0',
                                                    scale: 'small',
                                                    border: true,
                                                    icon: 'Scripts/resources/icons/edit_16.png',
                                                    tooltip: 'Set UPDATE condition',
                                                    action: 'onSetUpdateCondition'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'panel',
                                    title: 'DELETE',
                                    disabled: true,
                                    layout: {
                                        type: 'vbox',
                                        align: 'stretch'
                                    },
                                    name: 'deleteSqlAction',
                                    items: [
                                        {
                                            xtype: 'combobox',
                                            name: 'deleteDataTable',
                                            fieldLabel: 'Data table',
                                            margin: '5 5 5 5',
                                            valueField: 'TableID',
                                            displayField: 'Name',
                                            queryMode: 'local',
                                            editable: false,
                                            labelWidth: 55,
                                            store: deleteTableStore
                                        },
                                        {
                                            xtype: 'fieldset',
                                            margin: 5,
                                            padding: 2,
                                            flex: 1,
                                            title: 'Columns',
                                            layout: 'fit',
                                            items: [
                                                {
                                                    xtype: 'gridpanel',
                                                    name: 'deleteTableColumnsGrid',
                                                    store: deleteColumnsStore,
                                                    columns: [
                                                        {
                                                            xtype: 'gridcolumn',
                                                            width: 150,
                                                            text: 'Column',
                                                            dataIndex: 'Name'
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
                                                                    tooltip: 'Add column condition',
                                                                    action: 'onDelete_AddColumnCondition'
                                                                },
                                                                {
                                                                    xtype: 'tbseparator'
                                                                },
                                                                {
                                                                    xtype: 'button',
                                                                    scale: 'medium',
                                                                    border: true,
                                                                    icon: 'Scripts/resources/icons/delete.png',
                                                                    tooltip: 'Delete column condition',
                                                                    action: 'onDelete_DeleteColumnCondition'
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
                        }
                    ]
                }
            ]

        });

        me.callParent(arguments);
    }
});