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
    }
});