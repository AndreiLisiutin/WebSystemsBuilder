Ext.define('WebSystemsBuilder.view.IDE.query.QueryActionColumn', {
    extend: 'Ext.window.Window',
    alias: 'widget.QueryActionColumn',
    name: 'QueryActionColumn',

    modal: true,
    constrain: true,
    title: 'Columns',

    height: 140,
    width: 600,
    minHeight: 140,
    minWidth: 600,
    maxWidth: 600,
    maxHeight: 140,

    layout: 'fit',

    initComponent: function () {
        var me = this;

        var dictionaryStore = Ext.create('WebSystemsBuilder.store.IDE.query.Dictionary');
        var fieldStore = Ext.create('WebSystemsBuilder.store.IDE.query.Field');

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
                            xtype: 'fieldset',
                            anchor: '0 0',
                            margin: 5,
                            padding: 2,
                            title: 'New column',
                            items: [
                                {
                                    xtype: 'combobox',
                                    name: 'dataTable',
                                    fieldLabel: 'Data table',
                                    anchor: '0',
                                    margin: '5 5 5 5',
                                    labelSeparator: '',
                                    valueField: 'TableID',
                                    displayField: 'Name',
                                    queryMode: 'local',
                                    editable: false,
                                    labelWidth: 55,
                                    store: dictionaryStore
                                },
                                {
                                    xtype: 'combobox',
                                    name: 'column',
                                    fieldLabel: 'Column',
                                    anchor: '0',
                                    margin: '5 5 5 5',
                                    labelSeparator: '',
                                    valueField: 'ColumnID',
                                    displayField: 'Name',
                                    queryMode: 'local',
                                    editable: false,
                                    labelWidth: 55,
                                    store: fieldStore
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