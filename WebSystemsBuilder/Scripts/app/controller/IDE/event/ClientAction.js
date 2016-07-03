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

        var obj = {
            UniqueID: Random.get(),
            ControlUniqueID: control.getValue(),
            ClientActionTypeID: clientActionType.getValue(),
            ClientActionType: clientActionType.getRawValue()
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