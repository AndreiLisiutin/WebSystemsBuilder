Ext.define('WebSystemsBuilder.view.main.FormList', {
    extend: 'Ext.window.Window',
    alias: 'widget.FormList',
    name: 'FormList',
    modal: true,
    constrain: true,
    title: 'Form list',

    height: 400,
    width: 700,
    minHeight: 400,
    minWidth: 700,
    layout: 'fit',

    initComponent: function () {
        var me = this;

        var formListStore = Ext.create('WebSystemsBuilder.store.main.FormList');

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    layout: 'fit',
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
                                    text: 'Edit',
                                    action: 'onEditForm',
                                    border: true,
                                    icon: 'Scripts/resources/icons/edit.png',
                                    iconAlign: 'top'
                                }
                            ]
                        }
                    ],
                    items: [
                        {
                            xtype: 'gridpanel',
                            name: 'FormListGrid',
                            store: formListStore,
                            columns: [
                                {
                                    xtype: 'rownumberer',
                                    width: 30,
                                    text: '№'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    flex: 1,
                                    text: 'Name',
                                    dataIndex: 'Name'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    flex: 3,
                                    text: 'Description',
                                    dataIndex: 'Description'
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