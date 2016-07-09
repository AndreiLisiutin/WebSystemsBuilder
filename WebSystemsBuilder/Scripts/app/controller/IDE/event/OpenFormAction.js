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
            'OpenFormAction button[action=onSave]': {
                click: this.onSave
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
        var control = win.down('combobox[name=control]');
        var clientActionType = win.down('combobox[name=clientActionType]');

        var controlList = FormControlsIDE.getControlList();
        control.getStore().loadData(controlList, false);

        clientActionType.getEl().mask('Loading...');
        clientActionType.getStore().load({
            callback: function () {
                clientActionType.getEl().unmask();
            }
        });
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