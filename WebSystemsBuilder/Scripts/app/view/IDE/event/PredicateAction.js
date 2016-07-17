Ext.define('WebSystemsBuilder.view.IDE.event.PredicateAction', {
    extend: 'Ext.window.Window',
    alias: 'widget.PredicateAction',
    name: 'PredicateAction',

    modal: true,
    constrain: true,
    title: 'Predicate Action',

    height: 155,
    width: 560,
    minHeight: 155,
    minWidth: 560,

    layout: 'fit',

    initComponent: function () {
        var me = this;

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
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            margin: '5 5 5 5',
                            items: [
                                {
                                    xtype: 'textfield',
                                    name: 'firstPart',
                                    fieldLabel: 'if (',
                                    margin: '0 5 0 0',
                                    labelSeparator: '',
                                    readOnly: true,
                                    width:170,
                                    labelWidth: 20
                                },
                                {
                                    xtype: 'button',
                                    margin: '0 5 0 0',
                                    scale: 'small',
                                    border: true,
                                    icon: 'Scripts/resources/icons/edit_16.png',
                                    tooltip: 'Set first part',
                                    action: 'onSetFirstPart'
                                },
                                {
                                    xtype: 'combobox',
                                    width: 80,
                                    margin: '0 5 0 0',
                                    valueField: 'ID',
                                    displayField: 'name',
                                    queryMode: 'local',
                                    editable: false,
                                    name: 'conditionSign',
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['ID', 'name'],
                                        data: [,
                                            {"ID": 1, "name": "="},
                                            {"ID": 2, "name": "!="},
                                            {"ID": 3, "name": ">"},
                                            {"ID": 4, "name": "<"}
                                        ]
                                    })
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'secondPart',
                                    fieldLabel: '',
                                    margin: '0 5 0 0',
                                    labelSeparator: '',
                                    readOnly: true,
                                    width:150
                                },
                                {
                                    xtype: 'button',
                                    margin: '0 5 0 0',
                                    scale: 'small',
                                    border: true,
                                    icon: 'Scripts/resources/icons/edit_16.png',
                                    tooltip: 'Set second part',
                                    action: 'onSetSecondPart'
                                },
                                {
                                    xtype: 'label',
                                    margin: '4 0 0 0',
                                    text: ') {'
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            margin: '5 5 5 5',
                            items: [
                                {
                                    xtype: 'combobox',
                                    width: 200,
                                    fieldLabel: 'Action type',
                                    labelWidth: 70,
                                    margin: '0 5 0 0',
                                    valueField: 'ID',
                                    displayField: 'name',
                                    queryMode: 'local',
                                    editable: false,
                                    name: 'trueActionType',
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['ID', 'name'],
                                        data: [
                                            {"ID": ActionTypes.Client, "name": ActionTypes.getActionTypeName(ActionTypes.Client)},
                                            {"ID": ActionTypes.OpenForm, "name": ActionTypes.getActionTypeName(ActionTypes.OpenForm)},
                                            {"ID": ActionTypes.Predicate, "name": ActionTypes.getActionTypeName(ActionTypes.Predicate)},
                                            {"ID": ActionTypes.Query, "name": ActionTypes.getActionTypeName(ActionTypes.Query)}
                                        ]
                                    })
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'trueAction',
                                    fieldLabel: '',
                                    margin: '0 5 0 0',
                                    labelSeparator: '',
                                    readOnly: true,
                                    width: 235
                                },
                                {
                                    xtype: 'button',
                                    margin: '0 5 0 0',
                                    scale: 'small',
                                    border: true,
                                    icon: 'Scripts/resources/icons/edit_16.png',
                                    tooltip: 'Set true action',
                                    action: 'onSetTrueAction'
                                }
                            ]
                        },
                        {
                            xtype: 'label',
                            margin: '5 5 5 5',
                            text: '} else {'
                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            margin: '5 5 5 5',
                            items: [
                                {
                                    xtype: 'combobox',
                                    width: 200,
                                    fieldLabel: 'Action type',
                                    labelWidth: 70,
                                    margin: '0 5 0 0',
                                    valueField: 'ID',
                                    displayField: 'name',
                                    queryMode: 'local',
                                    editable: false,
                                    name: 'falseActionType',
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['ID', 'name'],
                                        data: [
                                            {"ID": ActionTypes.Client, "name": ActionTypes.getActionTypeName(ActionTypes.Client)},
                                            {"ID": ActionTypes.OpenForm, "name": ActionTypes.getActionTypeName(ActionTypes.OpenForm)},
                                            {"ID": ActionTypes.Predicate, "name": ActionTypes.getActionTypeName(ActionTypes.Predicate)},
                                            {"ID": ActionTypes.Query, "name": ActionTypes.getActionTypeName(ActionTypes.Query)}
                                        ]
                                    })
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'falseAction',
                                    fieldLabel: '',
                                    margin: '0 5 0 0',
                                    labelSeparator: '',
                                    readOnly: true,
                                    width: 235
                                },
                                {
                                    xtype: 'button',
                                    margin: '0 5 0 0',
                                    scale: 'small',
                                    border: true,
                                    icon: 'Scripts/resources/icons/edit_16.png',
                                    tooltip: 'Set false action',
                                    action: 'onSetFalseAction'
                                }
                            ]
                        },
                        {
                            xtype: 'label',
                            margin: '5 5 5 5',
                            text: '}'
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }
});