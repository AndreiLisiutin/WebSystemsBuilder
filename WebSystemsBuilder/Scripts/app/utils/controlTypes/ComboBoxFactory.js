Ext.define('WebSystemsBuilder.utils.controlTypes.ComboBoxFactory', {
    extend: 'WebSystemsBuilder.utils.controlTypes.BaseComponentFactory',
    alternateClassName: ['ComboBoxFactory'],

    onRender: function (component) { },

    createComponent: function () {
        return Ext.create('Ext.form.field.ComboBox', {
            xtype: 'combobox',
            margin: '5 5 0 5',
            valueField: 'key',
            displayField: 'value',
            queryMode: 'local',
            editable: false,
            fieldLabel: 'My combobox',
            labelWidth: 100,
            emptyText: 'My combobox...',
            width: 300,
            //второй триггер очистки комбобокса
            trigger2Cls: 'x-form-clear-trigger',
            listeners: {
                onTrigger2Click: function () {
                    var me = this;
                    me.clearValue();
                }
            }
        });
    }
});