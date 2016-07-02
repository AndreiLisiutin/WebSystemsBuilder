Ext.define('WebSystemsBuilder.utils.operands.BaseControlHandler', {
    extend: 'WebSystemsBuilder.utils.operands.BaseOperandHandler',
    alternateClassName: ['BaseControlHandler'],


    _visualComponent: null,
    _controlInstance: null,

    getControlID: function() {
        return this._controlInstance.Control.ControlID;
    },
    getOperandID: function() {
        return this._controlInstance.Control.OperandID;
    },

    generateComponent: function (controlInstance, innerHandlers) {
        var _this = this;
        _this._controlInstance = controlInstance;

        var properties = controlInstance.Control;
        $.each(controlInstance.Properties, function (i, item) {
            var serializedValue = item.Property ? item.Property.Value
                : item.ControlTypePropertyType.DefaultValue;

            var realValue = WebSystemsBuilder.utils.mapping.ValueTypes
                .getValueFromString(serializedValue, item.PropertyType.ValueTypeID);
            properties[item.PropertyType.Name] = realValue;
        });

        if (innerHandlers && innerHandlers.length) {
            $.each(innerHandlers, function (i, item) {
                var arrayName = item.getSelfArrayName();
                properties[arrayName] = properties[arrayName] || [];
                properties[arrayName].push(item.getVisualComponent());
            });
        }

        this._visualComponent = _this.generateVisualComponent(properties);
        return this;
    },

    generateVisualComponent: function (properties) {
        var visualComponent = Ext.create(properties);
        return visualComponent;
    },

    getVisualComponent: function (properties) {
        return this._visualComponent;
    },

    getSelfArrayName: function (properties) {
        return 'items';
    },
    //----------------------------------OPERAND-------------------------------------------------------------------------
    getValue: function () {
        throw 'Component ' + this._getComponentClass() + ' has no value.';
    },
    setValue: function (value) {
        throw 'Component ' + this._getComponentClass() + ' has no value.';
    },
    //----------------------------------EVENTS--------------------------------------------------------------------------
    bindLoad: function (handler) {
        throw 'Component ' + this._getComponentClass() + ' doesn\'t support event type Load.';
    },
    bindClick: function (handler) {
        throw 'Component ' + this._getComponentClass() + ' doesn\'t support event type Click.';
    },
    bindClose: function (handler) {
        throw 'Component ' + this._getComponentClass() + ' doesn\'t support event type Close.';
    },
    bindChangeValue: function (handler) {
        throw 'Component ' + this._getComponentClass() + ' doesn\'t support event type ChangeValue.';
    },
    bindChangeSelection: function (handler) {
        throw 'Component ' + this._getComponentClass() + ' doesn\'t support event type ChangeSelection.';
    },
    //----------------------------------CLIENT ACTIONS------------------------------------------------------------------
    executeEnable: function (handler) {
        throw 'Component ' + this._getComponentClass() + ' doesn\'t support client action type Enable.';
    },
    executeDisable: function (handler) {
        throw 'Component ' + this._getComponentClass() + ' doesn\'t support client action type Disable.';
    },
    executeSetReadOnly: function (handler) {
        throw 'Component ' + this._getComponentClass() + ' doesn\'t support client action type SetReadOnly.';
    },
    executeSetNotReadOnly: function (handler) {
        throw 'Component ' + this._getComponentClass() + ' doesn\'t support client action type SetNotReadOnly.';
    },

    _getComponentClass: function () {
        var classPath = this.$className.split('.');
        return classPath[classPath.length - 1];
    }
});