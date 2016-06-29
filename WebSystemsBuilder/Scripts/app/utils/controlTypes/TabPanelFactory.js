Ext.define('WebSystemsBuilder.utils.controlTypes.TabPanelFactory', {
    extend: 'WebSystemsBuilder.utils.controlTypes.BaseComponentFactory',
    alternateClassName: ['TabPanelFactory'],

    createComponent: function () {
        return Ext.create('Ext.tab.Panel', {
            xtype: 'tabpanel',
            activeTab: 0,
            width: 300,
            height: 200,
            minWidth: 200,
            minHeight: 200,
            resizable: true,
            closable: false,
            collapsible: true,
            title: 'Моя панель с закладками'
        });
    }
});