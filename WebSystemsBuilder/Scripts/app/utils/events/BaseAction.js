Ext.define('WebSystemsBuilder.utils.events.BaseAction', {
    alternateClassName: ['BaseAction'],
    mixins: {
        observable: 'Ext.util.Observable'
    },
    requires: [
        'WebSystemsBuilder.utils.mapping.ActionTypes'
    ],

    /**
     * Metadata for current action
     */
    _eventAction: null,
    /**
     * form-owner of event instanter
     */
    _form: null,
    /**
     * Actions that will be ignored while processing current event. This set contains public.action.action_id.
     * Here could be actions that already executed on server side or that denied to execute by IF-THEN-ELSE operator
     */
    _executedActions: [],
    /**
     * action tha executed right before current
     */
    _parentAction: null,
    /**
     * callback that will be called after whole subtree wint this action as root will be completely executed
     */
    _actionSubtreeExecutedCallback: null,

    constructor: function (config) {
        this._executedActions = config.executedActions || [];
        this._eventAction = config.eventAction;
        this._form = config.form;
        this._parentAction = config.parentAction;
        this._actionSubtreeExecutedCallback = config.actionSubtreeExecutedCallback;
        this.mixins.observable.constructor.call(this, config);
    },

    /**
     * Return form-owner of event instanter
     * @returns {null}
     */
    getForm: function () {
        return this._form;
    },
    /**
     * Return event's metadata
     * @returns {null}
     */
    getEventAction: function () {
        return this._eventAction;
    },

    /**
     * Actions that will be ignored while processing current event. This set contains public.action.action_id.
     * Here could be actions that already executed on server side or that denied to execute by IF-THEN-ELSE operator.
     * @returns {Array}
     */
    getExecutedActions: function () {
        return this._executedActions;
    },


    /**
     * returns actionID
     * @returns {null}
     */
    getActionID: function () {
        return this._eventAction.EventAction.ActionID;
    },

    /**
     * Mark action as already executed or as action that must not be executed.
     * @param actionID
     * @private
     */
    _markActionAsExecuted: function (actionID) {
        var _this = this;
        if (_this._executedActions.indexOf(actionID) == -1) {
            _this._executedActions.push(actionID);
            // some action marked as executed - call method-handler of that event
            _this.onActionFromSubtreeExecuted();
        }
    },

    /**
     * Mark whole actions tree as executed. IF-THEN-ELSE needs for this
     * @param actionID
     * @private
     */
    _markActionsSubtreeAsExecuted: function (actionID) {
        var _this = this;
        var actionRoot = null;

        //find action-root of the subtree
        _this._bypassActionsSubtree(function (action) {
            if (action.EventAction.ActionID == actionID) {
                actionRoot = action;
            }
        });

        //mark all as executed
        _this._bypassActionsSubtree(function (action) {
            _this._markActionAsExecuted(action.EventAction.ActionID);
        }, actionRoot);
    },

    /**
     * Find out, is action already executed at the server side or maybe is action denied to execute by some reasons
     * @param actionID
     * @returns {boolean}
     * @private
     */
    _isActionExecuted: function (actionID) {
        var _this = this;
        return _this._executedActions.indexOf(actionID) != -1;
    },

    /**
     * Bypass actions subtree and find out, if it completely executed
     * @returns {boolean}
     * @private
     */
    _isActionsSubtreeExecuted: function () {
        var _this = this;
        var isExecuted = true;
        _this._bypassActionsSubtree(function (action) {
            if (!_this._isActionExecuted(action.EventAction.ActionID)) {
                isExecuted = false;
            }
        });
        return isExecuted;
    },

    /**
     * Bypass actions tree structure and perform some function
     * @param func functon to perform
     * @param action root of the tree
     * @private
     */
    _bypassActionsSubtree: function (func, action) {
        var _this = this;
        if (!action) {
            action = _this._eventAction;
        }
        func(action);
        $.each(action.ChildActions, function (index, item) {
            _this._bypassActionsSubtree(func, item);
        });
    },

    /**
     * Execute action. After execution call callback
     * @param callback
     */
    executeAction: function (callback) {

        if (callback) {
            callback();
        }
    },

    /**
     * Bypass child actions of curent action and execute them
     */
    executeChildActions: function () {
        var _this = this;
        $.each(_this._eventAction.ChildActions, function (index, item) {
            var action = WebSystemsBuilder.utils.events.BaseAction.createEvent({
                eventAction: item,
                form: _this.getForm(),
                executedActions: _this.getExecutedActions(),
                parentAction: _this,
                actionSubtreeExecutedCallback: null
            });
            action.execute();
        });
    },

    /**
     * Execute whole action
     */
    execute: function () {
        var _this = this;
        if (!_this._isActionExecuted(_this._eventAction.ActionID)) {
            //action not executed - need to execute action
            _this.executeAction(function () {
                //action executed callback: mark current action as executed
                _this._markActionAsExecuted(_this._eventAction.ActionID);
                //action executed callback: excute child actions
                _this.executeChildActions();
                //action executed callback: call action executed event handler
                _this.onActionFromSubtreeExecuted();
            });
        } else {
            //no need to execute anything - call child actions
            _this.executeChildActions();
            _this.onActionFromSubtreeExecuted();
        }
    },

    /**
     * Event handler. Event is "whole subtree of this action is executed"
     */
    onActionFromSubtreeExecuted: function () {
        var _this = this;
        if (_this._isActionsSubtreeExecuted()) {
            if (_this._actionSubtreeExecutedCallback) {
                //if have executed callback - execute it
                _this._actionSubtreeExecutedCallback();
            }
        }

        //pass this event up to actions hierachy (to parent action)
        if (_this._parentAction) {
            _this._parentAction.onActionFromSubtreeExecuted();
        }
    },

    statics: {
        /**
         * Event action factory
         * @param config
         * @returns {*}
         */
        createEvent: function (config) { 
            var actionTypeID = config.eventAction.ActionTypeID;
            var newConfig = {
                eventAction: config.eventAction,
                form: config.form,
                executedActions: config.executedActions,
                parentAction: config.parentAction,
                actionSubtreeExecutedCallback: config.actionSubtreeExecutedCallback
            };
            switch (actionTypeID) {
                case ActionTypes.Client:
                    return Ext.create('WebSystemsBuilder.utils.events.ClientAction', newConfig);
                    break;
                case ActionTypes.OpenForm:
                    return Ext.create('WebSystemsBuilder.utils.events.OpenFormAction', newConfig);
                    break;
                case ActionTypes.Predicate:
                    return Ext.create('WebSystemsBuilder.utils.events.PredicateAction', newConfig);
                    break;
                case ActionTypes.Server:
                    return Ext.create('WebSystemsBuilder.utils.events.ServerAction', newConfig);
                    break;
                case ActionTypes.Query:
                    return Ext.create('WebSystemsBuilder.utils.events.QueryAction', newConfig);
                    break;
                default:
                    throw 'Unknown event action type (ActionTypeID = ' + actionTypeID + ')';
                    break;
            }
        }
    }
});