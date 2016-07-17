Ext.define('WebSystemsBuilder.controller.IDE.event.ClientAction', {
    extend: 'Ext.app.Controller',

    views: [
        'WebSystemsBuilder.view.IDE.event.ClientAction'
    ],
    models: [
        'WebSystemsBuilder.model.IDE.event.ActionHandler'
    ],
    stores: [
        'WebSystemsBuilder.store.IDE.event.ActionHandler'
    ],

    init: function () {
        this.control({
            'ClientAction': {
                afterrender: this.onLoad
            },
            'ClientAction button[action=onSave]': {
                click: this.onSave
            },
            'ClientAction button[action=onClose]': {
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

        var actionType = WebSystemsBuilder.utils.mapping.ActionTypes.Client;
        var clientAction = {
            UniqueID: RandomIDE.get(),
            ActionTypeID: actionType,
            EventActionType: ActionTypes.getActionTypeName(actionType),
            EventAction: {
                ActionID: null,
                ActionIDParent: null,
                EventID: null
            },
            ChildActions: [],
            ClientAction: {
                ActionID: null,
                ControlID: null,
                ClientActionTypeControlTypeID: clientActionType.getValue(),
                ControlUniqueID: control.getValue(),
                Control: {
                    UniqueID: control.getValue(),
                    Name: control.getRawValue(),
                    componentInfo: control.getStore().findRecord('UniqueID', control.getValue()).get('componentInfo')
                },
                ActionType: {
                    ActionTypeID: clientActionType.getValue(),
                    Name: clientActionType.getRawValue()
                }
            }
        };

        win.fireEvent('ClientActionSaved', clientAction);
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