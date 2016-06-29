Ext.define('WebSystemsBuilder.utils.controlTypes.PanelFactory', {
    extend: 'WebSystemsBuilder.utils.controlTypes.BaseComponentFactory',
    alternateClassName: ['PanelFactory'],

    createComponent: function () {
        var component = Ext.create('Ext.panel.Panel', {
            xtype: 'panel',
            width: 200,
            height: 200,
            minWidth: 200,
            minHeight: 200,
            margin: 5,
            resizable: true,
            mainWindow: false,
            closable: false,
            collapsible: true,
            title: 'Моя панель',
            layout: 'anchor',
            tools: [
                {
                    type: 'minimize',
                    tooltip: 'Свернуть',
                    handler: function () {
                        return false;
                    }
                },
                {
                    type: 'maximize',
                    tooltip: 'Развернуть',
                    handler: function () {
                        return false;
                    }
                },
                {
                    type: 'close',
                    tooltip: 'Закрыть',
                    handler: function () {
                        return false;
                    }
                }
            ]
        });
        component.on('afterrender', function(c) {
            c.tools['collapse-top'].hide();
            c.tools['close'].hide();
            c.tools['maximize'].hide();
            c.tools['minimize'].hide();
        });
        return component;
    },

    getMouseEventsElement: function (currentComponent) {
        return currentComponent.body || currentComponent;
    }
});