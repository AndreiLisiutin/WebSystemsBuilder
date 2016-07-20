Ext.define('WebSystemsBuilder.utils.formGeneration.Form', {
    requires: [
        'WebSystemsBuilder.utils.mapping.ValueTypes',
        'WebSystemsBuilder.utils.mapping.EventTypes',
        'WebSystemsBuilder.utils.controlTypes.ComponentFactoryUtils',
        'WebSystemsBuilder.utils.operands.FormParameterHandler',
        'WebSystemsBuilder.utils.events.BaseAction'
    ],

    _paramHandlers: [],
    _controlHandlers: [],
    _form: null,
    _formID: null,
    _callback: null,

    constructor: function (config) {
        var formID = config.formID;
        var formParameters = config.formParameters;
        var callback = config.callback;
        this._controlHandlers = [];
        this._paramHandlers = [];
        this._form = null;
        this._callback = callback;
        this._formID = formID;
        this.createForm(formID, formParameters);
        this.callParent(arguments);
    },

    /**
     * Generate web-form.
     * @param formID form identifyer in metadescriptions DB
     * @param formParameters object with parameters values.
     * Format: { formParameterID: value }.
     * Example { 1:'value 1', 2:new Date() }
     */
    createForm: function (formID, formParameters) {
        var _this = this;
        if (!formID) {
            throw 'Incorrect form ID to create from meta-descriptions';
        }
        formParameters = formParameters || {};

        _this._consoleLog('Generating form #' + _this._formID);

        _this._getFormMeta(formID, function (formMeta) {
            //callback for this._getFormMeta() - part 2. Building web-form by metadata. Called after metadata request successfully finished
            _this._buildForm(formMeta, formParameters);

            //callback for form generation. For ope form action
            if (_this._callback) {
                _this._form.getVisualComponent().on('afterrender', function () {
                    _this._callback();
                });
            }

            _this._form.getVisualComponent().show();
        });
    },

    getControlByID: function (controlID) {
        var _this = this;
        var controls = _this._controlHandlers.filter(function (handler) {
            return handler.getControlID() == controlID;
        });

        if (controls.length != 1) {
            return null;
        }
        return controls[0];
    },

    getOperandByID: function (controlID) {
        var _this = this;
        var operands = _this.getOperands().filter(function (handler) {
            return handler.getOperandID && handler.getOperandID() == controlID;
        });

        if (operands.length != 1) {
            return null;
        }
        return operands[0];
    },

    getOperands: function () {
        var _this = this;
        var operands = _this._controlHandlers.concat(_this._paramHandlers)
            .filter(function (handler) {
                return handler.isOperand && handler.isOperand();
            });
        return operands;
    },

    getFormID: function () {
        var _this = this;
        return _this._formID;
    },

    _getFormMeta: function (formID, callback) {
        var _this = this;
        Ext.Ajax.request({
            url: 'FormMeta/GetFormMetaDescriptions',
            async: false,
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            params: {
                formID: formID
            },
            success: function (objServerResponse) {
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.Code == 0) {
                    callback(jsonResp.Data)
                } else {
                    WebSystemsBuilder.utils.MessageBox.error(jsonResp.resultMessage);
                }
            },
            failure: function (objServerResponse) {
                WebSystemsBuilder.utils.MessageBox.error(objServerResponse.responseText);
            }
        });
    },

    /**
     * Build form by meta-descriptions
     * @param formMeta meta-descriptions of form. Structure: WebSystemsBuilder.Server.Models.FormInstance.
     * See server code for more details
     * @param formParameters formParameters object with parameters values.
     * Format: { formParameterID: value }.
     * Example { 1:'value 1', 2:new Date() }
     * @returns {null}
     * @private
     */
    _buildForm: function (formMeta, formParameters) {
        var _this = this;
        //createing recursively form main component with children
        _this._form = _this._createControl(formMeta.RootControl);
        //initializing form parameters with values from @param formParameters
        _this._createParameters(formMeta.FormParameters, formParameters);
        //binding events to controlscreated in previous steps
        _this._bindEvents(formMeta.Events);
        return _this._form;
    },

    /**
     * Create form parameters and return list of their handlers
     * @param formParameters form parameters metadata.
     * Structre: Array<WebSystemsBuilder.Server.Models.FormParameterInstance>. For more info see server code.
     * @param parameterValues formParameters object with parameters values.
     * Format: { formParameterID: value }.
     * Example { 1:'value 1', 2:new Date() }
     * @returns {Array[WebSystemsBuilder.utils.operands.FormParameterHandler]} parameter handlers array
     * @private
     */
    _createParameters: function (formParameters, parameterValues) {
        var _this = this;
        $.each(formParameters, function (i, item) {
            //create parameter handler
            var value = parameterValues[item.FormParameter.FormParameterID] || null;
            var paramHandler = Ext.create('WebSystemsBuilder.utils.operands.FormParameterHandler')
                .generateParameter(item, value);
            //collect parameters handler
            _this._paramHandlers.push(paramHandler);
        });
        return _this._paramHandlers;
    },

    /**
     * Creating form control and recursively its child controls.
     * @param controlInstance control meta-descriptions. Subtree of web-form controls tree structure.
     * Struncture: WebSystemsBuilder.Server.Models.ControlInstance. See server code for more details
     * @returns control handler - objects that stores control metadata and performs control's actions.
     * Structure: WebSystemsBuilder.utils.operands.BaseControlHandler.
     * @private
     */
    _createControl: function (controlInstance) {
        var _this = this;

        _this._consoleLog('Generating form #' + _this._formID +
            ' control #' + controlInstance.Control.ControlID);

        //creating control handler by control type ID.
        var controlHandler = WebSystemsBuilder.utils.controlTypes.ComponentFactoryUtils
            .getFactory(controlInstance.Control.ControlTypeID);

        var innerHandlers = [];
        //recursively create child controls from control metadata subtree
        if (controlInstance.ChildControls && controlInstance.ChildControls.length) {
            $.each(controlInstance.ChildControls, function (i, item) {
                var innerHandler = _this._createControl(item);
                innerHandlers.push(innerHandler);
            });
        }
        //creating control visual component - ExtJS class that represents this control type with nested controls
        controlHandler.generateComponent(controlInstance, innerHandlers);
        //collecting control handlers for form management at runtime
        _this._controlHandlers.push(controlHandler);
        return controlHandler;
    },

    _bindEvents: function (eventInstances) {
        var _this = this;
        if (!eventInstances) {
            return;
        }
        $.each(eventInstances, function (index, item) {
            _this._bindEvent(item);
        });
    },

    _bindEvent: function (eventInstance) {
        var _this = this;
        var controlID = eventInstance.EventInstance.Event.ControlID;
        var eventID = eventInstance.EventInstance.Event.EventID;
        var eventTypeID = eventInstance.EventInstance.EventType.EventTypeID;
        var eventTypeName = eventInstance.EventInstance.EventType.Name;

        _this._consoleLog('Generating form #' + _this._formID + ' event #' + eventID + '. ');
        var control = _this.getControlByID(controlID);
        if (control == null) {
            throw 'Control for event not found (ControlID = ' + controlID +
            ', EventID = ' + eventID + ')';
        }
        var extJsControlID = control.getVisualComponent().getId();
        _this._consoleLog('---Control ' + extJsControlID + ' event ' + eventTypeName);

        var eventHandler = function () {
            var eventActions = [];
            $.each(eventInstance.EventActions, function (index, item) {
                var eventAction = WebSystemsBuilder.utils.events.BaseAction.createEvent({
                    eventAction: item,
                    form: _this,
                    executedActions: [],
                    parentAction: null,
                    actionSubtreeExecutedCallback: null
                });
                eventActions.push(eventAction);
            });
            $.each(eventActions, function (index, item) {
                item.executeAction();
            });
        };

        switch (eventTypeID) {
            case EventTypes.Load:
                control.bindLoad(eventHandler);
                break;
            case EventTypes.Click:
                control.bindClick(eventHandler);
                break;
            case EventTypes.Close:
                control.bindClose(eventHandler);
                break;
            case EventTypes.ChangeValue:
                control.bindChangeValue(eventHandler);
                break;
            case EventTypes.ChangeSelection:
                control.bindChangeSelection(eventHandler);
                break;
            default:
                throw 'Unknown event(EventTypeID = ' + eventTypeID + ') ';
        }
    },

    _consoleLog: function (text) {
        console.log('-----Form: ' + text);
    }
});
