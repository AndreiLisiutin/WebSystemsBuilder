Ext.define('WebSystemsBuilder.view.IDE.query.QueryActionCondition', {
    extend: 'Ext.window.Window',
    alias: 'widget.QueryActionCondition',
    name: 'QueryActionCondition',

    modal: true,
    constrain: true,
    title: 'Query condition',

    height: 225,
    width: 700,
    minHeight: 225,
    minWidth: 700,
    maxWidth: 700,
    maxHeight: 225,

    layout: {
        type: 'anchor'
    },

    initComponent: function () {
        var me = this;

        var firstDataTableStore = Ext.create('WebSystemsBuilder.store.IDE.query.Dictionary');
        var secondDataTableStore = Ext.create('WebSystemsBuilder.store.IDE.query.Dictionary');
        var firstColumnStore = Ext.create('WebSystemsBuilder.store.IDE.query.Field');
        var secondColumnStore = Ext.create('WebSystemsBuilder.store.IDE.query.Field');
        var secondFormParameterStore = Ext.create('WebSystemsBuilder.store.IDE.FormParameters');

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
                            xtype: 'container',
                            anchor: '0',
                            layout: {
                                align: 'stretch',
                                type: 'hbox'
                            },
                            items: [
                                {
                                    xtype: 'fieldset',
                                    flex: 1,
                                    margin: '5 5 5 5',
                                    padding: 2,
                                    title: 'Condition 1-st member',
                                    items: [
                                        {
                                            xtype: 'combobox',
                                            name: 'firstDataTable',
                                            fieldLabel: 'Data table',
                                            anchor: '0',
                                            margin: '5 5 5 5',
                                            valueField: 'TableID',
                                            displayField: 'Name',
                                            queryMode: 'local',
                                            editable: false,
                                            labelWidth: 55,
                                            store: firstDataTableStore
                                        },
                                        {
                                            xtype: 'combobox',
                                            name: 'firstColumn',
                                            anchor: '0',
                                            margin: '5 5 5 5',
                                            valueField: 'ColumnID',
                                            displayField: 'Name',
                                            queryMode: 'local',
                                            editable: false,
                                            fieldLabel: 'Column',
                                            labelWidth: 55,
                                            store: secondColumnStore
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    anchor: '0 0',
                                    layout: {
                                        align: 'stretch',
                                        type: 'vbox'
                                    },
                                    items: [
                                        {
                                            xtype: 'combobox',
                                            width: 80,
                                            margin: '60 5 0 0',
                                            valueField: 'name',
                                            displayField: 'name',
                                            queryMode: 'local',
                                            editable: false,
                                            name: 'conditionSign',
                                            store: Ext.create('Ext.data.Store', {
                                                fields: ['ID', 'name'],
                                                data: [
                                                    {"ID": "1", "name": ">"},
                                                    {"ID": "2", "name": "<"},
                                                    {"ID": "3", "name": "="},
                                                    {"ID": "4", "name": "!="},
                                                    {"ID": "5", "name": "IS NULL"},
                                                    {"ID": "6", "name": "IS NOT NULL"}
                                                ]
                                            })
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldset',
                                    flex: 1,
                                    margin: '5 5 5 0',
                                    padding: 2,
                                    name: 'secondConditionMemberFieldset',
                                    layout: {
                                        type: 'anchor'
                                    },
                                    title: 'Condition 2-nd member',
                                    items: [
                                        {
                                            xtype: 'container',
                                            anchor: '0',
                                            layout: {
                                                align: 'stretch',
                                                type: 'hbox'
                                            },
                                            items: [
                                                {
                                                    xtype: 'radiogroup',
                                                    name: 'rbData',
                                                    margin: '0 5 5 5',
                                                    flex: 1,
                                                    items: [
                                                        {
                                                            xtype: 'radiofield',
                                                            width:60,
                                                            action: 'rbField',
                                                            boxLabel: 'Column',
                                                            name: 'data',
                                                            inputValue: '1'
                                                        },
                                                        {
                                                            xtype: 'radiofield',
                                                            flex: 1,
                                                            action: 'rbParameter',
                                                            boxLabel: 'Form parameter',
                                                            name: 'data',
                                                            inputValue: '2'
                                                        },
                                                        {
                                                            xtype: 'radiofield',
                                                            width:60,
                                                            action: 'rbValue',
                                                            boxLabel: 'Constant',
                                                            name: 'data',
                                                            inputValue: '3'
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'combobox',
                                            name: 'secondDataTable',
                                            anchor: '0',
                                            margin: '5 5 5 5',
                                            valueField: 'TableID',
                                            displayField: 'Name',
                                            queryMode: 'local',
                                            editable: false,
                                            fieldLabel: 'Data table',
                                            labelWidth: 55,
                                            store: secondDataTableStore
                                        },
                                        {
                                            xtype: 'combobox',
                                            anchor: '0',
                                            margin: '5 5 5 5',
                                            valueField: 'ID',
                                            displayField: 'name',
                                            queryMode: 'local',
                                            editable: false,
                                            fieldLabel: 'Column',
                                            labelWidth: 55,
                                            name: 'secondColumn',
                                            store: firstColumnStore
                                        },
                                        {
                                            xtype: 'combobox',
                                            name: 'secondFormParameter',
                                            fieldLabel: 'Form parameter',
                                            anchor: '0',
                                            margin: '5 5 5 5',
                                            valueField: 'UniqueID',
                                            displayField: 'Name',
                                            queryMode: 'local',
                                            editable: false,
                                            labelWidth: 55,
                                            store: secondFormParameterStore
                                        },
                                        {
                                            xtype: 'textfield',
                                            anchor: '0',
                                            margin: '5 5 5 5',
                                            fieldLabel: 'Constant',
                                            labelWidth: 55,
                                            name: 'secondConstant'
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