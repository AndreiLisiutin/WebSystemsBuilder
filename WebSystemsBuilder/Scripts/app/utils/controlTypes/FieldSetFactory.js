Ext.define('WebSystemsBuilder.utils.controlTypes.FieldSetFactory', {
    extend: 'WebSystemsBuilder.utils.controlTypes.BaseComponentFactory',
    alternateClassName: ['FieldSetFactory'],

    createComponent: function () {
        var component = Ext.create('Ext.form.FieldSet', {
            xtype: 'fieldset',
            margin: 5,
            padding: 2,
            collapsible: true,
            title: 'Моя группа',
            width: 200,
            height: 100,
            resizable: true
        });
        component.on('afterrender', function(c) {
            c.toggleCmp.hide();
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
    //----------------------------------CLIENT ACTIONS------------------------------------------------------------------
    executeEnable: function (handler) {
        this._visualComponent.enable();
    },
    executeDisable: function (handler) {
        this._visualComponent.disable();
    }
});