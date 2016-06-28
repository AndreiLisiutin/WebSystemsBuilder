Ext.define('WebSystemsBuilder.utils.controlTypes.TabFactory', {
    extend: 'WebSystemsBuilder.utils.controlTypes.BaseComponentFactory',
    alternateClassName: ['TabFactory'],

//    focusEvent: 'click',
//    getFocusEventElement: function (currentComponent) {
//        return currentComponent.tab;
//    },

    createComponent: function () {
        var component = Ext.create('Ext.panel.Panel', {
            xtype: 'panel',
            activeTab: 0,
            closable: true,
            title: 'Моя закладка',
            listeners: {
                beforeclose: function () {
                    return false;
                }
            }
        });
        component.on('afterrender', function (c) {
            if (c.tools && c.tools.length > 0) {
                c.tools.forEach(function(item) {
                    if (item.hide) item.hide();
                });
            }
        });
        return component;
    }
});