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
    executeEnable: function (handler) {
        this._visualComponent.enable();
    },
    executeDisable: function (handler) {
        this._visualComponent.disable();
    },
});