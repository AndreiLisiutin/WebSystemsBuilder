Ext.define('WebSystemsBuilder.view.IDE.dialog.FormParametersExplorer', {
    extend: 'Ext.window.Window',
    alias: 'widget.FormParametersExplorer',
    name: 'FormParametersExplorer',

    modal: true,
    constrain: true,

    height: 150,
    width: 450,
    minHeight: 150,
    minWidth: 450,
    maxHeight: 150,
    maxWidth: 450,

    title:'Form parameter',

    layout: {
        type: 'fit'
    },

    FormID: null,
    UniqueID: null,

    initComponent: function () {
        var me = this;

        var valueTypeStore = Ext.create('WebSystemsBuilder.store.common.ValueType');

        Ext.applyIf(me, {
            items: [
                {
                    xtype:'panel',
                    layout:'anchor',
                    items:[
                        {
                            xtype: 'textfield',
                            name: 'parameterName',
                            anchor: '0',
                            margin: '10 5 5 5',
                            labelSeparator:'',
                            fieldLabel: 'Name',
                            labelWidth: 40,
                            emptyText: 'Type parameter name...'
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: 'Type',
                            labelWidth: 40,
                            name: 'type',
                            anchor: '0',
                            margin: '5 5 5 5',
                            labelSeparator: '',
                            valueField: 'ValueTypeID',
                            displayField: 'Name',
                            queryMode: 'local',
                            editable: false,
                            emptyText: 'Type parameter type...',
                            store: valueTypeStore
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
                                    text: 'Save',
                                    action: 'onSave',
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