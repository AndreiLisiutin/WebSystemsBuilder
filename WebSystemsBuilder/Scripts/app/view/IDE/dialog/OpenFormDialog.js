Ext.define('WebSystemsBuilder.view.IDE.dialog.OpenFormDialog', {
    extend: 'Ext.window.Window',
    alias: 'widget.OpenFormDialog',
    name: 'OpenFormDialog',

    modal: true,
    constrain: true,
    title: 'Open form',

    height: 150,
    width: 450,
    minHeight: 150,
    minWidth: 450,
    maxHeight: 150,
    maxWidth: 450,

    layout: 'fit',

    initComponent: function () {
        var me = this;

        var formStore = Ext.create('WebSystemsBuilder.store.IDE.dialog.Form');

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    layout: 'anchor',
                    items: [
                        {
                            xtype: 'combobox',
                            name: 'form',
                            fieldLabel: 'Form',
                            anchor: '0',
                            margin: '10 5 5 10',
                            labelSeparator: '',
                            valueField: 'FormID',
                            displayField: 'Name',
                            queryMode: 'local',
                            editable: false,
                            labelWidth: 60,
                            emptyText: 'Choose the form...',
                            store: formStore
                        },
                        {
                            xtype: 'textareafield',
                            name: 'description',
                            fieldLabel: 'Description',
                            anchor: '0',
                            height: 70,
                            margin: '0 5 5 10',
                            readOnly: true,
                            labelSeparator: '',
                            labelWidth: 60,
                            emptyText: 'Empty description...'
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
                                    text: 'Open',
                                    action: 'onOpen',
                                    border: true,
                                    icon: 'Scripts/resources/icons/open3.png',
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