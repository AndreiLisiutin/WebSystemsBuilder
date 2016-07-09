Ext.define('WebSystemsBuilder.controller.IDE.event.OperandExplorer', {
    extend: 'Ext.app.Controller',

    views: [
        'WebSystemsBuilder.view.IDE.event.OperandExplorer'
    ],
    models: [
        'WebSystemsBuilder.model.IDE.event.ActionHandler'
    ],
    stores: [
        'WebSystemsBuilder.store.IDE.event.ActionHandler'
    ],

    init: function () {
        this.control({
            'OperandExplorer': {
                afterrender: this.onLoad
            },
            'OperandExplorer radiofield': {
                change: this.onOperandProviderChange
            },
//            'OperandExplorer button[action=onSave]': {
//                click: this.onSave
//            },
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

//        var controlList = FormControlsIDE.getControlList();
//        control.getStore().loadData(controlList, false);
    },

    onOperandProviderChange: function(radiofield, newValue , oldValue , eOpts) {
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
    onSave: function (btn) {
        var win = btn.up('window');
        var control = win.down('combobox[name=control]');
        var clientActionType = win.down('combobox[name=clientActionType]');

        if (!control.getValue()) {
            MessageBox.error('Choose control');
            return;
        }
        if (!clientActionType.getValue()) {
            MessageBox.error('Choose action type');
            return;
        }

        var obj = {
            EventInstance: {
                Event: {
                    EventID: null,
                    EventTypeControlTypeID: null,
                    ControlID: control.getValue()
                },
                EventType: {
                    EventTypeID: null,
                    Name: null
                },
                EventTypeControlType: {
                    EventTypeControlTypeID: null,
                    EventTypeID: null,
                    ControlTypeID: null
                }
            },
            EventActions: [
                {
                    UniqueID: Random.get(),
                    ControlUniqueID: control.getValue(),
                    ActionTypeID: clientActionType.getValue(),
                    EventAction: {
                        ActionID: null,
                        ActionIDParent: null,
                        EventID: null
                    },
                    ChildActions: []
                }
            ]
        };

        win.fireEvent('ClientActionSaved', obj);
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