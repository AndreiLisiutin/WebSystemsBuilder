Ext.define('WebSystemsBuilder.utils.controlTypes.TextFieldFactory', {
    extend: 'WebSystemsBuilder.utils.controlTypes.BaseComponentFactory',
    alternateClassName: ['TextFieldFactory'],

    onRender: function (component) {
    },

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
    isOperand: function () {
        return true;
    },
    getValue: function () {
        return this.getVisualComponent().getValue();
    },
    setValue: function (value) {
        return this.getVisualComponent().setValue(value);
    },
    //----------------------------------EVENTS--------------------------------------------------------------------------
    bindLoad: function (handler) {
        this.getVisualComponent().on('afterrender', handler);
    },
    bindClick: function (handler) {
        this.getVisualComponent().on('click', handler);
    },
    bindChangeValue: function (handler) {
        this.getVisualComponent().on('change', handler);
    },
    //----------------------------------CLIENT ACTIONS------------------------------------------------------------------
    executeEnable: function (handler) {
        this.getVisualComponent().enable();
    },
    executeDisable: function (handler) {
        this.getVisualComponent().disable();
    },
    executeSetReadOnly: function (handler) {
        this.getVisualComponent().setReadOnly(true);
    },
    executeSetNotReadOnly: function (handler) {
        this.getVisualComponent().setReadOnly(false);
    }
});