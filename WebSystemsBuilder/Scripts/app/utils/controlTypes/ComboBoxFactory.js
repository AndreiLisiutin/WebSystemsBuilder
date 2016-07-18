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