Ext.define('WebSystemsBuilder.controller.IDE.event.EventAction', {
    extend: 'Ext.app.Controller',

    views: [
        'WebSystemsBuilder.view.IDE.event.EventAction'
    ],
    models: [
        'WebSystemsBuilder.model.IDE.event.EventAction'
    ],
    stores: [
        'WebSystemsBuilder.store.IDE.event.EventAction'
    ],

    init: function () {
        this.control({
            'EventAction': {
                afterrender: this.onLoad
            },
            'EventAction [action=onAddClientAction]': {
                click: this.onAddClientAction
            },
            'EventAction [action=onAddOpenFormAction]': {
                click: this.onAddOpenFormAction
            },
            'EventAction [action=onAddQueryAction]': {
                click: this.onAddQueryAction
            },
            'EventAction button[action=onDeleteAction]': {
                click: this.onDeleteAction
            },
            'EventAction button[action=onClose]': {
                click: this.onClose
            }
        });
    },

    /**
     * Load the form (afterrender).
     * @param win Window EventAction
     */
    onLoad: function (win) {
        var actionGrid = win.down('gridpanel[name=actionGrid]');

        if (win.actions) {
            actionGrid.getStore().loadData(win.actions, false);
        }
    },

    /**
     * Add client action as new handler
     * @param btn Button "Add"
     */
    onAddClientAction: function (btn) {
        var win = btn.up('window');
        var actionGrid = win.down('gridpanel[name=actionGrid]');

        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.event.ClientAction');
        var actionWin = WebSystemsBuilder.utils.Windows.open('ClientAction', { }, null, true);
        actionWin.on('ClientActionSaved', function (obj) {
            actionGrid.getStore().add(obj);
            win.fireEvent('EventChanged');
        });
    },

    /**
     * Add open form action as new handler
     * @param btn Menu item "Add open form action"
     */
    onAddOpenFormAction: function (btn) {
        var win = btn.up('window');
        var actionGrid = win.down('gridpanel[name=actionGrid]');

        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.event.OpenFormAction');
        var actionWin = WebSystemsBuilder.utils.Windows.open('OpenFormAction', { }, null, true);
        actionWin.on('OpenFormActionSaved', function (obj) {
            actionGrid.getStore().add(obj);
            win.fireEvent('EventChanged');
        });
    },

    /**
     * Add query action as new handler
     * @param btn Menu item "Add query action"
     */
    onAddQueryAction: function (btn) {
        var win = btn.up('window');
        var actionGrid = win.down('gridpanel[name=actionGrid]');

        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.query.CreateQuery');
        var actionWin = WebSystemsBuilder.utils.Windows.open('CreateQuery', { }, null, true);

    },

    /**
     * Delete client action
     * @param btn Button "Delete"
     */
    onDeleteAction: function (btn) {
        var win = btn.up('window');
        var actionGrid = win.down('gridpanel[name=actionGrid]');

        var selected = actionGrid.getSelectionModel().getSelection()[0];
        if (!selected) {
            WebSystemsBuilder.utils.MessageBox.show('Не выбрано действие.', null, -1);
        }

        var record = actionGrid.getStore().findRecord('ID', selected.get('ID'));
        if (record) actionGrid.getStore().remove(record);
    },

    /**
     * Close the window
     * @param btn Button "Close"
     */
    onClose: function (btn) {
        btn.up('window').close();
    }

});