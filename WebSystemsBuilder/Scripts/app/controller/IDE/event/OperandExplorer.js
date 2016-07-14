Ext.define('WebSystemsBuilder.controller.IDE.event.OperandExplorer', {
    extend: 'Ext.app.Controller',

    views: [
        'WebSystemsBuilder.view.IDE.event.OperandExplorer'
    ],
    models: [
        'WebSystemsBuilder.model.IDE.event.ActionHandler',
        'WebSystemsBuilder.model.IDE.MainIDE'
    ],
    stores: [
        'WebSystemsBuilder.store.IDE.event.ActionHandler',
        'WebSystemsBuilder.store.IDE.MainIDE'
    ],

    init: function () {
        this.control({
            'OperandExplorer': {
                afterrender: this.onLoad
            },
            'OperandExplorer radiofield': {
                change: this.onOperandProviderChange
            },
            'OperandExplorer button[action=onChoose]': {
                click: this.onChoose
            },
            'OperandExplorer button[action=onClose]': {
                click: this.onClose
            }
        });
    },

    /**
     * Load the form (afterrender).
     * @param win OperandExplorer Window
     */
    onLoad: function (win) {
        var controlRadioField = win.down('radiofield[id=ControlValueProvider]');
        var formParameterRadioField = win.down('radiofield[id=FormParameterValueProvider]');
        var constantRadioField = win.down('radiofield[id=ConstantValueProvider]');
        var control = win.down('combobox[name=control]');
        var formParameter = win.down('combobox[name=formParameter]');
        var constant = win.down('combobox[name=constant]');
        var controlContainer = win.down('container[name=ControlContainer]');
        var parameterContainer = win.down('container[name=ParameterContainer]');
        var constantContainer = win.down('container[name=ConstantContainer]');

        // Show/hide radios
        controlContainer.setVisible(!win.hideControl);
        parameterContainer.setVisible(!win.hideFormParameter);
        constantContainer.setVisible(!win.hideConstant);

        // Set default radiobutton
        if (!win.hideControl) {
            controlRadioField.setValue(true);
        } else if (!win.hideFormParameter) {
            formParameterRadioField.setValue(true);
        } else if (!win.hideConstant) {
            constantRadioField.setValue(true);
        }

        // Load stores
        var controlList = FormControlsIDE.getControlList();
        control.getStore().loadData(controlList, false);

        var formParametersList = FormParametersIDE.getFormParameters();
        formParameter.getStore().loadData(formParametersList, false);
    },

    onOperandProviderChange: function (radiofield, newValue, oldValue, eOpts) {
        var win = radiofield.up('window');
        var controlRadioField = win.down('radiofield[id=ControlValueProvider]');
        var formParameterRadioField = win.down('radiofield[id=FormParameterValueProvider]');
        var constantRadioField = win.down('radiofield[id=ConstantValueProvider]');
        var control = win.down('combobox[name=control]');
        var formParameter = win.down('combobox[name=formParameter]');
        var constant = win.down('combobox[name=constant]');

        control.setDisabled(!controlRadioField.getValue());
        formParameter.setDisabled(!formParameterRadioField.getValue());
        constant.setDisabled(!constantRadioField.getValue());
    },

    /**
     * Save function
     * @param btn Button "Save"
     */
    onChoose: function (btn) {
        var win = btn.up('window');
        var controlRadioField = win.down('radiofield[id=ControlValueProvider]');
        var formParameterRadioField = win.down('radiofield[id=FormParameterValueProvider]');
        var constantRadioField = win.down('radiofield[id=ConstantValueProvider]');
        var control = win.down('combobox[name=control]');
        var formParameter = win.down('combobox[name=formParameter]');
        var constant = win.down('combobox[name=constant]');

        var obj = {
            IsControl: controlRadioField.getValue(),
            IsFormParameter: formParameterRadioField.getValue(),
            IsConstant: constantRadioField.getValue(),
            Control: {
                UniqueID: control.getValue(),
                Name: control.getRawValue()
            },
            FormParameter: {
                UniqueID: formParameter.getValue(),
                Name: formParameter.getRawValue(),
                FormParameter: formParameter.getValue() ? formParameter.findRecordByValue(formParameter.getValue()).get('FormParameter') : null,
                PropertyValueType: formParameter.getValue() ? formParameter.findRecordByValue(formParameter.getValue()).get('PropertyValueType') : null,
            },
            Constant: constant.getValue(),
            Value: null,
            Name: null
        };

        if (!obj.IsControl && !obj.IsFormParameter && !obj.IsConstant) {
            MessageBox.error('Operand has not chosen');
            return;
        }
        if (obj.IsControl) {
            if (!obj.Control) {
                MessageBox.error('Control has not chosen');
                return;
            }
            obj.Value = control.getValue();
            obj.Name = control.getRawValue();
        }
        if (obj.IsFormParameter) {
            if (!obj.FormParameter) {
                MessageBox.error('Form parameter has not chosen');
                return;
            }
            obj.Value = formParameter.getValue();
            obj.Name = formParameter.getRawValue();
        }
        if (obj.IsConstant) {
            if (!obj.Constant) {
                MessageBox.error('Constant has not chosen');
                return;
            }
            obj.Value = constant.getValue();
            obj.Name = constant.getValue();
        }

        win.fireEvent('OperandChosen', obj);
        win.close();
    },

    /**
     * Close the window
     * @param btn Button "Close"
     */
    onClose: function (btn) {
        btn.up('window').close();
    }

});