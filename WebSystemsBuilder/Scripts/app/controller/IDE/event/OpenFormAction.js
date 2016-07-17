Ext.define('WebSystemsBuilder.controller.IDE.event.OpenFormAction', {
    extend: 'Ext.app.Controller',

    views: [
        'WebSystemsBuilder.view.IDE.event.OpenFormAction'
    ],
    models: [
        'WebSystemsBuilder.model.IDE.event.OpenFormAction',
        'WebSystemsBuilder.model.IDE.dialog.OpenFormDialog'
    ],
    stores: [
        'WebSystemsBuilder.store.IDE.event.OpenFormAction',
        'WebSystemsBuilder.store.IDE.dialog.OpenFormDialog'
    ],

    init: function () {
        this.control({
            'OpenFormAction': {
                afterrender: this.onLoad
            },
            'OpenFormAction combobox[name=Form]': {
                change: this.onFormChange
            },
            'OpenFormAction button[action=onSave]': {
                click: this.onSave
            },
            'OpenFormAction button[action=onSetFormParameter]': {
                click: this.onSetFormParameter
            },
            'OpenFormAction button[action=onClose]': {
                click: this.onClose
            }
        });
    },

    /**
     * Load the form (afterrender).
     * @param win ClientAction Window
     */
    onLoad: function (win) {
        var form = win.down('combobox[name=Form]');
        var formParametersGrid = win.down('gridpanel[name=FormParametersGrid]');

        form.getEl().mask();
        form.getStore().load({
            callback: function () {
                form.getEl().unmask();
            }
        });
    },

    /**
     * Change form - show all parameters of chosen form
     * @param combo
     */
    onFormChange: function (combo) {
        var win = combo.up('window');
        var form = win.down('combobox[name=Form]');
        var formParametersGrid = win.down('gridpanel[name=FormParametersGrid]');

        if (!form.getValue()) {
            formParametersGrid.loadData([], false);
            return;
        }

        formParametersGrid.getStore().load({
            params: {
                formID: form.getValue()
            }
        });
    },

    /**
     * Set chosen form parameter
     * @param btn
     */
    onSetFormParameter: function (btn) {
        var win = btn.up('window');
        var form = win.down('combobox[name=Form]');
        var formParametersGrid = win.down('gridpanel[name=FormParametersGrid]');

        var selectedFormParameter = formParametersGrid.getSelectionModel().getSelection()[0];
        if (!selectedFormParameter) {
            MessageBox.error('Form parameter has not chosen');
            return;
        }

        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.event.OperandExplorer');
        var operandWin = WebSystemsBuilder.utils.Windows.open('OperandExplorer');
        operandWin.on('OperandChosen', function (operand) {
            if (operand.Parameter) {

            }
            selectedFormParameter.set('Operand', operand);
        }, this, { single: true })
    },

    /**
     * Save function
     * @param btn Button "Save"
     */
    onSave: function (btn) {
        var win = btn.up('window');
        var form = win.down('combobox[name=Form]');
        var formParametersGrid = win.down('gridpanel[name=FormParametersGrid]');

        if (!form.getValue()) {
            MessageBox.error('Choose form to open');
            return;
        }
        var formParameterError = '';
        var formParametersList = [];
        formParametersGrid.getStore().getRange().forEach(function (currentParameter) {
            var operand = currentParameter.get('Operand');
            if (!operand) {
                formParameterError = 'Form parameter "' + currentParameter.get('Name') + '" has not chosen';
            } else {
                var parameter = operand.Parameter;
                formParametersList.push({
                    OpenFormActionParameterID: null,
                    FormParameterID: currentParameter.get('FormParameterID'),
                    OperandIDValue: null,
                    OpenFormActionID: null,
                    OperandUniqueID: parameter ? parameter.UniqueID : null,
                    Name: currentParameter.get('Name'),
                    Value: currentParameter.get('Operand')
                });
            }
        });
        if (formParameterError) {
            MessageBox.error(formParameterError);
            return;
        }

        var actionType = ActionTypes.OpenForm;
        var obj = {
            UniqueID: RandomIDE.get(),
            ActionTypeID: actionType,
            EventAction: {
                ActionID: null,
                ActionIDParent: null,
                EventID: null
            },
            EventActionType: ActionTypes.getActionTypeName(actionType),
            ChildActions: [],
            OpenFormAction: {
                OpenFormAction: {
                    ActionID: null,
                    FormID: form.getValue(),
                    Form: {
                        FormID: form.getValue(),
                        Name: form.getRawValue()
                    }
                },
                OpenFormActionParameters: formParametersList
            }
        };

        win.fireEvent('OpenFormActionSaved', obj);
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