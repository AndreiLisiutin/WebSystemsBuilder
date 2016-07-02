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

    createForm: function (formID, formParameters) {
        var _this = this;
        formID = formID || 1;
        formParameters = formParameters
            || {
                1: 1
            };
        _this._consoleLog('Generating form #' + _this._formID);
        _this._getFormMeta(formID, function (formMeta) {
            _this._buildForm(formMeta, formParameters);

            if (_this._callback) {
                _this._form.getVisualComponent().on('afterrender', function() {
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
        var operands = _this._controlHandlers.concat(_this._paramHandlers)
            .filter(function (handler) {
                return handler.getOperandID && handler.getOperandID() == controlID;
            });

        if (operands.length != 1) {
            return null;
        }
        return operands[0];
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

    _buildForm: function (formMeta, formParameters) {
        var _this = this;
        _this._form = _this._сreateControl(formMeta.RootControl);
        _this._createParameters(formMeta.FormParameters, formParameters);
        _this._bindEvents(formMeta.Events);
        return _this._form;
    },

    _createParameters: function (formParameters, parameterValues) {
        var _this = this;
        var paramHandlers = [];
        $.each(formParameters, function (i, item) {
            var value = parameterValues[item.FormParameter.FormParameterID] || null;
            paramHandlers.push(_this._createParameter(item));
        });
        return paramHandlers;
    },

    _createParameter: function (parameterInstance, value) {
        var _this = this;
        var paramHandler = Ext.create('WebSystemsBuilder.utils.operands.FormParameterHandler')
            .generateParameter(parameterInstance, value);
        _this._paramHandlers.push(paramHandler);
        return paramHandler;
    },

    _сreateControl: function (controlInstance) {
        var _this = this;

        _this._consoleLog('Generating form #' + _this._formID +
            ' control #' + controlInstance.Control.ControlID);

        var controlHandler = WebSystemsBuilder.utils.controlTypes.ComponentFactoryUtils
            .getFactory(controlInstance.Control.ControlTypeID);

        var innerHandlers = [];
        if (controlInstance.ChildControls && controlInstance.ChildControls.length) {
            $.each(controlInstance.ChildControls, function (i, item) {
                var innerHandler = _this._сreateControl(item);
                innerHandlers.push(innerHandler);
            });
        }
        controlHandler.generateComponent(controlInstance, innerHandlers);
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

        _this._consoleLog('Generating form #' + _this._formID + ' event #' + eventID);
        var control = _this.getControlByID(controlID);
        if (control == null) {
            throw 'Control for event not found (ControlID = ' + controlID +
            ', EventID = ' + eventID + ')';
        }

        var eventActions = [];
        $.each(eventInstance.EventActions, function (index, item) {
            var eventAction = WebSystemsBuilder.utils.events.BaseAction.createEvent(item, _this);
            eventActions.push(eventAction);
        });
        var eventHandler = function () {
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
