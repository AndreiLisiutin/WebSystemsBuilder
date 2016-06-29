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
    }
});