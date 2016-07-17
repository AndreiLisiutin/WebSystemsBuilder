Ext.define('WebSystemsBuilder.view.IDE.query.QueryActionColumn', {
    extend: 'Ext.window.Window',
    alias: 'widget.QueryActionColumn',
    name: 'QueryActionColumn',

    modal: true,
    constrain: true,
    title: 'Columns',

    height: 170,
    width: 400,
    minHeight: 170,
    minWidth: 400,
    maxWidth: 400,
    maxHeight: 170,

    layout: 'fit',

    initComponent: function () {
        var me = this;

        var dictionaryStore = Ext.create('WebSystemsBuilder.store.IDE.query.Dictionary');
        var fieldStore = Ext.create('WebSystemsBuilder.store.IDE.query.Field');
        var controlStore = Ext.create('WebSystemsBuilder.store.IDE.event.Control');

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
                                },
                                {
                                    xtype: 'combobox',
                                    name: 'control',
                                    disabled: false,
                                    margin: '5 5 5 5',
                                    anchor: '0',
                                    labelSeparator: '',
                                    fieldLabel: 'Control',
                                    labelWidth: 55,
                                    valueField: 'UniqueID',
                                    displayField: 'Name',
                                    queryMode: 'local',
                                    editable: false,
                                    store: controlStore
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