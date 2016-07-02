Ext.define('WebSystemsBuilder.utils.controlTypes.DateFieldFactory', {
    extend: 'WebSystemsBuilder.utils.controlTypes.BaseComponentFactory',
    alternateClassName: ['DateFieldFactory'],

    onRender: function (component) { },

    createComponent: function () {
        var component = Ext.create('Ext.form.field.Date', {
            xtype: 'datefield',
            allowBlank: true,
            margin: '0 5 5 5',
            fieldLabel: 'Моя дата',
            labelWidth: 100,
            labelSeparator: '',
            value: new Date(),
            format: 'd.m.Y',
            submitFormat: 'Y-m-dTH:i:s',
            width: 195,
            readOnly: true
        });
        component.on('afterrender', function(c) {
            c.triggerCell.show();
        });
        return component;
    },

    //----------------------------------FORM GENERATOR------------------------------------------------------------------
    //----------------------------------OPERAND-------------------------------------------------------------------------
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