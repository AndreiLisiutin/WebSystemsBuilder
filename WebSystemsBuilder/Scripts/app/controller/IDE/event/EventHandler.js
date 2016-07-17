Ext.define('WebSystemsBuilder.controller.IDE.event.EventHandler', {
    extend: 'Ext.app.Controller',

    views: [
        'WebSystemsBuilder.view.IDE.event.EventHandler'
    ],
    models: [
        'WebSystemsBuilder.model.IDE.event.EventHandler'
    ],
    stores: [
        'WebSystemsBuilder.store.IDE.event.EventHandler'
    ],

    init: function () {
        this.control({
            'EventHandler': {
                afterrender: this.onLoad
            },
            'EventHandler [action=onAddClientAction]': {
                click: this.onAddClientAction
            },
            'EventHandler [action=onAddOpenFormAction]': {
                click: this.onAddOpenFormAction
            },
            'EventHandler [action=onAddQueryAction]': {
                click: this.onAddQueryAction
            },
            'EventHandler [action=onAddPredicateAction]': {
                click: this.onAddPredicateAction
            },
            'EventHandler button[action=onDeleteAction]': {
                click: this.onDeleteAction
            },
            'EventHandler button[action=onClose]': {
                click: this.onClose
            }
        });
    },

    /**
     * Load the form (afterrender).
     * @param win Window EventHandler
     */
    onLoad: function (win) {
        var eventHandlersGrid = win.down('gridpanel[name=eventHandlersGrid]');

        var event = EventsIDE.getEventByUniqueID(win.EventUniqueID);
        if (event.EventActions) {
            eventHandlersGrid.getStore().loadData(event.EventActions, false);
        }
    },

    /**
     * Add client action as new handler
     * @param btn Button "Add"
     */
    onAddClientAction: function (btn) {
        var win = btn.up('window');
        var eventHandlersGrid = win.down('gridpanel[name=eventHandlersGrid]');

        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.event.ClientAction');
        var actionWin = WebSystemsBuilder.utils.Windows.open('ClientAction', { }, null, true);
        actionWin.on('ClientActionSaved', function (eventAction) {
            eventAction.EventUniqueID = win.EventUniqueID;
            EventsIDE.addEventAction(eventAction);
            eventHandlersGrid.getStore().add(eventAction);
            win.fireEvent('EventChanged');
        });
    },

    /**
     * Add open form action as new handler
     * @param btn Menu item "Add open form action"
     */
    onAddOpenFormAction: function (btn) {
        var win = btn.up('window');
        var eventHandlersGrid = win.down('gridpanel[name=eventHandlersGrid]');

        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.event.OpenFormAction');
        var actionWin = WebSystemsBuilder.utils.Windows.open('OpenFormAction', { }, null, true);
        actionWin.on('OpenFormActionSaved', function (eventAction) {
            eventAction.EventUniqueID = win.EventUniqueID;
            EventsIDE.addEventAction(eventAction);
            eventHandlersGrid.getStore().add(eventAction);
            win.fireEvent('EventChanged');
        });
    },

    /**
     * Add query action as new handler
     * @param btn Menu item "Add query action"
     */
    onAddQueryAction: function (btn) {
        var win = btn.up('window');
        var eventHandlersGrid = win.down('gridpanel[name=eventHandlersGrid]');

        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.query.QueryAction');
        var actionWin = WebSystemsBuilder.utils.Windows.open('QueryAction', { }, null, true);
        actionWin.on('QueryActionSaved', function (eventAction) {
            eventAction.EventUniqueID = win.EventUniqueID;
            EventsIDE.addEventAction(eventAction);
            eventHandlersGrid.getStore().add(eventAction);
            win.fireEvent('EventChanged');
        });
    },

    /**
     * Add predicate action as new handler
     * @param btn Menu item "Add predicate action"
     */
    onAddPredicateAction: function (btn) {
        var win = btn.up('window');
        var eventHandlersGrid = win.down('gridpanel[name=eventHandlersGrid]');

        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.event.PredicateAction');
        var actionWin = WebSystemsBuilder.utils.Windows.open('PredicateAction', { }, null, true);
        actionWin.on('PredicateActionSaved', function (eventAction) {
            eventAction.EventUniqueID = win.EventUniqueID;
            EventsIDE.addEventAction(eventAction);
            eventHandlersGrid.getStore().add(eventAction);
            win.fireEvent('EventChanged');
        });
    },

    /**
     * Delete client action
     * @param btn Button "Delete"
     */
    onDeleteAction: function (btn) {
        var win = btn.up('window');
        var eventHandlersGrid = win.down('gridpanel[name=eventHandlersGrid]');

        var selected = eventHandlersGrid.getSelectionModel().getSelection()[0];
        if (!selected) {
            WebSystemsBuilder.utils.MessageBox.show('Не выбрано действие.', null, -1);
        }

        var uniqueID = selected.get('UniqueID');
        EventsIDE.deleteEventAction(uniqueID);
        var record = eventHandlersGrid.getStore().findRecord('UniqueID', uniqueID);
        if (record) eventHandlersGrid.getStore().remove(record);
    },

    /**
     * Close the window
     * @param btn Button "Close"
     */
    onClose: function (btn) {
        btn.up('window').close();
    }

});