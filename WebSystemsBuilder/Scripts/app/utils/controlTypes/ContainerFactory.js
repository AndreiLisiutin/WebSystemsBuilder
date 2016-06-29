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
    }
});