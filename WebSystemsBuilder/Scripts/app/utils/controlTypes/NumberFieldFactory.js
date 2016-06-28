Ext.define('WebSystemsBuilder.utils.controlTypes.NumberFieldFactory', {
    extend: 'WebSystemsBuilder.utils.controlTypes.BaseComponentFactory',
    alternateClassName: ['NumberFieldFactory'],

    onRender: function (component) { },

    createComponent: function () {
        var component =  Ext.create('Ext.form.field.Number', {
            xtype: 'numberfield',
            allowDecimals: false,
            maxValue: 99,
            minValue: 0,
            allowExponential: false,
            allowBlank: true,
            margin: '0 5 5 5',
            fieldLabel: 'Мое число',
            labelWidth: 100,
            keyNavEnabled: false,
            mouseWheelEnabled: false,
            labelSeparator: ':',
            readOnly: true,
            width: 200
        });
        component.on('afterrender', function(c) {
            c.triggerCell.show();
        });
        return component;
    }
});