Ext.define('WebSystemsBuilder.utils.controlTypes.WindowFactory', {
    extend: 'WebSystemsBuilder.utils.controlTypes.BaseComponentFactory',
    alternateClassName: ['WindowFactory'],

    createComponent: function () {
        var component = Ext.create('Ext.panel.Panel', {
            xtype: 'window',
            width: 500,
            height: 300,
            minWidth: 200,
            maxWidth: 1000,
            minHeight: 200,
            maxHeight: 1000,
            margin: 5,
            resizable: true,
            draggable: false,
            constrain: true,
            layout: 'anchor',
            mainWindow: true,
            closable: false,
            collapsible: true,
            title: 'My window',
            items: [],
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
        });
        return component;
    },

    //----------------------------------FORM GENERATOR------------------------------------------------------------------

    //----------------------------------EVENTS--------------------------------------------------------------------------
    bindLoad: function (handler) {
        this._visualComponent.on('afterrender', handler);
    },
    bindClick: function (handler) {
        this._visualComponent.on('click', handler);
    },
    bindClose: function (handler) {
        this._visualComponent.on('close', handler);
    },
    //----------------------------------CLIENT ACTIONS------------------------------------------------------------------
});