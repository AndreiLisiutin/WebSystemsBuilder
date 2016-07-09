Ext.define('WebSystemsBuilder.view.IDE.event.OpenFormAction', {
    extend: 'Ext.window.Window',
    alias: 'widget.OpenFormAction',
    name: 'OpenFormAction',

    modal: true,
    constrain: true,
    title: 'Open Form Action',

    height: 300,
    width: 500,
    minHeight: 300,
    minWidth: 500,

    layout: 'fit',

    initComponent: function () {
        var me = this;

        var formParametersStore = Ext.create('WebSystemsBuilder.store.IDE.event.FormParameters');
        var formStore = Ext.create('WebSystemsBuilder.store.IDE.dialog.Form');

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
                                    text: 'Set Parameter',
                                    border: true,
                                    icon: 'Scripts/resources/icons/edit.png',
                                    iconAlign: 'top',
                                    action: 'onSetFormParameter'
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
                            name: 'Form',
                            fieldLabel: 'Form',
                            anchor: '0',
                            margin: '8 5 5 5',
                            labelSeparator: '',
                            valueField: 'FormID',
                            displayField: 'Name',
                            queryMode: 'local',
                            editable: false,
                            labelWidth: 120,
                            store: formStore
                        },
                        {
                            xtype: 'fieldset',
                            name: 'FormParametersFieldset',
                            title: 'Form parameters',
                            margin: 5,
                            padding: 2,
                            anchor: '0 -30',
                            layout: 'fit',
                            items: [
                                {
                                    xtype: 'gridpanel',
                                    name: 'FormParametersGrid',
                                    store: formParametersStore,
                                    columns: [
                                        {
                                            flex: 1,
                                            dataIndex: 'Name',
                                            text: 'Name'
                                        },
                                        {
                                            flex: 1,
                                            dataIndex: 'Value',
                                            text: 'Value'
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