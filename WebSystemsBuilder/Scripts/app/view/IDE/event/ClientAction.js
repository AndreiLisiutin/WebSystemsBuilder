Ext.define('WebSystemsBuilder.view.IDE.event.ClientAction', {
    extend: 'Ext.window.Window',
    alias: 'widget.ClientAction',
    name: 'ClientAction',

    modal: true,
    constrain: true,
    title: 'Client Action',

    height: 150,
    width: 500,
    minHeight: 150,
    minWidth: 500,

    layout: 'fit',

    initComponent: function () {
        var me = this;

        var controlStore = Ext.create('WebSystemsBuilder.store.IDE.event.Control');
        var clientActionTypeStore = Ext.create('WebSystemsBuilder.store.IDE.event.ClientActionType');

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
                            name: 'control',
                            fieldLabel: 'Control',
                            anchor: '0',
                            margin: '8 5 5 5',
                            labelSeparator: '',
                            valueField: 'UniqueID',
                            displayField: 'Name',
                            queryMode: 'local',
                            editable: false,
                            labelWidth: 120,
                            store: controlStore
                        },
                        {
                            xtype: 'combobox',
                            name: 'clientActionType',
                            fieldLabel: 'Client action type',
                            anchor: '0',
                            margin: '8 5 5 5',
                            labelSeparator: '',
                            valueField: 'ClientActionTypeID',
                            displayField: 'Name',
                            queryMode: 'local',
                            editable: false,
                            labelWidth: 120,
                            store: clientActionTypeStore
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }
});