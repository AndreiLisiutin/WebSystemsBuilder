Ext.define('WebSystemsBuilder.controller.IDE.dialog.FormParametersExplorer', {
    extend: 'Ext.app.Controller',

    views: [
        'WebSystemsBuilder.view.IDE.dialog.FormParametersExplorer'
    ],
    models: [
        'WebSystemsBuilder.model.common.ValueType'
    ],
    stores: [
        'WebSystemsBuilder.store.common.ValueType'
    ],

    init: function () {
        this.control({
            'FormParametersExplorer': {
                afterrender: this.onLoad
            },
            'FormParametersExplorer button[action=onSave]': {
                click: this.onSave
            },
            'FormParametersExplorer button[action=onClose]': {
                click: this.onClose
            }
        });
    },

    /**
     * Load form (afterrender).
     * @param win Window
     */
    onLoad: function (win) {
        var type = win.down('combobox[name=type]');
        var parameterName = win.down('textfield[name=parameterName]');

        var loadTypeCombo = function (valueTypeID) {
            type.getEl().mask('Loading...');
            type.getStore().load({
                callback: function () {
                    type.getEl().unmask();
                    if (valueTypeID) {
                        type.setValue(valueTypeID);
                    }
                }
            });
        };

        if (win.UniqueID > 0) {
            var param = FormParametersIDE.getParameterByID(win.UniqueID);
            parameterName.setValue(param.Name);
            loadTypeCombo(param.ValueTypeID);
            type.setReadOnly(true);
        } else {
            loadTypeCombo();
        }
    },

    /**
     * Save form parameter (Button click)
     * @param btn Button "Save"
     */
    onSave: function (btn) {
        var win = btn.up('window');
        var type = win.down('combobox[name=type]');
        var parameterName = win.down('textfield[name=parameterName]');

        if (!parameterName.getValue()) {
            var error = 'Type parameter name.';
            MessageBox.error(error);
            return;
        }
        if (!type.getValue()) {
            var error = 'Type parameter value type.';
            MessageBox.error(error);
            return;
        }
        var error = FormParametersIDE._checkParameterName(parameterName.getValue(), win.UniqueID);
        if (error) {
            MessageBox.error(error);
            return;
        }

        var parameter = {
            Name: parameterName.getValue(),
            ValueTypeID: type.getValue(),
            ValueType: type.getRawValue(),
            UniqueID: win.UniqueID
        };
        var saveSuccess = false;
        if (win.UniqueID > 0) {
            saveSuccess = FormParametersIDE.editParameter(parameter);
        } else {
            saveSuccess = FormParametersIDE.addParameter(parameter);
        }
        if (!saveSuccess) {
            MessageBox.error('Form parameter save error');
            return;
        }
        win.fireEvent('FormParameterSaved', parameter);
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