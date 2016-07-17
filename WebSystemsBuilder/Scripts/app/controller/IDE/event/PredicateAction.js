Ext.define('WebSystemsBuilder.controller.IDE.event.PredicateAction', {
    extend: 'Ext.app.Controller',

    views: [
        'WebSystemsBuilder.view.IDE.event.PredicateAction'
    ],

    init: function () {
        this.control({
            'PredicateAction': {
                afterrender: this.onLoad
            },
            'PredicateAction button[action=onSetFirstPart]': {
                click: this.onSetFirstPart
            },
            'PredicateAction button[action=onSetSecondPart]': {
                click: this.onSetSecondPart
            },
            'PredicateAction button[action=onSetTrueAction]': {
                click: this.onSetTrueAction
            },
            'PredicateAction button[action=onSetFalseAction]': {
                click: this.onSetFalseAction
            },
            'PredicateAction button[action=onClose]': {
                click: this.onClose
            },
            'PredicateAction button[action=onSave]': {
                click: this.onSave
            }
        });
    },

    /**
     * Load the form (afterrender).
     * @param win PredicateAction Window
     */
    onLoad: function (win) {
        var firstPart = win.down('textfield[name=firstPart]');
        var secondPart = win.down('textfield[name=secondPart]');
        var falseActionType = win.down('combobox[name=falseActionType]');
        var trueActionType = win.down('combobox[name=trueActionType]');
        var falseAction = win.down('textfield[name=falseAction]');
        var trueAction = win.down('textfield[name=trueAction]');
        var conditionSign = win.down('combobox[name=conditionSign]');

    },

    onSetFirstPart: function (btn) {
        var win = btn.up('window');
        var firstPart = win.down('textfield[name=firstPart]');
        this.onSetConditionPart(firstPart);
    },

    onSetSecondPart: function (btn) {
        var win = btn.up('window');
        var secondPart = win.down('textfield[name=secondPart]');
        this.onSetConditionPart(secondPart);
    },

    /**
     * Set condition part by Operand
     * @param conditionPart
     */
    onSetConditionPart: function (conditionPart) {
        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.event.OperandExplorer');
        var newColumnWin = WebSystemsBuilder.utils.Windows.open('OperandExplorer', {
            hideConstant: false
        });
        newColumnWin.on('OperandChosen', function (operand) {
            conditionPart.Operand = operand;
            conditionPart.setValue(operand.Name);
        }, this, {single: true});
    },

    onSetTrueAction: function(btn) {
        var win = btn.up('window');
        var trueAction = win.down('textfield[name=trueAction]');
        var trueActionType = win.down('combobox[name=trueActionType]');
        this.onSetAction(trueAction, trueActionType);
    },
    onSetFalseAction: function(btn) {
        var win = btn.up('window');
        var falseAction = win.down('textfield[name=falseAction]');
        var falseActionType = win.down('combobox[name=falseActionType]');
        this.onSetAction(falseAction, falseActionType);
    },

    /**
     * Set action
     */
    onSetAction: function (action, actionType) {
        if (!actionType.getValue()) {
            MessageBox.error('Choose action type');
            return;
        }

        var controller;
        var winType;
        var saveEvent;
        switch (actionType.getValue()) {
            case  ActionTypes.Client:
                controller = 'WebSystemsBuilder.controller.IDE.event.ClientAction';
                winType = 'ClientAction';
                saveEvent = 'ClientActionSaved';
                break;
            case  ActionTypes.OpenForm:
                controller = 'WebSystemsBuilder.controller.IDE.event.OpenFormAction';
                winType = 'OpenFormAction';
                saveEvent = 'OpenFormActionSaved';
                break;
            case  ActionTypes.Predicate:
                controller = 'WebSystemsBuilder.controller.IDE.event.PredicateAction';
                winType = 'PredicateAction';
                saveEvent = 'PredicateActionSaved';
                break;
            case  ActionTypes.Query:
                controller = 'WebSystemsBuilder.controller.IDE.query.QueryAction';
                winType = 'QueryAction';
                saveEvent = 'QueryActionSaved';
                break;
        }

        WebSystemsBuilder.utils.ControllerLoader.load(controller);
        var newActionWin = WebSystemsBuilder.utils.Windows.open(winType);
        newActionWin.on(saveEvent, function (eventAction) {
            action.Action = eventAction;
            action.setValue(eventAction.EventActionType);
        }, this, {single: true});
    },

    /**
     * Save function
     * @param btn Button "Save"
     */
    onSave: function (btn) {
        var win = btn.up('window');
        var firstPart = win.down('textfield[name=firstPart]');
        var secondPart = win.down('textfield[name=secondPart]');
        var trueAction = win.down('textfield[name=trueAction]');
        var falseActionType = win.down('combobox[name=falseActionType]');
        var trueActionType = win.down('combobox[name=trueActionType]');
        var falseAction = win.down('textfield[name=falseAction]');
        var conditionSign = win.down('combobox[name=conditionSign]');

        if (!firstPart.getValue()) {
            MessageBox.error('Choose first part of condition');
            return;
        }
        if (!secondPart.getValue()) {
            MessageBox.error('Choose second part of condition');
            return;
        }
        if (!conditionSign.getValue()) {
            MessageBox.error('Choose condition sign');
            return;
        }
        if (!trueAction.getValue()) {
            MessageBox.error('Choose true action of IF operation');
            return;
        }

        var actionType = WebSystemsBuilder.utils.mapping.ActionTypes.Predicate;
        var PredicateAction = {
            UniqueID: RandomIDE.get(),
            EventActionTypeID: actionType,
            EventActionType: ActionTypes.getActionTypeName(actionType),
            ChildActions: [],
            TrueActionUniqueID: trueAction.Action.UniqueID,
            FalseActionUniqueID: falseAction.getValue() ? falseAction.Action.UniqueID : null,
            TrueAction: trueAction.Action,
            FalseAction: falseAction.Action
        };

        win.fireEvent('PredicateActionSaved', PredicateAction);
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