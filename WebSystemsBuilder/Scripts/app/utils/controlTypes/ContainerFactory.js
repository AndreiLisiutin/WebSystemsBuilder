Ext.define('WebSystemsBuilder.utils.controlTypes.ContainerFactory', {
    extend: 'WebSystemsBuilder.utils.controlTypes.BaseComponentFactory',
    alternateClassName: ['ContainerFactory'],

    layout: 'hbox',

    createComponent: function () {
        var _this = this;
        return Ext.create('Ext.container.Container', {
            xtype: 'container',
            margin: 5,
            padding: 2,
            border: 1,
            style: {
                borderColor: '#dfe8f6',
                borderStyle: 'solid',
                borderWidth: '1px'
            },
            layout: {
                type: _this.layout || 'hbox'
            },
            width: 200,
            height: 100,
            resizable: true
        });
    },

    //----------------------------------FORM GENERATOR------------------------------------------------------------------
    generateVisualComponent: function (properties) {
        var _this = this;
        properties.layout = properties.layout || {
            type: _this.layout
        };
        var visualComponent = Ext.create(properties);
        return visualComponent;
    },
    //----------------------------------EVENTS--------------------------------------------------------------------------
    bindLoad: function (handler) {
        this._visualComponent.on('afterrender', handler);
    },
    bindClick: function (handler) {
        this._visualComponent.on('click', handler);
    },
//----------------------------------CLIENT ACTIONS------------------------------------------------------------------
    executeEnable: function (handler) {
        this._visualComponent.enable();
    },
    executeDisable: function (handler) {
        this._visualComponent.disable();
    }
});