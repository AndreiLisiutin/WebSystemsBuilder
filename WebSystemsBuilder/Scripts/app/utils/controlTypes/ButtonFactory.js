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
    },

    //----------------------------------FORM GENERATOR------------------------------------------------------------------
    //----------------------------------GENERATION----------------------------------------------------------------------
    generateVisualComponent:function(properties) {
        this._visualComponent = Ext.create(properties);
        return this._visualComponent;
    },
    getVisualComponent:function(properties) {
        return this._visualComponent;
    },
    getSelfArrayName:function(properties) {
        return 'items';
    },
    _visualComponent: null,
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