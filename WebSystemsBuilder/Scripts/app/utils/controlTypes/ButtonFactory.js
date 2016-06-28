Ext.define('WebSystemsBuilder.utils.controlTypes.ButtonFactory', {
    extend: 'WebSystemsBuilder.utils.controlTypes.BaseComponentFactory',
    alternateClassName: ['ButtonFactory'],

    /**
     * "Render" event handler
     * @override
     */
    onRender: function(component) { },

    /**
     * Create button
     * @override
     * @returns {Ext.button.Button} Created button instance
     */
    createComponent: function() {
        return Ext.create('Ext.button.Button', {
            xtype: 'button',
            scale: 'small',
            border: true,
            icon: 'Scripts/resources/icons/save_16.png',
            padding: 2,
            margin: 5,
            text: 'Моя кнопка'
        });
    }
});