Ext.define('WebSystemsBuilder.view.IDE.query.QueryActionDataTable', {
    extend: 'Ext.window.Window',
    alias: 'widget.QueryActionDataTable',
    name: 'QueryActionDataTable',

    modal: true,
    constrain: true,
    title: 'Data table',

    height: 170,
    width: 600,
    minHeight: 170,
    minWidth: 600,
    maxWidth: 600,
    maxHeight: 170,

    layout: 'fit',

    initComponent: function () {
        var me = this;

        var joinTableStore = Ext.create('WebSystemsBuilder.store.IDE.query.Dictionary');
        var newDataTable = Ext.create('WebSystemsBuilder.store.IDE.query.Dictionary');
        var joinTableFieldStore = Ext.create('WebSystemsBuilder.store.IDE.query.Field');
        var newTableFieldStore = Ext.create('WebSystemsBuilder.store.IDE.query.Field');
        var joinKindStore = Ext.create('WebSystemsBuilder.store.IDE.query.JoinKind');

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
                            xtype: 'combobox',
                            name: 'joinKind',
                            labelWidth: 55,
                            width: 150,
                            margin: '5 5 5 5',
                            labelSeparator: '',
                            fieldLabel: 'Join kind',
                            valueField: 'JoinKindID',
                            displayField: 'Name',
                            queryMode: 'local',
                            editable: false,
                            store: joinKindStore
                        },
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
                                    title: 'New data table',
                                    items: [
                                        {
                                            xtype: 'combobox',
                                            anchor: '0',
                                            margin: '5 5 5 5',
                                            labelSeparator: '',
                                            valueField: 'TableID',
                                            displayField: 'Name',
                                            queryMode: 'local',
                                            editable: false,
                                            fieldLabel: 'Table',
                                            labelWidth: 55,
                                            name: 'newDataTable',
                                            store: newDataTable
                                        },
                                        {
                                            xtype: 'combobox',
                                            anchor: '0',
                                            margin: '5 5 5 5',
                                            labelSeparator: '',
                                            valueField: 'ColumnID',
                                            displayField: 'Name',
                                            queryMode: 'local',
                                            editable: false,
                                            fieldLabel: 'Join column',
                                            labelWidth: 55,
                                            name: 'newTableField',
                                            store: newTableFieldStore
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldset',
                                    flex: 1,
                                    margin: '5 5 5 0',
                                    padding: 2,
                                    layout: 'anchor',
                                    title: 'Join data table',
                                    items: [
                                        {
                                            xtype: 'combobox',
                                            name: 'joinTable',
                                            fieldLabel: 'Join Table',
                                            labelWidth: 55,
                                            anchor: '0',
                                            margin: '5 5 5 5',
                                            labelSeparator: '',
                                            valueField: 'TableID',
                                            displayField: 'Name',
                                            queryMode: 'local',
                                            editable: false,
                                            store: joinTableStore
                                        },
                                        {
                                            xtype: 'combobox',
                                            name: 'joinTableField',
                                            anchor: '0',
                                            margin: '5 5 5 5',
                                            labelSeparator: '',
                                            valueField: 'ColumnID',
                                            displayField: 'Name',
                                            queryMode: 'local',
                                            editable: false,
                                            fieldLabel: 'Join column',
                                            labelWidth: 55,
                                            store: joinTableFieldStore
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