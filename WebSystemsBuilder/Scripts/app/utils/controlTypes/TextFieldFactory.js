Ext.define('WebSystemsBuilder.utils.controlTypes.TextFieldFactory', {
    extend: 'WebSystemsBuilder.utils.controlTypes.BaseComponentFactory',
    alternateClassName: ['TextFieldFactory'],

    onRender: function (component) { },

    createComponent: function () {
        return Ext.create('Ext.form.field.Text', {
            xtype: 'textfield',
            allowBlank: true,
            margin: '0 5 5 5',
            fieldLabel: 'My textfield',
            labelWidth: 100,
            readOnly: true,
            width: 200
        });
    },

    //----------------------------------FORM GENERATOR------------------------------------------------------------------

    //----------------------------------OPERAND-------------------------------------------------------------------------
    isOperand: function() {
        return true;
    },
    getValue: function () {
        return this._visualComponent.getValue();
    },
    setValue: function (value) {
        return this._visualComponent.setValue(value);
    },
    //----------------------------------EVENTS--------------------------------------------------------------------------
    bindLoad: function (handler) {
        this._visualComponent.on('afterrender', handler);
    },
    bindClick: function (handler) {
        this._visualComponent.on('click', handler);
    },
    bindChangeValue: function (handler) {
        this._visualComponent.on('change', handler);
    },
    //----------------------------------CLIENT ACTIONS------------------------------------------------------------------
    executeEnable: function (handler) {
        this._visualComponent.enable();
    },
    executeDisable: function (handler) {
        this._visualComponent.disable();
    },
    executeSetReadOnly: function (handler) {
        this._visualComponent.setReadOnly(true);
    },
    executeSetNotReadOnly: function (handler) {
        this._visualComponent.setReadOnly(false);
    }
});